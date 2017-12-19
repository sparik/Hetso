const joi = require("joi");
const setupValidator = require("../../../../../utils/validator/setupValidator");

class BikeValidator {
    static createBikeValidate(obj, callback) {
        return setupValidator(obj, BikeValidator.createBikeSchema, callback);
    }

    static updateBikeValidate(obj, callback) {
        return setupValidator(obj, BikeValidator.updateBikeSchema, callback);
    }

    static outputBikeValidate(obj, callback) {
        return setupValidator(obj, BikeValidator.outputSchema, callback);
    }
}

BikeValidator.createBikeSchema = joi.object().keys({
    bike_id : joi.string(),
    status : joi.string().valid(["in_station", "in_ride", "in_repair", "out_of_order"]).required(),
    location : joi.object().keys({
        station_id : joi.string(),
        spot : joi.number().integer()
    })
});

BikeValidator.updateBikeSchema = joi.object().keys({
    status : joi.string().valid(["in_station", "in_ride", "in_repair", "out_of_order"]).required(),
    location : joi.object().keys({
        station_id : joi.string(),
        spot : joi.number().integer()
    })
});

BikeValidator.outputSchema = joi.object().keys({
    bike_id : joi.string().required(),
    status : joi.string().valid(["in_station", "in_ride", "in_repair", "out_of_order"]).required(),
    location : joi.object().keys({
        station_id : joi.string(),
        spot : joi.number().integer()
    })
});

module.exports = BikeValidator;