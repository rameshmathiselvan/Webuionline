/*
// Created by Academy on 20/10/16
// Model file for College
// Fields to be captured
// name: String 
// addressLine1: String
// addressLine2: String
// city: Id reference to City Object
// state: Id reference to State Object
// country: Id reference to Country Object
// activeStatus: boolean
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the CollegeSchema here
var CollegeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: ObjectId,
    ref: 'City',
    required: true
  },
  state: {
    type: ObjectId,
    ref: 'State',
    required: true
  },
  country: {
    type: ObjectId,
    ref: 'Country',
    required: true
  },
  activeStatus: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('College', CollegeSchema);