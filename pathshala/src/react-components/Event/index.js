import React from "react";
import {
   Link
  } from "react-router-dom";
  

import "./styles.css";
import {Input, ListItemText, TextField, Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';

import avatar1 from '../EventCard/static/avatar_1.png';
import avatar2 from '../EventCard/static/avatar_2.png';
import avatar3 from '../EventCard/static/avatar_3.png';
import avatar4 from '../EventCard/static/avatar_4.png';
import avatar5 from '../EventCard/static/avatar_5.png';
import avatar6 from '../EventCard/static/avatar_6.png';

import eventHelpers from "../../actions/events";

const { addEvent, editEvent, deleteEvent, addEventMember, removeEventMember, addFile, deleteFile } = eventHelpers;


/* Component for the main center component */
class Event extends React.Component {
    
    constructor(props) {
        super(props)
        if (this.props.viewing || this.props.editing) {
            this.state.icon = this.props.event.icon 
            this.state.course = this.props.event.course
            this.state.subject = this.props.event.subject
            this.state.username = this.props.event.username
            this.state.description = this.props.event.description
            this.state.location = this.props.event.location
            this.state.date = this.props.event.date
            this.state.time = this.props.event.time
            this.state.size = this.props.event.size
            this.state.members = this.props.event.members
            }
        }
    
    state = {
        
        isView:false,
        isEdit:false,
        isCreate:true,
        showDialog:false,

        icon:0,
        course:"",
        subject:"",
        username:"",
        description:"",
        location:"",
        date:"",
        time:"",
        file: "",
        size:"",
        members:[],
        files: [],
        

        sizes: ["1-5","6-10", "11-15","16-20"],
    };

    handleInputChange = event => {
        const {name, value} = event.target;

        this.setState({
            [name]: value
        });
    };

    setIconIndex = index => {
        this.setState({
            icon: index
        })
    }

    closeDialog = () => {
        this.setState({ showDialog: false })
      }

    openDialog = () => {
        this.setState({ showDialog: true})
      }

    addMember = (event) => {
        if(event.members.includes(this.props.userName)){
            removeEventMember(this.props.refreshEvents, event, this.props.userName);
        }
        else {
            addEventMember(this.props.refreshEvents, event, this.props.userName);
        }
    }

    removeMember = (event, member) => {
        const members = this.state.members
        const index = members.indexOf(member)
        members.splice(index, 1)

        this.setState({ members: members})

        removeEventMember(this.props.refreshEvents, event, member);
    }


    render() {
        const {isAdmin, event, events, userName, setEvents, viewEvents, viewing, editing}  = this.props;

        const avatarImages = [avatar1, avatar3, avatar5, avatar2, avatar4, avatar6]

        let lastButton; 
        
        let join_value = "Join"
        if (typeof(event) !== "undefined"){
            if (event.members.includes(userName)) {
            join_value = "Joined"
            }
        }

        if (editing) {
            lastButton = (
              <div className="right_header">
                <div className="last_button">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => deleteEvent(viewEvents, event)}
                    style={{ backgroundColor: "blue", color: "white" }}
                  >
                    Delete
                  </Button>
                </div>
                <div className="last_button">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      editEvent(
                        this,
                        events,
                        userName,
                        setEvents,
                        viewEvents,
                        event
                      )
                    }
                    style={{ backgroundColor: "blue", color: "white" }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            );
        }
        else if (viewing) {
            if (userName !== this.state.username) {
            lastButton =  (<div  className="right_header" className="last_button">
                <Button  variant="outlined" color="primary" onClick={() => {
                        this.addMember(event)
                        viewEvents()
                        }}>
                    {join_value}
                
                </Button>
            </div>)} else { 
                lastButton = (<div></div>)
            }
        }
        else {
            lastButton = (
              <div className="right_header" className="last_button">
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    addEvent(this, events, userName, setEvents, viewEvents)
                  }
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Create Group
                </Button>
              </div>
            );
        }
        return (
            <div className="event-div">
                
                <div className="header_page">
                    <div className="left_header">
                        <div className="last_button">
                            <IconButton color="primary" onClick={viewEvents}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </div>
                        <div className="page-name">
                            Group
                        </div>
                    </div>
                {lastButton}  
                </div>
                   
                <div className="form-components">
                    <div className="section">
                        <div className="section-name">
                            Icon:
                        </div>
                        { editing || (!editing && !viewing) ? ( <List id="avatar-list">
                            { avatarImages.map((avatar, index) => (
                                <ListItem
                                    button
                                    disableGutters
                                    selected={this.state.icon === index}
                                    onClick={() => this.setIconIndex(index)}
                                >
                                    <div className="avatar-div">
                                        <ListItemAvatar>
                                            <Avatar src={ avatar } />
                                        </ListItemAvatar>
                                    </div>
                              </ListItem>
                            ))}
                        </List>
                        ) : ( <Avatar src={ avatarImages[this.state.icon]} /> )}
                    </div>  
                    <div className="section">
                        <div className="section-name">
                            Course:
                        </div>
                        <div className="course">
                        <TextField 
                            id="outlined-search"
                            value={this.state.course}
                            name='course'
                            type="search"
                            variant="outlined"
                            onChange={this.handleInputChange}
                            
                            InputProps={{
                                readOnly: viewing,
                              }}/>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-name">
                            Subject:
                        </div>
                        <div className="purpose">
                            <TextField 
                                id="outlined-search"
                                value={this.state.subject}
                                name='subject'
                                type="search"
                                variant="outlined"
                                onChange={this.handleInputChange}
                                
                                InputProps={{
                                    readOnly: viewing,
                                  }}/>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-name">
                            Location:
                        </div>
                        <div className="location">
                            <TextField
                                id="outlined-full-width"
                                value={this.state.location}
                                fullWidth
                                name='location'
                                type="search"
                                variant="outlined"
                                onChange={this.handleInputChange}
                                
                                InputProps={{
                                    readOnly: viewing,
                                  }}/>
                        </div>
                    </div>
                    <div  className="section">
                        <div className="section-name">
                            Group Size:
                        </div>
                        <div className="group-size">
                        <TextField
                            id="outlined-select"
                            select
                            name='size'
                            value={this.state.size}
                            onChange={this.handleInputChange}
                            
                            variant="outlined"
    
    
                            InputProps={{
                                readOnly: viewing,
                              }}
                            >
                            {this.state.sizes.map(option => (
                                <MenuItem key={option} value={option}>
                                {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-name">
                            Date:
                        </div>
                        <div className="date">
                            <TextField
                                id="date"
                                type="date"
                                name="date"
                                value={this.state.date}
                                // defaultValue="2020-01-01"
                                onChange={this.handleInputChange}
    
                                InputProps={{
                                    readOnly: viewing
                                  }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-name">
                            Time:
                        </div>
                        <div className="time">
                            <TextField
                                id="time"
                                type="time"
                                name="time"
                                value={this.state.time}
                                // defaultValue="06:00"
                                onChange={this.handleInputChange}
    
                                InputProps={{
                                    readOnly: viewing
                                  }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-name">
                            Description:
                        </div>
                        <div className="description">
                            <TextField
                                    rows="1"
                                    id="outlined-full-width"
                                    multiline
                                    value={this.state.description}
                                    fullWidth
                                    name='description'
                                    variant="outlined"
                                    onChange={this.handleInputChange}
                                    
                                    InputProps={{
                                        readOnly: viewing,
                                      }}/>
                        </div>
                    </div>
                    
                </div>
                <Button disableElevation variant="contained" color="secondary" onClick={ this.openDialog }>
                            View Members
                </Button>
               
                <Dialog open={ this.state.showDialog }>
                    <DialogTitle>Joined Members</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.members.length === 0 ? (
                                <div>No Members Yet.</div>
                            ) : (
                             
                                this.state.members.map((member) => {
                                    if (isAdmin) {
                                        return (
                                            <ListItem divider >
                                                <ListItemText><p id="member-name">@{member}</p></ListItemText>
                                                    <div className="remove">
                                                        <Button size="small" variant="text" color="secondary" onClick={ () => this.removeMember(event, member) }>
                                                            remove 
                                                        </Button>
                                                    </div>    
                                            </ListItem>)        
                                    } else {
                                    return (
                                    <ListItem divider dense>
                                        <ListItemText><p id="member-name">@{member}</p></ListItemText>
                                    </ListItem>)}
        
                                })
                            )}
                            
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ this.closeDialog } color="primary" autoFocus>
                        Ok
                        </Button>
                        <Button disableElevation variant="contained" color="primary" >
                        <Link to={{ pathname: `http://localhost:8000/chat.html?username=${this.props.userName}&room=1` }} target="_blank" >Join Chat with fellow members</Link>
                         </Button>
                         
                       
                    </DialogActions>
                </Dialog>
                
           
            </div>
          );
    }
  }
  
  export default Event;