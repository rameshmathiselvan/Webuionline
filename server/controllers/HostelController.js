/*
// Created by Academy on 20/10/16
// Controller for Managing Hostels
*/

var HttpStatus = require('http-status');
var College = require('../models/College');
var Hostel = require('../models/Hostel');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Validation = require('../services/ValidationService');

//Export the save method to save a Hostel
//Check if the Hostel already exists for the given College
//throw a Hostel already exists error
//If not then create the Hostel for the Given College
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    Hostel.findOne({
        name: new RegExp('^' + req.body.name + '$', 'i'),
        college: req.body.college
    }, function (err, result) {
        if (!!result) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'Hostel Name',
                            data: result.name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            var newHostel = Hostel({
                name: req.body.name,
                college: req.body.college
            });
            newHostel.save(function (err, result) {
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

//Export the list method to return a list of all Hostels
exports.list = function (req, res) {
    Hostel.find(function (err, results) {
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

//Export the getByCollege method to list 
//all Hostels for a given College
//The College id is passed as id in the request parameters
exports.getByCollege = function (req, res) {
    Hostel.find({
        "college": req.params.id
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

//Export the activeListByCollege method to list 
//all active Hostels for a given College
//The College id is passed as id in the request parameters
exports.activeListByCollege = function (req, res) {
    Hostel.find({
        activeStatus: true,
        "college": req.params.id
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
}

//Export the get method to return
//a Hostel object given the id in the request parameters
exports.get = function (req, res) {
    Hostel.findById(req.params.id, function (err, results) {
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
//Find the Hostel by id passed in the request parameters 
//and update it with the Hostel object in the request body
//Throw an error
//If the Hostel name already exists
//If the Hostel is not found
////Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    Hostel.find({
        $or: [{
            _id: req.params.id
        }, {
            name: new RegExp('^' + req.body.name + '$', 'i'),
            college: req.body.college
        }]
    }, function (err, results) {
        // id check - whether the hostel is found
        var foundArray = results.filter(function (item) {
            return item._id == req.params.id;
        });
        // duplicate check - whether hostel already exists for the given college
        var duplicateArray = results.filter(function (item) {
            return item._id != req.params.id;
        });
        if (!foundArray.length) {
            // Hostel id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else if (!!duplicateArray.length) {
            // Hostel name already exists
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'Hostel Name',
                            data: duplicateArray[0].name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // update the hostel in db
            foundArray[0].name = req.body.name;
            foundArray[0].updatedOn = Date.now();
            foundArray[0].save(function (err, result) {
                if (err) {
                    // Hostel could not be updated
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
//Find the Hostel by the id request parameter
//Update the Hostel activeStatus to true
//Throw an error
//If the Hostel is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    Hostel.findByIdAndUpdate(req.params.id, {
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
            // Hostel id not found in db
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
//Find the Hostel by the id request parameter
//Update the Hostel activeStatus to false
//Throw an error
//If the Hostel is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    Hostel.findByIdAndUpdate(req.params.id, {
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
            // Hostel id not found in db
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