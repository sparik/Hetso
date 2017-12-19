const joi = require("joi");
const {ValidationError, ObjectSchema, ValidationResult} = require("joi");

module.exports = function setupValidator(obj, schema, callback) {
    if (!callback) {
        return joi.validate(obj, schema, {stripUnknown : true});
    }
    else {
        joi.validate(obj, schema, {stripUnknown : true}, callback);
    }
}