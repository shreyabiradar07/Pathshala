import React from 'react';

import './UserCard.css';

import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TextField } from '@material-ui/core';
import StarRateIcon from '@material-ui/icons/StarRate';
import LockIcon from '@material-ui/icons/Lock';
import { changePassword } from '../../actions/users';

class UserCard extends React.Component {
  state = {
    showDialog: false,
    newPsw: "",
    isValidInputs: true
  }

  handleInputChange = e => {
    const { value } = e.target
    this.setState({ newPsw: value })
  }

  setValidInputs = (value) => {
    this.setState({ isValidInputs: value })
  }

  openDialog = () => {
    this.setState({ showDialog: true })
  }

  closeDialog = () => {
    this.setState({ showDialog: false })
  }

  render() {
    const { username, rating } = this.props
    let stars = []
    for (let i=0; i < rating; i++) {
      stars.push(<StarRateIcon />)
    }

    return (
      <div className="user-card">
        <div className="card-username">@{username}</div>
        <div className="star-rating">{ stars }</div>
        <Button
          disableElevation
          variant="contained"
          color="primary"
          onClick={ this.openDialog }
          startIcon={ <LockIcon /> }
        >
          Change Password
        </Button>

        <Dialog open={ this.state.showDialog }>
        <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the new password for @{username}.
          </DialogContentText>
          <TextField
            autoFocus
            label="New Password (Min. 4 Characters)"
            type="password"
            value={this.state.newPsw}
            onChange={this.handleInputChange}
            fullWidth
          />
          <DialogContentText>
            <p id="invalid-text">{this.state.isValidInputs ? '' : 'Invalid Credentials'}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
              if (this.state.newPsw.length >= 4) {
                this.closeDialog(); 
                changePassword(username, this.state.newPsw)
                this.setValidInputs(true)
              } else {
                this.setValidInputs(false)
              }
              }}
              color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}

export default UserCard;