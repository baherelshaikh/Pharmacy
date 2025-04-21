const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const path = require('path')
const moment = require('moment')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isMobilePhone,
      message: 'Please provide valid phone number',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  image: {
    type: String,
    default: path.join(__dirname,'../uploads/user2.jpg'),
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
    minlength: 5,
    maxlength: 50,
  },
  lastAction :{
    type: String,
    default:`Login at ${moment().format('hh:mm:ss A')}`
  }
});
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  if(this.image)
  this.image = path.join('./uploads/usersImages/', `${this.image}`)
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);