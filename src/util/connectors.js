import { Connect, SimpleSigner } from "uport-connect";

const mnidAddress = "2ov8fPt8BbCZzbhtsL7PnmpvP2C1xRSwcRD";
const signingKey =
  "0c4de5a85843d51c202580a4ca9ba6674f8ade09e7cda7df25ac63924de13e73";
const appName = "Israel Urquiza's Proof of Existence App";

export let uport = new Connect(appName, {
  //uriHandler,
  clientId: mnidAddress,
  network: "rinkeby",
  signer: SimpleSigner(signingKey)
});

export const web3 = uport.getWeb3();
