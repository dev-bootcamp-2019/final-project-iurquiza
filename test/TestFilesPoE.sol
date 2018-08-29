pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FilesPoE.sol";

contract TestFilesPoE {

    function testItStoresAValue() public {
        FilesPoE filesPoE = FilesPoE(DeployedAddresses.FilesPoE());

        filesPoE.set(89);

        uint expected = 89;

        Assert.equal(filesPoE.get(), expected, "It should store the value 89.");
    }

}
