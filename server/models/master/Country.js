/*
// Created by Academy on 20/10/16
// Model file for Country
// Fields to be captured
// name: String 
// activeStatus: boolean
// createdOn: Date
// updatedOn: Date
// All fields are mandatory
*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//Define the CountrySchema Here
var CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
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

module.exports = mongoose.model('Country', CountrySchema);