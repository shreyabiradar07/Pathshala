'use strict';
const log = console.log;
log('Express server');

const express = require('express');
const app = express();
const ContentBasedRecommender = require('content-based-recommender')
const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 100
  });
// mongoose and mongo connection
const { mongoose } = require('./db/mongoose');
mongoose.set('useFindAndModify', false); // for some deprecation issues

const { Event, EventFile } = require('./models/event');
const { User } = require("./models/user");

// to validate object IDs
const { ObjectID } = require('mongodb')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// cloudinary
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'shayankhalili',
    api_key: '637496815379257',
    api_secret: 'xEti_UUGTHKekrixKoOeZq7nFTI'
});

const session = require("express-session"); 
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

/*** Session handling **************************************/
// Create a session cookie
app.use(
    session({
        secret: "raymanshay",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 1800000,
            httpOnly: true
        }
    })
);

// Middleware for authentication of resources
// Taken from class express-authentication example
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.status(401).send("Unauthorized")
		})
	} else {
		res.status(401).send("Unauthorized")
	}
}

// A route to login and create a session
app.post("/users/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Use the static method on the User model to find a user
    // by their email and password
    User.findByUsernamePassword(username, password)
        .then(user => {
            // Add the user's id to the session cookie.
            // We can check later if this exists to ensure we are logged in.
            req.session.user = user._id;
            req.session.username = user.username;
            res.send(user);
        })
        .catch(error => {
            res.status(400).send()
        });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
    // Remove the session
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

// A route to check if a use is logged in on the session cookie
app.get("/users/check-session", (req, res) => {
    if (req.session.user) {
        res.send({ currentUser: req.session.username });
    } else {
        res.status(401).send();
    }
});
app.get("/users/curruser", (req, res) => {
  User.findById(req.session.user).then(user => {
      res.json({currentUser: user});
  }).catch((error)=>{
      console.log('====================================');
      console.log(error);
      console.log('====================================');
  })
});
app.get('/users', (req, res) => {
    User.find().then((users) => {
        const filteredUsers = []
        for (let i = 0; i < users.length; i++) {
            const filteredUser = {
                username: users[i].username,
                rating: users[i].rating
            }
            filteredUsers.push(filteredUser)
        }
        res.send(filteredUsers) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })
});
app.get('/recommendedGroups', (req, res)=>{
    var docs=[];
    console.log(req.headers);
    var strengths = JSON.parse(req.headers.weaknesses);
    
    Event.find().then((events) => {
        const filtered=[];
        const recommendedGroups=[]

        strengths.map(strength =>{
             events.map(event => {
                 console.log(event);
                 console.log(strength);
                 if(event.description.toLowerCase().includes(strength.toLowerCase())) 
                 {   console.log(event._id);
                     recommendedGroups.push(event)
                     filtered.push(event._id)
                     
                    }
               })
        })
       
        events.map(event=>{
            docs.push({ 
                "id":event._id,
                "content":event.description
            })
        })
        console.log(docs)
        recommender.train(docs);
        console.log(filtered);
        const similarDocuments = recommender.getSimilarDocuments(filtered[0], 0, 1);
        const ids=[];
        console.log(similarDocuments);
        similarDocuments.map(doc=>{
            ids.push(doc.id)
        })
        
      
        ids.map(id =>{
            events.map(event => {
             
                if(event._id === id&& !recommendedGroups.includes(event)) 
                {  
                    recommendedGroups.push(event)}
              })
       })
        res.json({recommendedGroups}) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })
})
app.get('/events', authenticate, (req, res) => {
    var docs=[];
    Event.find().then((events) => {
        
        events.map(event=>{
            docs.push({ 
                "id":event._id,
                "content":event.description
            })
        })
        console.log(docs)
        recommender.train(docs);
        const similarDocuments = recommender.getSimilarDocuments("615825bf8be4cf42e49a3db2", 0, 10);
        console.log(similarDocuments);
        res.send(events) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })
});

app.post('/events', authenticate, (req, res) => {
    const event = new Event(req.body);

    event.save().then((result) => {
        res.send(result)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })
});

app.patch('/events/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const event = req.body;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return;
    }

    // Update the event by its id.
    Event.findOneAndUpdate({_id: id}, {$set: event}, {new: true}).then((updatedEvent) => {
        if (!updatedEvent) {
            res.status(404).send()
        } else {
            res.send(updatedEvent)
        }
    }).catch((error) => {
        res.status(400).send() // bad request for changing the event.
    })
});

app.post('/events/member/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const username = req.body.username;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return;
    }

    // Add member to event
    Event.findOneAndUpdate({_id: id}, {$push: {members: username}}, {new: true}).then((updatedEvent) => {
        if (!updatedEvent) {
            res.status(404).send()
        } else {
            res.send(updatedEvent)
        }
    }).catch((error) => {
        res.status(400).send() // bad request for adding member.
    })
});

app.delete('/events/member/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const username = req.body.username;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return;
    }

    // Add member to event
    Event.findOneAndUpdate({_id: id}, {$pullAll: {members: [username]}}, {new: true}).then((updatedEvent) => {
        if (!updatedEvent) {
            res.status(404).send()
        } else {
            res.send(updatedEvent)
        }
    }).catch((error) => {
        res.status(400).send() // bad request for changing the event.
    })
});

app.patch('/users', (req, res) => {

    const username = req.body.username
    const newpassword = req.body.newpassword

    User.findOneAndUpdate({username : username}, {$set: {password : newpassword}}, {new: true}).then((updatedUser) => {
        if (!updatedUser) {
            res.status(404).send()
        } else {
            res.send(updatedUser)
        } 
    }).catch((error) => {
        log(error)
        res.status(400).send() // bad request for changing the event.
    })
})

app.patch('/users/:username', authenticate, (req, res) => {
    const username = req.params.username
    const newRating = req.body.newRating

    User.findOneAndUpdate({username: username}, {$set: {rating: newRating}}, {new: true})
        .then((user) => {
            if (!user) {
                res.status(404).send()
            } else {
                res.send(user)
            }
        })
        .catch((error) => {
            log(error)
            res.status(400).send()
        })
})

app.get('/users/:username', (req, res) => {
    const username = req.params.username

    User.findOne({username: username})
        .then((user) => {
            if (!user) {
                res.status(404).send()
            } else {
                const filteredUser = {
                    username: user.username,
                    rating: user.rating
                }
    
                res.send(filteredUser)
            }
        })
        .catch((error) => {
            log(error)
            res.status(400).send(error)
        })
});

app.delete('/events/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
        return;
    }

    // Delete the event by its id.
    Event.findByIdAndDelete(id).then((event) => {
        if (!event) {
            res.status(404).send()
        } else {
            res.send(event)
        }
    }).catch((error) => {
        res.status(400).send() 
    })
});

/** User routes below **/
// Set up a POST route to *create* a user of your web app (*not* a student).
app.post("/users", (req, res) => {
    // Create a new user
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        weaknesses: req.body.weaknesses
    });

    // Save the user
    user.save().then(
        user => {
            res.send(user);
        },
        error => {
            res.status(400).send(error); // 400 for bad request
        }
    );
});

/** File Upload Routes **/

// A POST route to upload a file for an event. Note: This does not directly attach a file to the event, that will be
// done in the /event POST or PATCH route.
app.post("/event_files", multipartMiddleware, (req, res) => {
    cloudinary.v2.uploader.upload(
        req.files.file.path,
        { resource_type: "auto" },
        function (error, result) {
            var file = new EventFile({
                file_name: req.files.file.originalFilename,
                file_id: result.public_id,
                file_url: result.url
            });

            file.save().then(
                saveRes => {
                    res.send(saveRes);
                },
                error => {
                    res.status(400).send(error); // 400 for bad request
                }
            );
        });
});

/// a DELETE route to remove a file by its id
app.delete("/event_files/:file_id", (req, res) => {
    const file_id = req.params.file_id;
    const { editing, event_id } = req.body;

    // Delete a file by its id (NOT the database ID, but its id on the cloudinary server)
    cloudinary.uploader.destroy(file_id, function (result) {

        // Delete the image from the database
        EventFile.findOneAndRemove({ file_id: file_id })
            .then(file => {
                if (!file) {
                    res.status(404).send();
                } else {
                    if (editing === 1) {
                        Event.findByIdAndUpdate(event_id, {$pull: {files: file}}, {new: true})
                            .then(event => {
                                if (!event) {
                                    res.status(404).send();
                                } else {
                                    res.send(file);
                                }
                            })
                    }
                }
            })
            .catch(error => {
                res.status(500).send(); // server error, could not delete.
            });
    });
});

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(__dirname + '/pathshala/public'));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    res.sendFile(__dirname + '/pathshala/public/index.html');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    log(`Listening on port ${port}...`)
});


