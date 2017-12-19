const joi = require("joi");
const setupValidator = require("../../../../../utils/validator/setupValidator");

class RideValidator {
    static createRideValidate(obj) {
        return setupValidator(obj, RideValidator.createRideSchema);
    }

    static outputRideValidate(obj) {
        return setupValidator(obj, RideValidator.outputRideSchema);
    }

    static endRideValidate(obj) {
        return setupValidator(obj, RideValidator.endRideSchema);
    }
}

RideValidator.endRideSchema = joi.object().keys({
    end_timestamp : joi.number().integer().required(),
    end_point : joi.object().keys({
        station_id : joi.string().required(),
        spot : joi.number().integer().min(0).required()
    }).required()
});

RideValidator.createRideSchema = joi.object().keys({
    bike_id : joi.string().required(),
    ride_id : joi.string(),
    start_point : joi.object().keys({
        station_id : joi.string().required(),
        spot : joi.number().integer().min(0).required()
    }).required(),
    end_point : joi.object().keys({
        station_id : joi.string().required(),
        spot : joi.number().integer().min(0).required()
    }),
    start_timestamp : joi.number().integer().required(),
    end_timestamp : joi.number().integer(),
    user_id : joi.string().required()
});

RideValidator.outputRideSchema = joi.object().keys({
    bike_id : joi.string().required(),
    ride_id : joi.string().required(),
    start_point : joi.object().keys({
        station_id : joi.string().required(),
        spot : joi.number().integer().min(0).required()
    }).required(),
    end_point : joi.object().keys({
        station_id : joi.string().required(),
        spot : joi.number().integer().min(0).required()
    }),
    start_timestamp : joi.number().integer().required(),
    end_timestamp : joi.number().integer(),
    user_id : joi.string().required()
});


module.exports = RideValidator;