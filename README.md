# Proof of Existence application built using uPort + IPFS + React + Solidity

## What does your project do?

The application allows the user to log in using uPort.

Once logged in the user can upload images to IPFS along with extra metadata.
http://localhost:3000/upload

The user can also retrieve the images and their associated data.
http://localhost:3000/myimages

The application uses 3 Solidity contracts besides the ones involved in uPort and IPFS.
One is the library contract `owned.sol` from the `own3d` EthPM package.
The other two are `FilesPoE.sol` and `File.sol` specifically developed for this application.

## How to set it up and run a local development server

To test the application you will need to install the `uPort` application in you mobile phone.

You will also need to have `Docker` installed.

To test the application:

Clone the repository.

From the root directory of the cloned repository run the following commands.

```docker image build -t react:app .```

```docker container run -it -p 3000:3000 react:app```

Once the application is being served open a browser to:
http://localhost:3000/

Use the top navigation bar to go to the different sections of the application.

You will have to authenticate on each page using `uPort` as the authenticated state is not currently stored.

In order to upload an image you will have to have `Metamask` installed in you browser and have an account funded in the `Rinkeby` testnet.

Note that whatever you upload to IPFS cannot be deleted, so be mindful about what you upload and who knows the IPFS hash.

This application is just a proof-of-concept and is insecure.

The following files should be updated with your information and should not be public. They should be implemented/stored securly:

```src/util/connectors.js```

```src/user/ui/loginbutton/LoginButtonActions.js```

```src/filesPoE.js```

```truffle.js```

The contracts have been deployed to the Rinkeby testnet, so you can also test the application by installing node and yarn, then cloning the repository, and then running the following commands from the root directory of the cloned repository:

```yarn install```

```yarn start```

I was unable to generate a production build, so I did not deploy the application to the internet.

The configuration for `create-react-app` and `ipfs-api` which were used in the application conflict and cause the build to fail.
