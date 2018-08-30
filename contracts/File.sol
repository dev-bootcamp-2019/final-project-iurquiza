
import "own3d/owned.sol";

pragma solidity ^0.4.17;

/**
 * @title File
 * @author Israel Urquiza
 * @dev FilesPoE allows users to create and instance of contract that stores file data.
 * @notice IPFS uses a multihash format and Base58 encoding. The IPFS multihash digest is 32 bytes in length. This makes it ideal to work with using Solidity. It is also better for storage in terms of cost in comparison with storing the base58 multihash as a string.
 */
contract File is owned {

    event ContractTerminated(address owner);

    struct Data {
        bytes32 _ipfsHashDigest;
        address _owner;
        string _name;
        uint _size;
        string _type;
        uint _lastModified;
        string _otherMetadata;
    }

    Data public data;

    constructor(
        bytes32 _ipfsHashDigest,
        address _owner,
        string _name,
        uint _size,
        string _type,
        uint _lastModified,
        string _otherMetadata
        )
        public
    {
        data._ipfsHashDigest = _ipfsHashDigest;
        data._owner = _owner;
        data._name = _name;
        data._size = _size;
        data._type = _type;
        data._lastModified = _lastModified;
        data._otherMetadata = _otherMetadata;
    }

    /**
     * @dev Retrieves the data store in the file contract instance.
     * @notice Takes separate parameters to overcome Web3's limitation in retrieving structures.
     * @return _ipfsHashDigest Bytes32 version of the file's IPFS hash.
     * @return _owner Address of the file's owner
     * @return _name Name of the file
     * @return _size Size of the file
     * @return _type Type of the file
     * @return _lastModified Last modified date of the file as the number of milliseconds since the Unix epoch
     * @return _otherMetadata Other metadata about the file
     */
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
            data._ipfsHashDigest,
            data._owner,
            data._name,
            data._size,
            data._type,
            data._lastModified,
            data._otherMetadata
        );
    }

    /**
     * @dev Destroys the contract instance.
     * @notice Can only be called by the contract's owner.
     */
    function terminate()
        public
        onlyowner()
    {
        emit ContractTerminated(owner);
        selfdestruct(owner);
    }
}