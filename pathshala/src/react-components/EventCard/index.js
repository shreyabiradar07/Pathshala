import React from "react";

import "../../index.css";
import "./styles.css";

import avatar1 from '../EventCard/static/avatar_1.png';
import avatar2 from '../EventCard/static/avatar_2.png';
import avatar3 from '../EventCard/static/avatar_3.png';
import avatar4 from '../EventCard/static/avatar_4.png';
import avatar5 from '../EventCard/static/avatar_5.png';
import avatar6 from '../EventCard/static/avatar_6.png';

import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Button } from '@material-ui/core'; 
import Rating from '@material-ui/lab/Rating';

import { updateRating } from '../../actions/users';
import eventHelpers from '../../actions/events';
const { addEventMember, removeEventMember } = eventHelpers;

/* Component for the Home page */
class EventCard extends React.Component {
  
  state = {
    showDialog: false,
    showSavedDialog: false,
    ratingValue: 0
  }

  handleRatingChange = newValue => {
    this.setState({ ratingValue: newValue })
  }

  openDialog = () => {
    this.setState({ showDialog: true })
  }

  closeDialog = () => {
    this.setState({ showDialog: false })
  }

  openSavedDialog = () => {
    this.setState({ showSavedDialog: true })
  }

  closeSavedDialog = () => {
    this.setState({ showSavedDialog: false })
  }

  addMember = (event) => {
    if(event.members.includes(this.props.username)){
      removeEventMember(this.props.refreshEvents, event, this.props.username);
    }
    else {
      addEventMember(this.props.refreshEvents, event, this.props.username);
    }
  }

  render() {
  
    const {username, isAdmin,onEditing ,onViewing, event} = this.props 
    
    let join_value = "Join"
    if (event.members.includes(username)) {
      join_value = "Joined"
    }

    const icons = [avatar1, avatar3, avatar5, avatar2, avatar4, avatar6]
    return (
      <div className="event-card">
        <div className="header" >
          <div className="event-info">
            <div className="icon">
              <img id="icon-img" src={ icons[event.icon]}/>
            </div>
            <div>
            <div className="course" >
              {event.course}
            </div>
            <div className="event-subject">
              {event.subject}
            </div>
            </div>
          </div>
          <div className="username" >
             {'@' + event.username}
          </div>
        </div>
        <div className='event_description'>
            {event.description}
        </div>
        <div className="actions">
          <div>
              {isAdmin || event.members.includes(username) ? (
                <div className="action-button" id='rate-button'>
                  <Button className="cardbutton" onClick={this.openDialog}  variant="outlined" color="primary" size="small">
                    Rate Organizer
                  </Button>
                </div>
              ) : ( <div /> )}
          </div>
          <div className="right_actions">
              { isAdmin || username === event.username ? (
                  <div className="action-button" id='edit-button'>
                    <Button className="cardbutton" onClick={() => onEditing(event)}  variant="outlined" color="primary" size="small">
                      Edit
                    </Button>
                  </div>
                ) : ( <div /> )}
                <div className="action-button" id='view-button'>
                  <Button className="cardbutton" onClick={() => onViewing(event)}  variant="outlined" color="primary" size="small">
                    View
                  </Button>
                </div>
                { !isAdmin && username !== event.username ? (<div className="action-button" id='join-button'>
                  <Button className="cardbutton" onClick={ () => { this.addMember(event)}} variant="outlined" color="primary" size="small">
                    {join_value}
                  </Button>
                </div>
                ) : (<div/>)} 
            </div>
        </div>

        {/* Dialog to allow user to give organizer rating */}
        <Dialog open={ this.state.showDialog }>
          <DialogTitle id="form-dialog-title">Rate Organizer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the rating for organizer @{event.username}.
            </DialogContentText>
            <div id="rating-div">
              <Rating 
                name="pristine"
                value={this.state.ratingValue}
                onChange={(event, newValue) => this.handleRatingChange(newValue)}
              />
            </div> 
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                updateRating(this, event.username, this.state.ratingValue)
              }}
                color="primary">
              Save
            </Button>
          </DialogActions>
       </Dialog>

      {/* Dialog to tell user their rating has been saved */}
       <Dialog open={ this.state.showSavedDialog }>
          <DialogContent>
            <DialogContentText>
              Your rating has been recorded.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ this.closeSavedDialog } color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


export default EventCard;