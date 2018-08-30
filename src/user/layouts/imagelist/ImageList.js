import { Table, Button } from "react-bootstrap";
import React, { Component } from "react";
import web3 from "../../../web3";
import filesPoE from "../../../filesPoE";
import { getIpfsHashFromBytes32 } from "../../../helpers/ipfsHash";
import ImageModal from "./ImageModal";

class ImageList extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
    this.init();
  }
  state = {
    userFilesCount: 0,
    userFiles: [],
    account: ""
  };

  init = async () => {
    //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });

    console.log("Sending from metamask account: " + this.state.account);

    // call Ethereum contract method "addFile" and .send IPFS hash to etheruem contract
    //return the transaction hash from the ethereum contract
    //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
    this.state.userFilesCount = await filesPoE.methods
      .getUserFilesCount(this.state.account)
      .call();

    const userFilesLocal = [];

    for (let i = 0; i < this.state.userFilesCount; i++) {
      const userFileAddress = await filesPoE.methods
        .getUserFileAddress(this.state.account, i)
        .call();
      const userFile = await filesPoE.methods.getFile(userFileAddress).call();
      userFilesLocal.push(userFile);
    }

    this.setState({ userFiles: userFilesLocal });
  };

  formatDate = secNum => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const update = new Date(secNum);
    const theMonth = update.getMonth();
    const theDate = update.getDate();
    const theYear = update.getFullYear();
    return `${monthNames[theMonth]} ${theDate}, ${theYear}`;
  };

  printMetadata = json => {
    let html = "";
    json.forEach(target => {
      for (let k in target) {
        if (typeof target[k] !== "function") {
          html += `<label>${k}:</label>&nbsp;&nbsp;<span>${
            target[k]
          }</span><br/>`;
        }
      }
    });
    return html;
  };

  render() {
    return (
      <main className="container">
        <ImageModal
          ref={instance => {
            this.modal = instance;
          }}
        />
        <h1>{this.props.authData.name}</h1>
        <h4>{this.state.account}</h4>
        <h2>Your Images</h2>
        {this.state.userFiles.map(userFile => (
          <Table bordered responsive key={userFile[0]}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IPFS Hash</td>
                <td>
                  <Button
                    onClick={() =>
                      this.modal.handleShow(
                        getIpfsHashFromBytes32(userFile[0]),
                        userFile[2],
                        userFile[4]
                      )
                    }
                  >
                    {getIpfsHashFromBytes32(userFile[0])}
                  </Button>
                </td>
              </tr>
              <tr>
                <td>Owner's Address</td>
                <td>{userFile[1]}</td>
              </tr>
              <tr>
                <td>Image Name</td>
                <td>{userFile[2]}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{userFile[3]} bytes</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{userFile[4]}</td>
              </tr>
              <tr>
                <td>Last Modified</td>
                <td>{this.formatDate(parseInt(userFile[5]))}</td>
              </tr>
              <tr>
                <td>Other Metadata</td>
                <td>
                  <div
                    className="Container"
                    dangerouslySetInnerHTML={{
                      __html: this.printMetadata(eval(userFile[6]))
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        ))}
      </main>
    );
  }
}

export default ImageList;
