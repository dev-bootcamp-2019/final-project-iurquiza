import React from "react";

// Images
import uPortLogo from "../../../img/uport-logo.svg";

const LoginButton = ({ onLoginUserClick }) => {
  return (
    <a
      className="btn btn-primary btn-lg"
      onClick={event => onLoginUserClick(event)}
      role="button"
    >
      <img src={uPortLogo} alt="UPort Logo" width="30" />
      &nbsp;Sign In with uPort
    </a>
  );
};

export default LoginButton;
