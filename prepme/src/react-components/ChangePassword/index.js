import React from 'react';

import './styles.css';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';

import PasswordEntry from './PasswordEntry/index';

import { changePassword } from "../../actions/users" 

/* Component to change password on user Profile page */
class ChangePassword extends React.Component {

  state = {
    changingPassword: false, // whether or not to show password fields

    // Keep track of values in input fields
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    currShowPsw: false,
    newShowPsw: false,
    confShowPsw: false,

    isValidInputs: true,

    showDialog: false // show 'password saved' dialog
  }

  cancelPasswordChange = () => {
    this.setState({ changingPassword: false })
  }

  openPasswordChange = () => {
    this.setState({ 
      changingPassword: true,
      isValidInputs: true
    })
  }

  onCurrPswChange = e => {
    const { value } = e.target
    this.setState({ currentPassword: value })
  }

  onNewPswChange = e => {
    const { value } = e.target
    this.setState({ newPassword: value })
  }

  onConfirmPswChange = e => {
    const { value } = e.target
    this.setState({ newPasswordConfirm: value })
  }

  toggleShowCurrPsw = () => { this.setState({ currShowPsw: !this.state.currShowPsw }) }
  toggleShowNewPsw = () => { this.setState({ newShowPsw: !this.state.newShowPsw }) }
  toggleShowConfPsw= () => { this.setState({ confShowPsw: !this.state.confShowPsw })}

  // Called when Save is clicked to reset fields and display dialog
  clearEntries = () => {
    this.setState({
      changingPassword: false,
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      currShowPsw: false,
      newShowPsw: false,
      confShowPsw: false,

      showDialog: true
    })
  }

  checkValid = () => {
    if (this.state.newPassword === this.state.newPasswordConfirm && this.state.newPassword.length >= 4) {
      this.setState({ isValidInputs: true })
      return true
    } else {
      this.setState({ isValidInputs: false })
      return false
    }
  }

  closeDialog = () => {
    this.setState({ showDialog: false })
  }

  render() {
    const { username } = this.props

    return ( 
      <div>
        { this.state.changingPassword ? (
          <div>
            <div id="title">Change Password</div>
            <PasswordEntry 
              label="Current Password"
              value={ this.state.currentPassword }
              showPsw={ this.state.currShowPsw }
              toggleShowPsw={ this.toggleShowCurrPsw }
              onChange={ this.onCurrPswChange }
            />
            <PasswordEntry 
              label="New Password (min. 4 chars)"
              value={ this.state.newPassword }
              showPsw={ this.state.newShowPsw }
              toggleShowPsw={ this.toggleShowNewPsw }
              onChange={ this.onNewPswChange }
            />
            <PasswordEntry 
              label="Re-enter Password"
              value={ this.state.newPasswordConfirm }
              showPsw={ this.state.confShowPsw }
              toggleShowPsw={ this.toggleShowConfPsw }
              onChange={ this.onConfirmPswChange }
            />
            <div id="buttons-div">
              <Button
                variant="outlined"
                color="primary"
                onClick={this.cancelPasswordChange}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={ () => { 
                  if (this.checkValid()) {
                    changePassword(username,this.state.newPassword)
                    this.clearEntries(); 
                  }
                }}
                startIcon={ <SaveIcon /> }
              >
                Save
              </Button>
            </div>
            <p id="invalid-text">{this.state.isValidInputs ? '' : 'Invalid Credentials'}</p>
          </div>
        ) : (
          <Button
            disableElevation
            variant="contained"
            color="primary"
            fullWidth={ true }
            onClick={ this.openPasswordChange }
            startIcon={ <LockIcon /> }
          >
            Change Password
          </Button>
        )}

        {/* Dialog to say password saved successfully */}
        <Dialog
          open={ this.state.showDialog }
        >
          <DialogContent>
            <DialogContentText>
              Password Saved Successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ this.closeDialog } color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default ChangePassword;
