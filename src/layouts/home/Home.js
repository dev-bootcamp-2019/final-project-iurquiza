import React, { Component } from "react";
import LoginButtonContainer from "../../user/ui/loginbutton/LoginButtonContainer";

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="jumbotron text-center">
          <h1 className="display-4">Israel Urquiza's Proof of Existence App</h1>
          <p className="lead">
            A simple Proof of Existence Solidity application that uses uPort for
            authentication, and IPFS for file hosting.
          </p>
          <hr />
          <LoginButtonContainer />
        </div>
      </main>
    );
  }
}

export default Home;
