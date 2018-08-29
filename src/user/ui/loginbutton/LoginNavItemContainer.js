import { connect } from "react-redux";
import LoginNavItem from "./LoginNavItem";
import { loginUser } from "./LoginButtonActions";

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onLoginUserClick: event => {
      event.preventDefault();

      dispatch(loginUser());
    }
  };
};

const LoginNavItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginNavItem);

export default LoginNavItemContainer;
