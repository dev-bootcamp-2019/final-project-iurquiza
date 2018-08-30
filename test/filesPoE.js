import {
  getBytes32FromIpfsHash,
  getIpfsHashFromBytes32
} from "../helpers/ipfsHash";

var FilesPoE = artifacts.require("./FilesPoE.sol");

const ipfsHash1 = "QmZuK6V9rmmzTneJqXEJ5x6p2mQ8JfCBqK2rEg9QcseUoq";
const ipfsHash2 = "QmNhN4Ku18odu3v9GrLLVBtrrfUcDkvHkM5Ukjy8FFh7gR";

async function addsFileHelper(_contract, _ipfsHash, _account) {
  await _contract.addFile(
    getBytes32FromIpfsHash(_ipfsHash),
    _account,
    "testfile.jpg",
    5,
    "image/jpeg",
    5,
    "metadata",
    { from: _account }
  );
}

contract("FilesPoE", async accounts => {
  it("deploys a contract", async () => {
    const filesPoE = await FilesPoE.deployed();
    const ethAddress = filesPoE.address;
    assert.ok(web3.isAddress(ethAddress));
  });

  it("adds a file", async () => {
    const filesPoE = await FilesPoE.deployed();
    addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    const ipfsHash32 = getBytes32FromIpfsHash(ipfsHash1);
    const fileAddress = await filesPoE.files(ipfsHash32);
    assert.ok(web3.isAddress(fileAddress));
  });

  it("rejects adding duplicate file", async () => {
    try {
      const filesPoE = await FilesPoE.deployed();
      await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
      await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  /*
  it("allows adding different files", async () => {
    const filesPoE = await FilesPoE.deployed();
    addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    //addsFileHelper(filesPoE, ipfsHash2, accounts[0]);
    const ipfsHash32 = getBytes32FromIpfsHash(ipfsHash1);
    //const fileAddress = await filesPoE.files(ipfsHash32);

    assert.ok(true);
    //assert.ok(web3.isAddress(fileAddress));
  });


  //add file
  filesPoE.methods
    .addFile(
      getBytes32FromIpfsHash(ipfsHash),
      account,
      file.name,
      file.size,
      file.type,
      file.lastModified,
      JSON.stringify(fileMetadata)
    )
    .send(
      {
        from: account
      },
      (error, transactionHash) => {
        console.log(transactionHash);
        this.setState({ transactionHash });
      }
    );

  userFilesCount = await filesPoE.methods.getUserFilesCount(account).call();

  const userFilesLocal = [];

  for (let i = 0; i < userFilesCount; i++) {
    const userFileAddress = await filesPoE.methods
      .getUserFileAddress(account, i)
      .call();
    const userFile = await filesPoE.methods.getFile(userFileAddress).call();

    //userFile[0] - userFile[6]
    userFilesLocal.push(userFile);
  }
*/
});
