const mongoose = require('mongoose');

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI =  'mongodb://localhost:27017/PrepMeAPI';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},()=>{
    console.log("Connected to Database");
});

module.exports = { mongoose };