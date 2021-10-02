// Functions to help with user actions.
import { send } from '../utils/Push'
// A function to check if a user is logged in on the session cookie
export const readCookie = (app) => {
  const url = "/users/check-session";

  fetch(url)
      .then(res => {
          if (res.status === 200) {
              console.log("read")
              return res.json();
          }
      })
      .then(json => {
          if (json && json.currentUser) {
              app.setState({ currentUser: json.currentUser });
          }
      })
      .catch(error => {
          console.log(error);
      });
};

// Get a list of all user objects with just their name and rating
export const getUsersNameAndRating = (homeComp) => {
    const url = '/users'; 

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            }
        })
        .then(json => {
            // the resolved promise with the JSON body
            homeComp.setState({
                users: json,
                filteredUsers: json
            });
        })
        .catch(error => {
            console.log(error);
            homeComp.setState({
                users: [],
                filteredUsers: []
            });
        });
}

// function to update the user password
export const changePassword = (username, password) => {
    
    const userInfo = {
        username : username,
        newpassword : password
    }

    console.log(userInfo)
    const request = new Request("/users", {
      method: "PATCH",
      body: JSON.stringify(userInfo),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });

    fetch(request)
    .then(res => {
        console.log(res)
        if (res.status === 200) {     
            return res.json();
        } else {
        }
    })
    .catch(error => {
        console.log(error);
    });
}

// A function to send a POST request with the user to be logged in
export const login = (loginComp, app) => {
  const { username, password } = loginComp.state

  const newUser = {
    username,
    password
  }


  // Create our request constructor with all the parameters we need
  const request = new Request("/users/login", {
      method: "post",
      body: JSON.stringify(newUser),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
      
  });

  // Send the request with fetch()
  fetch(request)
      .then(res => {
          if (res.status === 200) {
            send("Push Notifications", "Push notification successfully sent to the browser! Check it out!")
            loginComp.setState({ invalidCredentials: false })
            return res.json();
          }
      })
      .then(json => {
          if (json.username !== undefined) {
              app.setState({ currentUser: json.username });
          }
          if (json.isAdmin !== undefined) {
            app.setState({ isAdmin: json.isAdmin })
          }
      })
      .catch(error => {
          console.log(error);
          loginComp.setState({ invalidCredentials: true })
      });
};

// A function to send a POST request with the user to be created
export const signUp = (signUpComp) => {
  const { username, password,weaknesses } = signUpComp.state

  const newUser = {
    username,
    password,
    weaknesses
  }
  // Create our request constructor with all the parameters we need
  const request = new Request("/users", {
      method: "post",
      body: JSON.stringify(newUser),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
  });

  // Send the request with fetch()
  fetch(request)
      .then(res => {
          if (res.status === 200) {
            signUpComp.setState({ invalidCredentials: false })
            signUpComp.props.switchToLogin()
            return res.json();
          } else {
            signUpComp.setState({ invalidCredentials: true })
          }
      })
      .then(json => {
        // I don't think we need to do anything
      })
      .catch(error => {
          console.log(error);
          signUpComp.setState({ invalidCredentials: true })
      });
};

// A function to update a user's rating as an organizer
export const updateRating = (eventCardComp, username, newRating) => {
    // Get current rating
    const getUrl = `/users/${username}`;

    fetch(getUrl)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json) {
                const body = {
                    username: username,
                    newRating: newRating
                }

                if (json.rating !== 0) { // update rating with new rating
                    body.newRating = ~~((json.rating + newRating) / 2) // Integer division
                }
            
                const request = new Request(`/users/${username}`, {
                    method: "PATCH",
                    body: JSON.stringify(body),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                });
            
                // Send patch request
                fetch(request)
                    .then(res => {
                        if (res.status === 200) {   
                            eventCardComp.closeDialog();  
                            eventCardComp.openSavedDialog();
                            return res.json();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
        .catch(error => {
            console.log(error);
        });

}

// A function to send a GET request to logout the current user
export const logout = (app) => {
  const url = "/users/logout"

  fetch(url)
      .then(res => {
          app.setState({
              currentUser: null,
          });
      })
      .catch(error => {
          console.log(error);
      });
};