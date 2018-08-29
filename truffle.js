var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic =
  "tennis three puppy senior ring poet toward enforce category sniff priority slice";
var apiKey = "531a5ccfdc5648628abc40f03ea90c71";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/${apiKey}`
        );
      },
      network_id: 5
    }
  }
};
