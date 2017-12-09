/*
// Created by Academy on 20/10/16
// Controller for Managing Colleges
*/
var HttpStatus = require('http-status');
var College = require('../models/College');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Validation = require('../services/ValidationService');

//Export the save method to save a College
//Check if the College already exists
//throw a College already exists error
//If not then create the College
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    College.findOne({
        name: new RegExp('^' + req.body.name + '$', 'i'),
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
    }, function (err, result) {
        if (!!result) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'College Name',
                            data: result.name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            var newCollege = College({
                name: req.body.name,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country
            });
            newCollege.save(function (err, result) {
                if (err) {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        status: 'failure',
                        code: HttpStatus.BAD_REQUEST,
                        data: '',
                        error: Validation.validationErrors(err)
                    });
                } else {
                    res.status(HttpStatus.OK).json({
                        status: 'success',
                        code: HttpStatus.OK,
                        data: result
                    });
                }
            });
        }
    });
};

//Export the list method to return a list of all Colleges
exports.list = function (req, res) {
    College.find().populate('city state').exec(function (err, results) {
        if (err) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors(err)
            });
            return;
        } else {
            res.status(HttpStatus.OK).json({
                status: 'success',
                code: HttpStatus.OK,
                data: results
            });
        }
    });
};

//Export the activeList method to return a list of all Active Colleges
exports.activeList = function (req, res) {
    College.find({
        activeStatus: true
    }, function (err, result) {
        if (err) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors(err)
            });
        } else {
            res.status(HttpStatus.OK).json({
                status: 'success',
                code: HttpStatus.OK,
                data: result
            });
        }
    });
};

//Export the getByCountry method to list 
//all active Colleges for a given Country
//The Country id is passed as id in the request parameters
exports.getByCountry = function (req, res) {
    College.find({
        activeStatus: true,
        "country": req.params.id
    }, function (err, results) {
        if (err) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors()
            });
        } else {
            res.status(HttpStatus.OK).json({
                status: 'success',
                code: HttpStatus.OK,
                data: results
            });
        }
    });
};

//Export the get method to return
//a College object given the id in the request parameters
exports.get = function (req, res) {
    College.findById(req.params.id).populate("city state country").exec(function (err, results) {
        if (err) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors(err)
            });
        } else {
            res.status(HttpStatus.OK).json({
                status: 'success',
                code: HttpStatus.OK,
                data: results
            });
        }
    });
};

//Export the update method
//Find the College by id passed in the request parameters 
//and update it with the College object in the request body
//Throw an error
//If the College name already exists
//If the College is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    College.find({
        $or: [{
            _id: req.params.id
        }, {
            name: new RegExp('^' + req.body.name + '$', 'i'),
            city: req.body.city,
            state: req.body.state,
            country: req.body.country
        }]
    }, function (err, results) {
        // id check - whether the College is found
        var foundArray = results.filter(function (item) {
            return item._id == req.params.id;
        });
        // duplicate check - whether college already exists in the same location
        var duplicateArray = results.filter(function (item) {
            return item._id != req.params.id;
        });
        if (!foundArray.length) {
            // college id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else if (!!duplicateArray.length) {
            // college name already exists
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'College Name',
                            data: duplicateArray[0].name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // update the college in db
            foundArray[0].name = req.body.name;
            foundArray[0].addressLine1 = req.body.addressLine1;
            foundArray[0].addressLine2 = req.body.addressLine2;
            foundArray[0].city = req.body.city;
            foundArray[0].state = req.body.state;
            foundArray[0].country = req.body.country;
            foundArray[0].updatedOn = Date.now();
            foundArray[0].save(function (err, result) {
                if (err) {
                    // college could not be updated
                    res.status(HttpStatus.BAD_REQUEST).json({
                        status: 'failure',
                        code: HttpStatus.BAD_REQUEST,
                        error: Validation.validationErrors(err)
                    });
                } else {
                    res.status(HttpStatus.OK).json({
                        status: 'success',
                        code: HttpStatus.OK,
                        data: result
                    });
                }
            });
        }
    });
};

//Export the activate method
//Find the College by the id request parameter
//Update the College activeStatus to true
//Throw an error
//If the College is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    College.findByIdAndUpdate(req.params.id, {
        $set: {
            activeStatus: true,
            updatedOn: Date.now()
        }
    }, function (err, result) {
        if (err) {
            // status could not be updated
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors(err)
            });
        } else if (!result) {
            // country id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else {
            res.status(HttpStatus.OK).json({
                status: 'success',
                code: HttpStatus.OK,
                data: result
            });
        }
    });
};

//Export the deactivate method
//Find the College by the id request parameter
//Update the College activeStatus to false
//Throw an error
//If the College is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    College.findByIdAndUpdate(req.params.id, {
        $set: {
            activeStatus: false,
            updatedOn: Date.now()
        }
    }, function (err, result) {
        if (err) {
            // status could not be updated
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors(err)
            });
        } else if (!result) {
            // country id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else {
            res.status(HttpStatus.OK).json({
                status: 'success',
                code: HttpStatus.OK,
                data: result
            });
        }
    });
};