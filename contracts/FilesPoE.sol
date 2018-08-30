pragma solidity ^0.4.17;

import "./File.sol";
import "own3d/owned.sol";

/**
 * @title Files Proof of Existence
 * @author Israel Urquiza
 * @dev FilesPoE allows users to add a 32bytes version of a file's IPFS hash along with other related data.
 * @dev The contract subtypes the owned contract.
 * @notice IPFS itself is a proof of existence application.
 * @notice This application only proves the files existence in an instance of the contract.
 * @notice IPFS uses a multihash format and Base58 encoding. The IPFS multihash digest is 32 bytes in length. This makes it ideal to work with using Solidity. It is also better for storage in terms of cost in comparison with storing the base58 multihash as a string.
 */
contract FilesPoE is owned {

    event FileAdded(address indexed fileAddress);
    event FileGetAbilityToggled(bool fileGetAbility);
    event FileAddAbilityToggled(bool fileAddAbility);
    event CircuitBreakerToggled(bool circuitBreaker);
    event ContractTerminated(address owner);
    
    bool private fileGetAbility = false;
    bool private fileAddAbility = false;
    bool private circuitBreaker = false;

    mapping(bytes32 => address) public files;
    mapping(address => address[]) private userFiles;

    /**
     * @dev Throws an exception if the file already exists in the file list.
     * @param ipfsHashDigest Bytes32 version of the IPFS digest
     */
    modifier fileNotInFiles(bytes32 ipfsHashDigest) {
        require(files[ipfsHashDigest] == address(0), "File already in Files.");
        _;
    }

    /**
     * @dev Disables function when circuitBreaker is set to true.
     */
    modifier circuitBreakerEmergecy {
        if(!circuitBreaker) _;
    }

    /**
     * @dev Disables get function when fileGetAbility is set to true.
     */
    modifier stopGetInEmergency {
        if(!fileGetAbility) _;
    }

    /**
    * @dev Disables add function when fileAddAbility is set to true.
    */
    modifier stopAddInEmergency {
        if(!fileAddAbility) _;
    }

    /**
     * @dev Toggles the ability to get a file.
     */
    function toggleFileGetAbility()
        public
        onlyowner()
    {
        fileGetAbility = !fileGetAbility;
        emit FileGetAbilityToggled(fileGetAbility);
    }

    /**
     * @dev Toggles the ability to add a file.
     */
    function toggleFileAddAbility()
        public
        onlyowner()
    {
        fileAddAbility = !fileAddAbility;
        emit FileAddAbilityToggled(fileAddAbility);
    }

    /**
     * @dev Toggles the ability to call multiple functions in case of emergency.
     */
    function toggleCircuitBreaker()
        public
        onlyowner()
    {
        circuitBreaker = !circuitBreaker;
        emit CircuitBreakerToggled(circuitBreaker);
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

    /**
     * @dev Creates and instance of the File contract using the file's detail provide and stores the File instance's address in the local files mapping using the bytes32 version of the file's IPFS hash as the key.
     * @dev Emits a FileAdded event when the file is successfully added. Throws if the file already exists in the list.
     * @notice Takes separate parameters to overcome Web3's limitation with passing structures.
     * @notice The owner parameter does not determine the owner of created File contract instance. It is a user provide parameter to specify file ownership—e.g., commissioned files.  
     * @param _ipfsHashDigest Bytes32 version of the file's IPFS hash.
     * @param _owner Address of the file's owner
     * @param _name Name of the file
     * @param _size Size of the file
     * @param _type Type of the file
     * @param _lastModified Last modified date of the file as the number of milliseconds since the Unix epoch
     * @param _otherMetadata Other metadata about the file
     */
    function addFile(
        bytes32 _ipfsHashDigest,
        address _owner,
        string _name,
        uint _size,
        string _type,
        uint _lastModified,
        string _otherMetadata
        )
        public
        circuitBreakerEmergecy()
        stopAddInEmergency()
        fileNotInFiles(_ipfsHashDigest)
        returns (address)
    {
        address newFile = new File(
            _ipfsHashDigest,
            _owner,
            _name,
            _size,
            _type,
            _lastModified,
            _otherMetadata
        );
        
        files[_ipfsHashDigest] = newFile;
        userFiles[_owner].push(newFile);

        emit FileAdded(newFile);
        return newFile;
    }

    /**
     * @dev Retrieves the data of a previously added file.
     * @notice Takes separate parameters to overcome Web3's limitation in retrieving structures.
     * @return _ipfsHashDigest Bytes32 version of the file's IPFS hash.
     * @return _owner Address of the file's owner
     * @return _name Name of the file
     * @return _size Size of the file
     * @return _type Type of the file
     * @return _lastModified Last modified date of the file as the number of milliseconds since the Unix epoch
     * @return _otherMetadata Other metadata about the file
     */
    function getFile(
        address fileAddress
        )
        public view
        circuitBreakerEmergecy()
        stopGetInEmergency()
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
        File file = File(fileAddress);
        return file.getFileFields();
    }

     /**
     * @dev Retrieves the count of files added by a specific user
     * @notice This is a utility function to overcome Web3's limitations with passing dynamic arrays. It is use to loop through a range and retrive one item at a time.
     * @param userAddress Address of the user that added the files
     * @return Length of the user's array of file addresses
     */
    function getUserFilesCount(address userAddress)
        public view
        circuitBreakerEmergecy()
        returns(uint)
    {
        return userFiles[userAddress].length;
    }

    /**
     * @dev Retrieves the address of a specific file added by a specific user
     * @notice This is a utility function to overcome Web3's limitation with passing dynamic arrays. It is use to loop through a range and retrive one item at a time.
     * @param userAddress Address of the user that added the file
     * @param index Index of the user file
     * @return Address of specified file
     */
    function getUserFileAddress(address userAddress, uint index)
        public view
        circuitBreakerEmergecy()
        returns(address)
    {
        return userFiles[userAddress][index];
    }
}