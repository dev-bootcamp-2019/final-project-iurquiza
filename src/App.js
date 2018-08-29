import React, { Component } from "react";
import { Link } from "react-router";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { HiddenOnlyAuth, VisibleOnlyAuth } from "./util/wrappers.js";

// UI Components
import LoginNavItemContainer from "./user/ui/loginbutton/LoginNavItemContainer";
import LogoutButtonContainer from "./user/ui/logoutbutton/LogoutButtonContainer";

class App extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() => (
      <Nav>
        <NavItem href="/upload">Upload</NavItem>
        <NavItem href="/myimages">My Images</NavItem>
        <LogoutButtonContainer />
      </Nav>
    ));

    const OnlyGuestLinks = HiddenOnlyAuth(() => (
      <Nav>
        <LoginNavItemContainer />
      </Nav>
    ));

    return (
      <div>
        <header>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Home</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <OnlyGuestLinks />
              <OnlyAuthLinks />
            </Navbar.Collapse>
          </Navbar>
        </header>
        {this.props.children}
        <footer>
          <div className="container text-center">
            <br />
            <p>Copyright &copy; {new Date().getFullYear()} iurquiza</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
