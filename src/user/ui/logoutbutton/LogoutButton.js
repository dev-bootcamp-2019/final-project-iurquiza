import React from "react";
import { NavItem } from "react-bootstrap";

const LogoutButton = ({ onLogoutUserClick }) => {
  return <NavItem onClick={event => onLogoutUserClick(event)}>Logout</NavItem>;
};

export default LogoutButton;
