function getEvents(home, main) {
    const url = '/events'

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get events");
            }
        })
        .then(json => {
            // the resolved promise with the JSON body
            home.setState({
                events: json,
                filteredEvents: (home.state.appliedFilters.length !== 0) ? filterEvents(home.state.appliedFilters, json) : json
            }, () => main.render());
        })
        .catch(error => {
            console.log(error);
            home.setState({
                events: [],
                filteredEvents: []
            }, () => main.render());
        });
}

function addEvent(eventForm, events, username, setEvents, viewEvents) {
    const {icon, course, subject, description, location, date, time, size, files} = eventForm.state;

    const newEvent = {
        icon,
        course,
        subject,
        username,
        description,
        location,
        date,
        time,
        size,
        members: [],
        files
    };

    const url = '/events'

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(newEvent),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            if (res.status === 200) {
                // If event was added successfully, go back to events page
                viewEvents();
            } else {
                // TODO: handle what happens if event wasn't added successfully.
            }
        })
        .catch(error => {
            console.log(error);
        });

    viewEvents();
}

function editEvent(eventForm, events, username, setEvents, viewEvents, event) {
    const event_id = event._id;

    const {icon, course, subject, description, location, date, time, size, files} = eventForm.state;

    const edited_event = {
        icon,
        course,
        subject,
        username,
        description,
        location,
        date,
        time,
        size,
        members: event.members,
        files
    };

    const url = `/events/${event_id}`; 

    const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify(edited_event),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            if (res.status === 200) {
                // If event was added modified, go back to events page
                viewEvents();
            } else {
                // TODO: handle what happens if event wasn't added successfully.
            }
        })
        .catch(error => {
            console.log(error);
        });

    viewEvents();
}

function deleteEvent(viewEvents, event) {
    const event_id = event._id;

    const url = `/events/${event_id}`; 

    const request = new Request(url, {
        method: "delete",
    });
    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            if (res.status === 200) {
                // If event was deleted, go back to events page  
                viewEvents();
            } else {
                // TODO: handle what happens if event wasn't added successfully.
            }
        })
        .catch(error => {
            console.log(error);
        });
    viewEvents();
}

function addEventMember(refreshEvents, event, username) {
    const event_id = event._id;

    const url = `/events/member/${event_id}`; 

    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify({username}),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            if (res.status === 200) {
                // If the member was added successfully, retrieve events list from database.
                refreshEvents();
            } else {
                // TODO: handle what happens if event wasn't added successfully.
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function removeEventMember(refreshEvents, event, username) {
    const event_id = event._id;

    const url = `/events/member/${event_id}`; 

    const request = new Request(url, {
        method: "DELETE",
        body: JSON.stringify({username}),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            if (res.status === 200) {
                // If the member was added successfully, retrieve events list from database.
                refreshEvents();
            } else {
                // TODO: handle what happens if event wasn't added successfully.
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function addFile (form, eventView) {
    // the URL for the request
    const url = `/event_files`; 

    // The data we are going to send in our request
    const fileData = new FormData(form);

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: fileData,
        headers: {
        Accept: "application/json, text/plain, */*"
    }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(function (file) {
            const files = eventView.state.files;
            files.push(file);
            eventView.setState({
                files: files
            });
        })
        .catch(error => {
            console.log(error);
        });
}

function deleteFile(eventView, file_id) {
    // the URL for the request
    const url = `/event_files/${file_id}`; 

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "DELETE",
        body: JSON.stringify({
            editing: eventView.props.editing ? 1 : 0,
            event_id: eventView.props.editing ? eventView.props.event._id : ""
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(function (file) {
            const files = eventView.state.files;
            const modified_files = files.filter((file) => file.file_id !== file_id);
            eventView.setState({
                files: modified_files
            });
        })
        .catch(error => {
            console.log(error);
        });
}

/** Filter Functions **/

function eventMatchesFilters(filters, event) {
    // Loop through all filters
    for (let i=0; i < filters.length; i++) {
        if (filters[i].name === "Courses") {
            // Iterate through all filtered courses
            for (let j=0; j < filters[i].values.length; j++) {
                if (event.course === filters[i].values[j]) {
                    return true
                }
            }
        } else if (filters[i].name === "Username") {
            // Iterate through all filtered usernames
            for (let j=0; j < filters[i].values.length; j++) {
                if (event.username === filters[i].values[j]) {
                    return true
                }
            }
        } else if (filters[i].name === "Group Size") {
            // Iterate through all filtered Group Sizes
            for (let j=0; j < filters[i].values.length; j++) {
                if (event.size === filters[i].values[j]) {
                    return true
                }
            }
        }
    }

    return false
}

function filterEvents(filters, events) {
    return events.reduce((filteredEvents, event) => {
        if (eventMatchesFilters(filters, event)) {
            filteredEvents.push(event)
        }
        return filteredEvents
    }, [])
}

function userMatchesFilters(filters, user) {
    // Loop through all filters
    for (let i=0; i < filters.length; i++) {
        if (filters[i].name === "Username") {
            // Iterate through all filtered usernames
            for (let j=0; j < filters[i].values.length; j++) {
                if (user.username === filters[i].values[j]) {
                    return true
                }
            }
        } else if (filters[i].name === "Rating") {
            // Iterate through all filtered Rating
            for (let j=0; j < filters[i].values.length; j++) {
                if (user.rating === filters[i].values[j]) {
                    return true
                }
            }
        }
    }

    return false
}

function filterUsers(filters, users) {
    return users.reduce((filteredUsers, user) => {
        if (userMatchesFilters(filters, user)) {
            filteredUsers.push(user)
        }
        return filteredUsers
    }, [])
}

export default {
    getEvents,
    addEvent,
    filterEvents,
    filterUsers,
    editEvent,
    deleteEvent,
    addEventMember,
    removeEventMember,
    addFile,
    deleteFile
}