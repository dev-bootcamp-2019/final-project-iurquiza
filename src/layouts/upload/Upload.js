import { Table, Button, Form } from "react-bootstrap";
import React, { Component } from "react";
import web3 from "../../web3";
import ipfs from "../../ipfs";
import filesPoE from "../../filesPoE";
import { getBytes32FromIpfsHash } from "../../ipfsHash";

class Upload extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
    this.init();
  }
  state = {
    ipfsHash: null,
    buffer: "",
    ethAddress: "",
    blockNumber: "",
    transactionHash: "",
    gasUsed: "",
    txReceipt: "",
    file: null,
    fileMetadata: null,
    tags: [{ k: { name: "tag0", value: "" }, v: { name: "tag0", value: "" } }],
    account: ""
  };

  init = async () => {
    //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });

    console.log("Sending from metamask account: " + this.state.account);

    //obtain contract address from filesPoE.js
    const ethAddress = await filesPoE.options.address;
    this.setState({ ethAddress });
  };

  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ file });
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async reader => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  onClick = async () => {
    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });

      // get Transaction Receipt in console on click
      // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await web3.eth.getTransactionReceipt(
        this.state.transactionHash,
        (err, txReceipt) => {
          console.log(err, txReceipt);
          this.setState({ txReceipt });
        }
      ); //await for getTransactionReceipt

      await this.setState({ blockNumber: this.state.txReceipt.blockNumber });
      await this.setState({ gasUsed: this.state.txReceipt.gasUsed });
    } catch (error) {
      //try
      console.log(error);
    } //catch
  }; //onClick

  onSubmit = async event => {
    event.preventDefault();

    const fileMetadata = this.state.tags
      .filter(kvp => {
        return !(kvp.k.value.trim() === "" || kvp.v.value.trim() === "");
      })
      .map(kvp => {
        return { [kvp.k.value]: kvp.v.value };
      });

    this.setState({ fileMetadata });

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash
      this.setState({ ipfsHash: ipfsHash[0].hash });

      // call Ethereum contract method "addFile" and .send IPFS hash to etheruem contract
      //return the transaction hash from the ethereum contract
      //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      filesPoE.methods
        .addFile(
          getBytes32FromIpfsHash(this.state.ipfsHash),
          this.state.account,
          this.state.file.name,
          this.state.file.size,
          this.state.file.type,
          this.state.file.lastModified,
          JSON.stringify(this.state.fileMetadata)
        )
        .send(
          {
            from: this.state.account
          },
          (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({ transactionHash });
          }
        ); //filesPoE
    }); //await ipfs.add
  }; //onSubmit

  appendInput = () => {
    var newInput = {
      k: { name: `tag${this.state.tags.length}`, value: "" },
      v: { name: `tag${this.state.tags.length}`, value: "" }
    };
    this.setState({ tags: this.state.tags.concat([newInput]) });
  };

  handleTagKeyChange = tagName => evt => {
    var numberPattern = /\d+/g;
    const index = tagName.match(numberPattern);
    let newTags = this.state.tags;
    newTags[index].k.value = evt.target.value;

    this.setState({ tags: newTags });
  };

  handleTagValueChange = tagName => evt => {
    var numberPattern = /\d+/g;
    const index = tagName.match(numberPattern);
    let newTags = this.state.tags;
    newTags[index].v.value = evt.target.value;

    this.setState({ tags: newTags });
  };

  render() {
    const fileInputStyle = { display: "inline-block" };
    return (
      <main className="container text-center">
        <h1>{this.props.authData.name}</h1>
        <h4>{this.state.account}</h4>
        <h2>Choose image to upload to IPFS</h2>

        <p>
          Add metadata about your image in the fields below. Click the 'KVP'
          button for extra fields. Click 'Upload' once the image has been
          selected and the metadata filled.
        </p>

        <button className="btn btn-info" onClick={() => this.appendInput()}>
          Add KVP
        </button>

        <br />
        <br />

        <Form onSubmit={this.onSubmit}>
          <Table id="dynamicInput" bordered responsive>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              {this.state.tags.map(tag => (
                <tr key={tag.k.name}>
                  <td>
                    <input
                      type="text"
                      name={tag.k.name}
                      value={tag.k.value}
                      key={tag.k.name + "-key"}
                      onChange={this.handleTagKeyChange(tag.k.name)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name={tag.v.name}
                      value={tag.v.value}
                      key={tag.v + "-value"}
                      onChange={this.handleTagValueChange(tag.v.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br />
          <input
            style={fileInputStyle}
            className="btn btn-default"
            type="file"
            onChange={this.captureFile}
          />
          &nbsp;
          <Button bsStyle="primary" type="submit">
            Upload
          </Button>
        </Form>
        <hr />

        <Table bordered responsive className="text-left">
          <thead>
            <tr>
              <th>Tx Receipt Category</th>
              <th>Values</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>IPFS Hash # stored on Eth Contract</td>
              <td>{this.state.ipfsHash}</td>
            </tr>
            <tr>
              <td>Ethereum Contract Address</td>
              <td>{this.state.ethAddress}</td>
            </tr>

            <tr>
              <td>Tx Hash # </td>
              <td>{this.state.transactionHash}</td>
            </tr>

            <tr>
              <td>Block Number # </td>
              <td>{this.state.blockNumber}</td>
            </tr>

            <tr>
              <td>Gas Used</td>
              <td>{this.state.gasUsed}</td>
            </tr>
          </tbody>
        </Table>

        <Button onClick={this.onClick}> Get Transaction Receipt </Button>
      </main>
    );
  } //render
}

export default Upload;
