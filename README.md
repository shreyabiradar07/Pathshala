# PrepMe

### Table of Contents
- [Demo Images](#demo-images)
- [User Interactions](#user-interactions)
- [Admin Interactions](#admin-interactions)
- [Routes](#routes)

## Demo Images
User Events Page | User Profile
:---------:|:------------:
![](/demo-images/events.png)|![](/demo-images/profile.png)
**Event Edit Page** | **Admin User-List Page**
![](/demo-images/event.png) | ![](/demo-images/admin.png)

## User Interactions
First, login using the following credentials:\
username: user\
password: user

Next, you will be redirected to the main Events page.
Here, you can view already created events, join events, as well as create your
own event using the button at the top of the page, which will present a new interface
for entering the event details.

On the left sidebar, there are navigation buttons for navigating between the main events
page and the user profile page.

On the user profile page, you will find your user rating, as well as a display of the
events you've created or joined.

Navigating between these pages also changes the right sidebar's contents.
On the main event page, the right sidebar presents filters for filtering events by
various parameters.
On the user profile page, the right sidebar presents an interface to change the user's
password.

On either page, viewing an event will open a new interface displaying the event's detailed
information. Editing your own event will open a similar interface where the information
can be changed.

During event creation/editing, The following details about the event can be set: 
* Event icon 
* course
* subject 
* location
* group size
* time and date of event
* event description.

In addition. Multiple files can be uploaded to the event, and viewers of the event will be able
to view those files. The file extensions listed [here](https://support.cloudinary.com/hc/en-us/articles/204292392-Why-does-Cloudinary-reject-the-files-I-m-uploading-)
are not supported.

On the event page, the list of members who have joined the event can also be seen using the
"view members" button at the bottom.

Finally, users who joined an event can rate that event's organizer on a scale from 1 to 5.

## Admin Interactions
First, login using the following credentials:\
username: admin\
password: admin

Next, you will be redirected to the main Events page.
Here, you can view already created events, join events, as well as create your
own event using the button at the top of the page, which will present a new interface
for entering the event details.

On the left sidebar, there are navigation buttons for navigating between the main events
page and the users page which displays all the users on the platform. This page is 
restricted to admins.

On the users page, you will find a list of all the users on the platform along with their
rating, and the ability to change their passwords if a user is locked out of their account.

Navigating between these pages also changes the right sidebar's contents.
On the main event page, the right sidebar presents filters for filtering events by
various parameters.
On the users page, the right sidebar presents filters for filtering users by various parameters.

On either page, viewing an event will open a new interface displaying the event's detailed
information. Editing any event will open a similar interface where the information
can be changed. Admins, unlike regular users, are able to edit any event, event those not
created by them. Admins are also able to remove members from events also, using the View Members button.


## Routes 

1- POST "/users/login": a route to login and create a session
   body 
   
    input: username, password
    output: the user 

2- GET "/users/login": a route to logout a user.
   Destroys the session cookie. 

3- GET /users/check-session: a route to check if a user is logged in on the session cookie
   body 
   
    input: user
    output: user username

4- GET /users: a route to get all the users
   
    output : the users with their ratings and usernames. 
   
5- GET /events: a route to get all the events
   
    output: a list of all the events. 

6- POST /events: a route to create an event, add an event. 
   
    output: the status of result from save. 

7- PATCH /events:id/ : a route to edit an event. 
   body 
   
    input: event 
    output: updtaded event
   
8- POST /events/member/:id/ : a route to add a member to an event based on the event id. 
   body 
   
    input: username of user
    output: updated event

9- DELETE /events/member/:id/ : a route to delete a member from an event based on the event id. 
   body 
   
    input: username of user
    output: updated event
   
10- PATCH /users :  a route to change the password of a user.
    body 
    
    input: username and new password
    output: updated user

11- PATCH /users/:username : a route to change the rating of a user based on its username
    body 
    
    input: the rating 
    output: the updated user
    
12- GET /users/:username : a route to get a user's rating and username, based on its username
    
    output: the user rating and username

13- DELETE /events/:id/ : a route to delete an event by it's id. 

    output: the event deleted 

14- POST /users : a route to create an user to web app. 

    input: username and password 
    output: the user created

15- POST /event_files : a route to upload a file for an event. 
    Note, the event's document is only updated when the event is saved. This route simply
    uploads the file to cloudinary and creates a standalone document for the file on our database.
    
    input: A file. Facilitated by the connect-multiparty package.
    output: The document created for the standalone file.
    
16- DELETE /event_files/:file_id : a route to delete a file by it's cloudinary ID. NOT the id
    assigned to the file's document by mongoDB. The cloudinary ID is stored in the document.
    
    input: The cloudinary ID of a file.
    output: The document of the file deleted.
