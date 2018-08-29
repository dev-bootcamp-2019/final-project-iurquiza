var FilesPoE = artifacts.require("./FilesPoE.sol");

contract("FilesPoE", function(accounts) {
  it("...should store the value 89.", function() {
    return FilesPoE.deployed()
      .then(function(instance) {
        filesPoEInstance = instance;

        return filesPoEInstance.set(89, { from: accounts[0] });
      })
      .then(function() {
        return filesPoEInstance.get.call();
      })
      .then(function(storedData) {
        assert.equal(storedData, 89, "The value 89 was not stored.");
      });
  });
});
