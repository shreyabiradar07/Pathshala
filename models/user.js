/* User model */
'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isAlphanumeric,  
			message: 'Invalid username - Should contains only letters and numbers.'
		}
	}, 
	password: {
		type: String,
		required: true,
		minlength: 4
	},

	rating: {
		type: Number,
		required: true,
		default : 0,
		maxlength: 1,
	},

	isAdmin: {
		type: Boolean,
		required: true,
		default : false,
	}
})


UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})


UserSchema.pre('findOneAndUpdate', function(next) {
	// findOneAndUpdate sets 'this' to a query object
	const update = this.getUpdate(); 

  if (update.password !== "") {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(update.$set.password, salt, (err, hash) => {
				this.getUpdate().$set.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})


UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this // binds this to the User model

	// First find the user by their email
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {

            // if (password === user.password) {
				
            //     resolve(user)
            // } else {
            //     reject()
            // }  
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

// Model using the User schema
const User = mongoose.model('User', UserSchema)
module.exports = { User }