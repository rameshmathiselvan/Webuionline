/*
// Created by Academy on 20/10/16
// Controller for Managing the Country Master
*/

var Country = require('../../models/master/Country');
var HttpStatus = require('http-status');
var Validation = require('../../services/ValidationService');

//Export the save method to save a Country
//Check if the country already exists 
//throw a country already exists error
//If not then create the country
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    //Write your save code here
    // duplicate check - whether Country name already exists
    Country.findOne({
        name: new RegExp('^' + req.body.name + '$', 'i')
    }, function (err, result) {
        if (!!result) {
            // country name already exists
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'Country Name',
                            data: result.name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // save the new country name in db
            var newCountry = Country({
                name: req.body.name
            });
            newCountry.save(function (err, result) {
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
        }
    });
};

//Export the list method to return a list of all Countries
exports.list = function (req, res) {
    //Write your list code here
    Country.find({}, function (err, result) {
        if (err) {
            // country list could not be retrieved
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

//Export the activeList method to list all active Countries
exports.activeList = function (req, res) {
    //Write your activeList code here
    Country.find({
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

//Export the update method
//Find the Country by id passed in the request parameters 
//and update it with the country object in the request body
//Throw an error
//If the country name already exists
//If the country is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    //Write your update code here
    Country.find({
        $or: [{
            _id: req.params.id
        }, {
            name: new RegExp('^' + req.body.name + '$', 'i')
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
//Find the Country by the id in request parameter
//Update the Country's activeStatus to true
//Throw an error
//If the country is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    //Write your activate code here
    Country.findByIdAndUpdate(req.params.id, {
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
//Find the Country by the id in request parameter
//Update the Country's activeStatus to false
//Throw an error
//If the country is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    //Write your deactivate code here
    Country.findByIdAndUpdate(req.params.id, {
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