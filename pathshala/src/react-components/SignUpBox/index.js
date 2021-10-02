import React from 'react';
import './SignUpBox.css';
import logo from "./static/logo.png"
import {Button, TextField, Container} from "@material-ui/core";
import { Chip } from "@material-ui/core";
import PasswordEntry from '../ChangePassword/PasswordEntry/index';

import { signUp } from "../../actions/users";

class SignUpBox extends React.Component {

    state = {
        username: '',
        password: '',
        reenterPassword: '',
        weakness:'',
        weaknesses : [],
        showPsw: false,
        showRePsw: false,
        invalidCredentials: false
    };

    handleInputChange = event => {
        const {name, value} = event.target;

        this.setState({
            [name]: value
        });
    };
    handleWeaknessChange = event => {
      console.log(event.target.value);
      const {weakness, value} = event.target;
      this.setState({
        weakness: value
    });
     
    
    
  };
  handleArrayChange = event => {
    this.setState(prevState => ({
      weaknesses: [...prevState.weaknesses, this.state.weakness]
    }))
  }
    onPswChange = e => {
        const { value } = e.target
        this.setState({ password: value })
    }

    onRePswChange = e => {
        const { value } = e.target
        this.setState({ reenterPassword: value })
    }

    toggleShowPsw = () => { this.setState({ showPsw: !this.state.showPsw }) }
    toggleShowRePsw = () => { this.setState({ showRePsw: !this.state.showRePsw }) }

    processSignUp= () => {
        if (this.state.username !== "" && this.state.password === this.state.reenterPassword && this.state.weaknesses.length!=0) {
            this.setState({ invalidCredentials: false })
            signUp(this)
        } else {
            this.setState({ invalidCredentials: true })
        }
    };

    render() {
        return (
          <Container id="signUpBox" maxWidth={"xs"}>
             <img src={logo} id="prepme-logo" alt="PrepMe logo"/>
            
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              value={this.state.username}
              onChange={this.handleInputChange}
              fullWidth
              autoFocus
              margin="normal"
            />
            <PasswordEntry
              label="Password (Min. 4 Characters)"
              value={this.state.password}
              showPsw={this.state.showPsw}
              toggleShowPsw={this.toggleShowPsw}
              onChange={this.onPswChange}
            />
            <PasswordEntry
              label="Re-enter Password"
              value={this.state.reenterPassword}
              showPsw={this.state.showRePsw}
              toggleShowPsw={this.toggleShowRePsw}
              onChange={this.onRePswChange}
            />
            {
          this.state.weaknesses.length!=0? <div style={{display: 'flex', flexDirection: 'row' }} > {this.state.weaknesses.map(item=>{
               return <span> <Chip style={{margin:'4px'}} label={item} variant="outlined"></Chip></span>
            })}
            </div>:<p></p>
        }
        <div style={{display:'flex',flexDirection: 'row',justifyContent:'space-evenly'}}>
            <TextField
              label="Enter Your Weaknesses"
              name="username"
             
              variant="outlined"
              value={this.state.weakness}
              onChange={this.handleWeaknessChange}
              fullWidth
              autoFocus
              margin="normal"
              
              
            />
            <Button onClick={this.handleArrayChange}>
             Add
            </Button>
</div>
            <Button
              disableElevation
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.processSignUp}
              style={{ backgroundColor: "blue", color: "white" }}
            >
              Sign Up
            </Button>
            <div id="cancel-button">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={this.props.switchToLogin}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Cancel
              </Button>
            </div>
            <h3 id="invalidText">
              {this.state.invalidCredentials
                ? "Invalid Username and/or Password"
                : ""}
            </h3>
          </Container>
        );
    }
}

export default SignUpBox;
