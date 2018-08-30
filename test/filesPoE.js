import {
  getBytes32FromIpfsHash,
  getIpfsHashFromBytes32
} from "../src/helpers/ipfsHash";

var FilesPoE = artifacts.require("./FilesPoE.sol");

const ipfsHash1 = "QmZuK6V9rmmzTneJqXEJ5x6p2mQ8JfCBqK2rEg9QcseUoq";
const ipfsHash2 = "QmNhN4Ku18odu3v9GrLLVBtrrfUcDkvHkM5Ukjy8FFh7gR";

const fileName = "testfile.jpg";
const fileSize = 5;
const fileType = "image/jpeg";
const fileLastModified = 5;
const fileOtherMetadata = "metadata";

async function addsFileHelper(_contract, _ipfsHash, _account) {
  await _contract.addFile(
    getBytes32FromIpfsHash(_ipfsHash),
    _account,
    fileName,
    fileSize,
    fileType,
    fileLastModified,
    fileOtherMetadata,
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
    await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    const ipfsHash32 = getBytes32FromIpfsHash(ipfsHash1);
    const fileAddress = await filesPoE.files(ipfsHash32);
    assert.ok(web3.isAddress(fileAddress));
  });

  it("allows adding different files", async () => {
    const filesPoE = await FilesPoE.new();
    await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    await addsFileHelper(filesPoE, ipfsHash2, accounts[0]);
    const ipfsHash32 = getBytes32FromIpfsHash(ipfsHash2);
    const fileAddress = await filesPoE.files(ipfsHash32);
    assert.ok(web3.isAddress(fileAddress));
  });

  it("rejects adding duplicate file", async () => {
    try {
      const filesPoE = await FilesPoE.new();
      await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
      await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("adds file, gets file address, and get file data", async () => {
    const filesPoE = await FilesPoE.new();
    await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    const ipfsHash32 = getBytes32FromIpfsHash(ipfsHash1);
    const fileAddress = await filesPoE.files(ipfsHash32);
    const fileData = await filesPoE.getFile(fileAddress);

    const _ipfsHashDigest = getIpfsHashFromBytes32(fileData[0]);
    const _owner = fileData[1];
    const _name = fileData[2];
    const _size = fileData[3].toNumber();
    const _type = fileData[4];
    const _lastModified = fileData[5];
    const _otherMetadata = fileData[6];

    assert.equal(_ipfsHashDigest, ipfsHash1);
    assert.equal(_owner, accounts[0]);
    assert.equal(_name, fileName);
    assert.equal(_size, fileSize);
    assert.equal(_type, fileType);
    assert.equal(_lastModified, fileLastModified);
    assert.equal(_otherMetadata, fileOtherMetadata);
  });

  it("can retrieve user file count and user file addresses", async () => {
    const filesPoE = await FilesPoE.new();
    await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    await addsFileHelper(filesPoE, ipfsHash2, accounts[0]);

    let userFilesCount = await filesPoE.getUserFilesCount(accounts[0]);
    userFilesCount = userFilesCount.toNumber();

    assert.equal(userFilesCount, 2);

    for (let i = 0; i < userFilesCount; i++) {
      let userFileAddress = await filesPoE.getUserFileAddress(accounts[0], i);
      assert.ok(web3.isAddress(userFileAddress));
    }
  });

  it("destroys a file and logs event", async () => {
    const filesPoE = await FilesPoE.new();
    await addsFileHelper(filesPoE, ipfsHash1, accounts[0]);
    const ipfsHash32 = getBytes32FromIpfsHash(ipfsHash1);
    const fileAddress = await filesPoE.files(ipfsHash32);

    const fileDestroyed = await filesPoE.destroyFile(fileAddress);
    const event = fileDestroyed.logs[0].event;
    assert.equal(event, "PoEFileDestroyed");
  });
});
