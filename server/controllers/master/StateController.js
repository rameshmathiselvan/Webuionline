/*
// Created by Academy on 20/10/16
// Controller for managing the State Master
*/

var State = require('../../models/master/State');
var Country = require('../../models/master/Country');
var City = require('../../models/master/City');
var HttpStatus = require('http-status');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Validation = require('../../services/ValidationService');

//Export the save method to save a State
//Check if the State already exists 
//throw a State already exists error
//If not then create the State
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    State.findOne({
        name: new RegExp('^' + req.body.name + '$', 'i'),
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
                            field: 'State Name',
                            data: result.name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            var newState = State({
                name: req.body.name,
                country: req.body.country
            });
            newState.save(function (err, result) {
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
    //Write your save code here
};

//Export the list method to return a list of all States
exports.list = function (req, res) {
    State.find().populate('country').exec(function (err, results) {
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
    //Write your list code here
};

//Export the activeList method to list all active States
exports.activeList = function (req, res) {
    //Write your activeList code here
    State.find({
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
//all States for a given Country
//The Country id is passed as id in the request parameters
exports.getByCountry = function (req, res) {
    //Write your getbyCountry code here
    State.find({
        activeStatus: true,
        country: req.params.id
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

//Export the update method
//Find the State by id passed in the request parameters 
//and update it with the State object in the request body
//Throw an error
//If the State name already exists
//If the State is not found
////Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    State.find({
        $or: [{
            _id: req.params.id
        }, {
            name: new RegExp('^' + req.body.name + '$', 'i'),
            country: req.body.country
        }]
    }, function (err, results) {
        // id check - whether the country is found
        var foundArray = results.filter(function (item) {
            return item._id == req.params.id;
        });
        // duplicate check - whether country already exists 
        var duplicateArray = results.filter(function (item) {
            return item._id != req.params.id;
        });
        if (!foundArray.length) {
            // country id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else if (!!duplicateArray.length) {
            // country name already exists
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'Country Name',
                            data: duplicateArray[0].name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // update the country name in db
            foundArray[0].name = req.body.name;
            foundArray[0].updatedOn = Date.now();
            foundArray[0].countryn = req.body.country;
            foundArray[0].save(function (err, result) {
                if (err) {
                    // country could not be updated
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
//Find the State by the id request parameter
//Update the State activeStatus to true
//Throw an error
//If the State is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    //Write your activate code here
    State.findByIdAndUpdate(req.params.id, {
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
//Find the State by the id request parameter
//Update the State activeStatus to false
//Throw an error
//If the State is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    //Write your deactivate code here
    State.findByIdAndUpdate(req.params.id, {
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