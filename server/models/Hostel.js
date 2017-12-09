/*
// Created by Academy on 20/10/16
// Model file for Hostel
// Fields to be captured
// name: String 
// college: id Reference to College Object
// activeStatus: boolean
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the HostelSchema here
var HostelSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  college: {
    type: ObjectId,
    ref: 'College',
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

module.exports = mongoose.model('Hostel', HostelSchema);