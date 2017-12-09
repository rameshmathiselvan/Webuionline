/*
// Created by Academy on 20/10/16
// Controller for Managing City Master
*/

var HttpStatus = require('http-status');
var State = require('../../models/master/State');
var City = require('../../models/master/City');
var Validation = require('../../services/ValidationService');


//Export the save method to save a City
//Check if the city already exists 
//throw a city already exists error
//If not then create the city
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    City.findOne({
        name: new RegExp('^' + req.body.name + '$', 'i'),
        state: req.body.state
    }, function (err, result) {
        if (!!result) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'City Name',
                            data: result.name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            var newCity = City({
                name: req.body.name,
                country: req.body.country,
                state: req.body.state
            });
            newCity.save(function (err, result) {
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

//Export the list method to return a list of all Cities
exports.list = function (req, res) {
    //Write your list code here
    City.find().populate("state").exec(function (err, results) {
        if (err != null) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors(err)
            });
            return;
        }
        res.status(HttpStatus.OK).json({
            status: 'success',
            code: HttpStatus.OK,
            data: results
        });
    });
};


//Export the activeList method to list all active Cities
exports.activeList = function (req, res) {
    City.find({
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

//Export the getByState method to list 
//all active Cities for a given State
//The state id is passed as id in the request parameters
exports.getByState = function (req, res) {
    City.find({
        activeStatus: true,
        state: req.params.id
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
}

//Export the get method to return
//a City object given the id in the request parameters
exports.get = function (req, res) {
    City.findById(req.params.id, function (err, result) {
        if (!err) {
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
//Find the city by id passed in the request parameters 
//and update it with the city object in the request body
//Throw an error
//If the city name already exists
//If the city is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    City.find({
        $or: [{
            _id: req.params.id
        }, {
            name: new RegExp('^' + req.body.name + '$', 'i'),
            state: req.body.state
        }]
    }, function (err, results) {
        // id check - whether the city is found
        var foundArray = results.filter(function (item) {
            return item._id == req.params.id;
        });
        // duplicate check - whether city already exists for the given state
        var duplicateArray = results.filter(function (item) {
            return item._id != req.params.id;
        });
        if (!foundArray.length) {
            // city id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else if (!!duplicateArray.length) {
            // city name already exists under the same state & country
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        name: {
                            field: 'City Name',
                            data: duplicateArray[0].name,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // update the city and its state/country in db
            foundArray[0].name = req.body.name;
            foundArray[0].state = req.body.state;
            foundArray[0].updatedOn = Date.now();
            foundArray[0].save(function (err, result) {
                if (err) {
                    // city could not be updated
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
//Find the city by the id request parameter
//Update the city activeStatus to true
//Throw an error
//If the city is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    City.findByIdAndUpdate(req.params.id, {
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
//Find the city by the id request parameter
//Update the city activeStatus to false
//Throw an error
//If the city is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    City.findByIdAndUpdate(req.params.id, {
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