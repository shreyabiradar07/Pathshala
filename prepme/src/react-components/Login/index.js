import React from 'react';
import './Login.css';
import {Container} from "@material-ui/core";

import LoginBox from '../LoginBox/index';
import SignUpBox from '../SignUpBox/index';

class Login extends React.Component {

    state = {
      isSigningUp: false
    }

    switchToSignUp = () => {
      this.setState({ isSigningUp: true })
    }

    switchToLogin = () => {
      this.setState({ isSigningUp: false })
    }

    render() {

        return (
            <Container id="login" maxWidth={"xs"}>
                    { this.state.isSigningUp ? (
                      <SignUpBox 
                        app={this.props.app}
                        switchToLogin={this.switchToLogin}
                      />
                    ) : (
                      <LoginBox 
                        app={this.props.app}
                        switchToSignUp={ this.switchToSignUp } 
                      />
                    )}
            </Container>
        );
    }
}

export default Login;
