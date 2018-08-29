import React from "react";
import { NavItem } from "react-bootstrap";

const LoginNavItem = ({ onLoginUserClick }) => {
  return (
    <NavItem onClick={event => onLoginUserClick(event)}>
      Login with UPort
    </NavItem>
  );
};

export default LoginNavItem;
