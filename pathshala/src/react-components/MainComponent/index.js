import React from "react";

import "./styles.css";
import EventCard from "../EventCard/index";
import { Button} from '@material-ui/core'; 
import Event from "../Event";
import UserList from "../UserList";
import UserProfile from "../UserProfile";


/* Component for the main center component */
class MainComponent extends React.Component {

  componentDidMount() {
    this.props.refreshEvents(this);
  }

  state = {
    viewing: false,
    creating: false,
    editing: false,
    event: {}
  };

  createEvent = () => {
    this.props.setEventAction(true)
    this.setState({ creating: true })
  };

  viewEvents = () => {
      this.props.setEventAction(false)
      this.setState({
          viewing: false,
          creating: false,
          editing: false
      });

    this.props.refreshEvents(this);
  };

  onViewing = (event) => {
    this.props.setEventAction(true)
    this.setState({
      viewing: true,
      creating: false,
      event: event
    })
  }

  onEditing = (event) => {

    this.props.setEventAction(true)
    this.setState({
      viewing: false,
      creating: false,
      editing: true,
      event: event
    })
  }

  render() {
    const { user, filteredEvents, events, setEvents, users, isAdmin, onEventsPage, refreshEvents, adminChangePassword } = this.props;

    if (isAdmin && !onEventsPage) {
      return <div className="main-component-div">
        <UserList users={users} adminChangePassword={adminChangePassword} refreshUsers={this.props.refreshUsers}/>
      </div>
    }

    if (this.state.creating) {
      return (<Event 
                isAdmin={isAdmin} 
                events={events} 
                userName={user.username} 
                setEvents={setEvents} 
                viewEvents={this.viewEvents}
                refreshEvents={refreshEvents.bind(this, this)}/>)
    } else if (this.state.viewing || this.state.editing){
      return (<Event 
                isAdmin={isAdmin} 
                editing={this.state.editing} 
                viewing={this.state.viewing} 
                event={this.state.event} 
                events={events} 
                userName={user.username} 
                viewEvents={this.viewEvents}
                refreshEvents={refreshEvents.bind(this, this)}/>)
    }

    if (!isAdmin && !onEventsPage) {
      return <div className="main-component-div">
        <UserProfile user={user} events={events} onEditing={this.onEditing} onViewing={this.onViewing} refreshEvents={refreshEvents.bind(this, this)}/>
      </div>
    }

    else {
    return (
      <div className="main-component-div">
        <div className="section-header" >
          <div className="page-name">
            Home
          </div>
          <div id='create-event'>
            <Button onClick={ () => { this.createEvent()}} variant="outlined" color="primary" size="medium">
              Create Event
            </Button>
          </div>
        </div>
        <div className="upcoming-events">
        Upcoming Events
        </div>
        <div className="event-list">
          {filteredEvents.length === 0 ? (
            <div className="empty-list-text">No events match the filter(s).</div>
          ) : (
            filteredEvents.map(event => (
              <EventCard 
              username={user.username}
              isAdmin={isAdmin} 
              onEditing={this.onEditing}
              onViewing={this.onViewing}
              event={event}
              refreshEvents={refreshEvents.bind(this, this)}/>
            ))
          )}
        </div>
      </div>

    );}
  }
}

export default MainComponent;