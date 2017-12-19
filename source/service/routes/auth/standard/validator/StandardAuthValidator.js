const joi = require("joi");
const {ObjectSchema, ValidationError} = require("joi");
const setupValidator = require("../../../../../utils/validator/setupValidator");

class StandardAuthValidator {

    static loginUserValidate(obj, callback) {
        setupValidator(obj, StandardAuthValidator.loginUserSchema, callback);
    }

    static signupUserValidate(obj, callback) {
        setupValidator(obj, StandardAuthValidator.signupUserSchema, callback);
    }

    static outputUserValidate(obj, callback) {
        setupValidator(obj, StandardAuthValidator.outputUserSchema, callback);
    }
}

StandardAuthValidator.loginUserSchema = joi.object().keys({
        username : joi.string().regex(/^[a-z0-9]{4,30}$/).required(),
        password : joi.string().required(),
        scope : joi.array().items(joi.string()).optional(),
        profile : joi.array().items(joi.string()).optional()
    });

StandardAuthValidator.signupUserSchema =  joi.object().keys({
        username : joi.string().regex(/^[a-z0-9]{4,30}$/).required(),
        password : joi.string().regex(/^[a-z0-9]{4,30}$/).required(),
        auto_login : joi.boolean().optional(),
        email : joi.string().email().optional(),
        mobile : joi.string(),
        name : joi.string()
    });

StandardAuthValidator.outputUserSchema = joi.object().keys({
        user_id : joi.string(),
        username : joi.string(),
        name : joi.string(),
        email : joi.string().email(),
        mobile : joi.string(),
        email_verified : joi.boolean(),
        mobile_verified : joi.boolean(),
        picture : joi.string()
    });

module.exports = StandardAuthValidator;