const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords must match',
    },
  },
});

userSchema.pre('save', async function (next) {
  //runs if password was actually modified
  if (!this.isModified('password')) return next();

  //encrypts password
  this.password = await bcrypt.hash(this.password, 12);
  //delete password confirm in the pre middleware since it is not hashed
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
