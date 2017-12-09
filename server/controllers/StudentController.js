/*
// Created by Academy on 20/10/16
// Controller for Managing Students
*/
var Student = require('../models/Student');
var Validation = require('../services/ValidationService');

var HttpStatus = require('http-status');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

//Export the save method to save a Student
//Check if the Roll No already exists 
//throw a Roll no already exists error
//If not then create the Student
//Use the validationErrors service for any validation errors
exports.save = function (req, res) {
    //Write your save code here
    // duplicate check - whether roll no already exists for the given college
    Student.findOne({
        rollNo: req.body.rollNo,
        college: req.params.collegeid
    }, function (err, result) {
        if (!!result) {
            // roll number already exists
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        rollNo: {
                            field: 'Roll No',
                            data: result.rollNo,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // save the new student details in db
            var newStudent = Student({
                name: req.body.name,
                rollNo: req.body.rollNo,
                dob: req.body.dob,
                mobileNumber: req.body.mobileNumber,
                year: req.body.year,
                yearOfJoining: req.body.yearOfJoining,
                college: req.params.collegeid,
                hostel: req.body.hostel
            });
            newStudent.save(function (err, result) {
                // student details could not be saved
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

//Export the get method to return
//a Student object given the id in the request parameters
//If the student is not found
//Throw a student not found error
exports.get = function (req, res) {
    //Write your get code here
    Student.findById(req.params.id, function (err, result) {
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

//Export the list method to return a list of all Students
exports.list = function (req, res) {
    //Write your list code here
    Student.find(function (err, results) {
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

//Export the getByCollege method to list 
//all active Students for a given College
//The College id is passed as id in the request parameters
exports.getByCollege = function (req, res) {
    //Write your getByCollege code here
    Student.find({
        college: req.params.id
    }, function (err, results) {
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
//Find the Student by id passed in the request parameters 
//and update it with the Student object in the request body
//Throw an error
//If the Student Roll No already exists
//If the Roll No is not found
//Use the validationErrors service for any validation errors
exports.update = function (req, res) {
    //Write your update code here
    Student.find({
        $or: [{
            _id: req.params.id
        }, {
            rollNo: req.body.rollNo,
            college: req.body.college
        }]
    }, function (err, results) {
        // id check - whether the student is found
        var foundArray = results.filter(function (item) {
            return item._id == req.params.id;
        });
        // duplicate check - whether roll no already exists for the given college
        var duplicateArray = results.filter(function (item) {
            return item._id != req.params.id;
        });
        if (!foundArray.length) {
            // Student id not found in db
            res.status(HttpStatus.NOT_FOUND).json({
                status: 'failure',
                code: HttpStatus.NOT_FOUND,
                error: Validation.validationErrors()
            });
        } else if (!!duplicateArray.length) {
            // Roll number already exists
            res.status(HttpStatus.BAD_REQUEST).json({
                status: 'failure',
                code: HttpStatus.BAD_REQUEST,
                error: Validation.validationErrors({
                    name: 'ValidationError',
                    errors: {
                        rollNo: {
                            field: 'Roll No',
                            data: duplicateArray[0].rollNo,
                            kind: 'duplicate'
                        }
                    }
                })
            });
        } else {
            // update the student details in db
            foundArray[0].name = req.body.name;
            foundArray[0].rollNo = req.body.rollNo;
            foundArray[0].mobileNumber = req.body.mobileNumber;
            foundArray[0].year = req.body.year;
            foundArray[0].yearOfJoining = req.body.yearOfJoining;
            foundArray[0].hostel = req.body.hostel;
            foundArray[0].dob = req.body.dob;
            foundArray[0].updatedOn = Date.now();
            foundArray[0].save(function (err, result) {
                if (err) {
                    // Student details could not be updated
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
//Find the Student by the id request parameter
//Update the Student activeStatus to true
//Throw an error
//If the Student is not found
//Use the validationErrors service for any validation errors
exports.activate = function (req, res) {
    //Write your activate code here
    Student.findByIdAndUpdate(req.params.id, {
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
            // Student id not found in db
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
//Find the Student by the id request parameter
//Update the Student activeStatus to false
//Throw an error
//If the Student is not found
//Use the validationErrors service for any validation errors
exports.deactivate = function (req, res) {
    //Write your deactivate code here
    Student.findByIdAndUpdate(req.params.id, {
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
            // Student id not found in db
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
