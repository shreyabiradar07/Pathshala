import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import './App.css';

import Login from './react-components/Login';
import Home from './react-components/Home';
import loginImg from './images/login.png'

import { readCookie } from "./actions/users";

class App extends React.Component {

    constructor(props) {
        super(props);
        readCookie(this); // sees if a user is logged in.
    }

    state = {
        currentUser: null,
        isAdmin: false,
    };

    setEvents = (events) => {
        this.setState({
            events: events
        })
    };

    routing() {
        if (!this.state.currentUser) {
            return (
              <div>
                <Login app={this} />
              </div>
            );
        } else {
            return(<Home 
                        app={this}
                        state={this.state} 
                        setEvents={this.setEvents} 
            />)
        }
    }
    
    render() {
        return (
            <div >
           
                <BrowserRouter>
                    {this.routing()}
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
