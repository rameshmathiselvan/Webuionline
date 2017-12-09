/*
// Created by Academy on 20/10/16
// Create ValidationService with a single function validationErrors
// Capture the mongodb errors and return them as Understandable messages
// For example if a required field is not included, then capture the error
// return <field name> is Required
*/
exports.validationErrors = function (err) {
    var errors = {};
    // Write your code here
    var regEx = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
    var fieldName;
    if (err) {
        switch (err.name) {
            case 'ValidationError':
                for (field in err.errors) {
                    // convert field name to user friendly form (camelcase to spaces)
                    fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(regEx, '$1$4 $2$3$5');
                    switch (err.errors[field].kind) {
                        case 'required':
                            errors[field] = fieldName + ' is required';
                            break;
                        case 'duplicate':
                            errors[field] = err.errors[field].field + ' "' + err.errors[field].data + '" already exists';
                            break;
                        case 'enum':
                            errors[field] = 'Invalid ' + fieldName;
                            break;
                        case "Number":
                            errors[field] = fieldName + ' must be a number';
                            break;
                        case "Date":
                            errors[field] = fieldName + ' must be a valid date';
                            break;
                        case "ObjectID":
                            errors[field] = fieldName + ' is not valid';
                            break;
                    }
                }
                break;
            case 'MongoError':
                // get field name from mongo error message
                var field = err.message.split('.$')[1];
                field = field.split(' dup key')[0];
                field = field.substring(0, field.lastIndexOf('_'));
                errors[field] = field.charAt(0).toUpperCase() + field.slice(1) + ' already exists';
                break;
            default:
                errors.name = "An error occurred while processing the request. Please try again after some time."
        }
    } else {
        errors.name = "An error occurred while processing the request. Please try again after some time."
    }
    return errors;
};