/*
// Created by Academy on 20/10/16
// Model file for City
// Fields to be captured
// name: String 
// state: id Reference to State Object
// activeStatus: String
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the CitySchema here
var CitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: ObjectId,
    ref: 'State',
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

module.exports = mongoose.model('City', CitySchema);