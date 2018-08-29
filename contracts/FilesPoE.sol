pragma solidity ^0.4.17;

import "./File.sol";
import "../installed_contracts/own3d/contracts/owned.sol";

contract FilesPoE is owned {

    bool private fileGetAbility = false;
    bool private fileAddAbility = false;
    bool private circuitBreaker = false;

    event FileAdded(address indexed fileAddress);
    event FileGetAbilityToggled(bool fileGetAbility);
    event FileAddAbilityToggled(bool fileAddAbility);
    event CircuitBreakerToggled(bool circuitBreaker);
    event ContractTerminated(address owner);

    mapping(bytes32 => bool) private proofs;
    mapping(bytes32 => address) private files;
    mapping(address => address[]) private userFiles;

    modifier fileNotInProofs(bytes32 ipfsHashDigest) {
        require(!proofs[ipfsHashDigest], "File already in proofs.");
        _;
    }

    modifier circuitBreakerEmergecy {
        if(!circuitBreaker) _;
    }

    modifier stopGetInEmergency {
        if(!fileGetAbility) _;
    }

    modifier stopAddInEmergency {
        if(!fileAddAbility) _;
    }

    function toggleFileGetAbility()
        public
        onlyowner()
    {
        fileGetAbility = !fileGetAbility;
        emit FileGetAbilityToggled(fileGetAbility);
    }

    function toggleFileAddAbility()
        public
        onlyowner()
    {
        fileAddAbility = !fileAddAbility;
        emit FileAddAbilityToggled(fileAddAbility);
    }

    function toggleCircuitBreaker()
        public
        onlyowner()
    {
        circuitBreaker = !circuitBreaker;
        emit CircuitBreakerToggled(circuitBreaker);
    }

    function terminate()
        public
        onlyowner()
    {
        emit ContractTerminated(owner);
        selfdestruct(owner);
    }

    // Using separate parameters for ease of use with Web3
    function addFile(
        bytes32 _ipfsHashDigest,
        address _owner,
        string _name,
        uint _size,
        string _mimeType,
        uint _lastModified,
        string _otherMetadata
        )
        public
        circuitBreakerEmergecy()
        stopAddInEmergency()
        fileNotInProofs(_ipfsHashDigest)
        returns (address)
    {
        address newFile = new File(
            _ipfsHashDigest,
            _owner,
            _name,
            _size,
            _mimeType,
            _lastModified,
            _otherMetadata
        );
        
        files[_ipfsHashDigest] = newFile;
        // Use _owner instead of msg.sender as ownership may be assignable.
        userFiles[_owner].push(newFile);

        emit FileAdded(newFile);
        return newFile;
    }

    // Using separate parameters for ease of use with Web3
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

    function getUserFilesCount(address userAddress)
        public view
        circuitBreakerEmergecy()
        returns(uint)
    {
        return userFiles[userAddress].length;
    }

    function getUserFileAddress(address userAddress, uint index)
        public view
        circuitBreakerEmergecy()
        returns(address)
    {
        return userFiles[userAddress][index];
    }

    function hashValue(string value) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(value));
    }
}