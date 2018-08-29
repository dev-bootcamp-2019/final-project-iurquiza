pragma solidity ^0.4.17;

contract File {

    struct Data {
        bytes32 ipfsHashDigest;
        address owner;
        string name;
        uint size;
        string mimeType;
        uint lastModified;
        string otherMetadata;
    }

    Data public data;

    constructor(
        bytes32 _ipfsHashDigest,
        address _owner,
        string _name,
        uint _size,
        string _mimeType,
        uint _lastModified,
        string _otherMetadata
        )
        public
    {
        data.ipfsHashDigest = _ipfsHashDigest;
        data.owner = _owner;
        data.name = _name;
        data.size = _size;
        data.mimeType = _mimeType;
        data.lastModified = _lastModified;
        data.otherMetadata = _otherMetadata;
    }

    // Using separate parameters for ease of use with Web3
    function getFileFields()
        public view
        returns (
            bytes32,
            address,
            string,
            uint,
            string,
            uint,
            string
        )
    {
        return(
            data.ipfsHashDigest,
            data.owner,
            data.name,
            data.size,
            data.mimeType,
            data.lastModified,
            data.otherMetadata
        );
    }

}