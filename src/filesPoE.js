import web3 from "./web3";

//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
const address = "0x2e2c5ff63d8403ee1850e0f087b1b19938a5cab5";
//use the ABI from your contract
const abi = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "bytes32"
      }
    ],
    name: "files",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "fileAddress",
        type: "address"
      }
    ],
    name: "FileAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "fileGetAbility",
        type: "bool"
      }
    ],
    name: "FileGetAbilityToggled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "fileAddAbility",
        type: "bool"
      }
    ],
    name: "FileAddAbilityToggled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "circuitBreaker",
        type: "bool"
      }
    ],
    name: "CircuitBreakerToggled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "owner",
        type: "address"
      }
    ],
    name: "ContractTerminated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "fileAddress",
        type: "address"
      }
    ],
    name: "PoEFileDestroyed",
    type: "event"
  },
  {
    constant: false,
    inputs: [],
    name: "toggleFileGetAbility",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "toggleFileAddAbility",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "toggleCircuitBreaker",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "terminate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "fileAddress",
        type: "address"
      }
    ],
    name: "destroyFile",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_ipfsHashDigest",
        type: "bytes32"
      },
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "_name",
        type: "string"
      },
      {
        name: "_size",
        type: "uint256"
      },
      {
        name: "_type",
        type: "string"
      },
      {
        name: "_lastModified",
        type: "uint256"
      },
      {
        name: "_otherMetadata",
        type: "string"
      }
    ],
    name: "addFile",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "fileAddress",
        type: "address"
      }
    ],
    name: "getFile",
    outputs: [
      {
        name: "",
        type: "bytes32"
      },
      {
        name: "",
        type: "address"
      },
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "uint256"
      },
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "uint256"
      },
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "userAddress",
        type: "address"
      }
    ],
    name: "getUserFilesCount",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "userAddress",
        type: "address"
      },
      {
        name: "index",
        type: "uint256"
      }
    ],
    name: "getUserFileAddress",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

export default new web3.eth.Contract(abi, address);
