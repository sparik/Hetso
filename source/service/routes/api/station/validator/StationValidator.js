const joi = require("joi");
const setupValidator = require("../../../../../utils/validator/setupValidator");

class StationValidator {
    static createStationValidate(obj) {
        return setupValidator(obj, StationValidator.createStationSchema);
    }

    static outputStationValidate(obj) {
        return setupValidator(obj, StationValidator.outputStationSchema);
    }

    static updateStationValidate(obj) {
        return setupValidator(obj, StationValidator.updateStationSchema);
    }
}

StationValidator.updateStationSchema = joi.object().keys({
    station_name : joi.string(),
    spot_updates : joi.array().items(joi.object().keys({
        spot_id : joi.number().integer().min(0).required(),
        spot : joi.object().keys({
            status : joi.string().valid(["has_bike", "free", "out_of_order"]).required()
        }).required()
    }))
});

StationValidator.createStationSchema = joi.object().keys({
    station_name : joi.string(),
    station_id : joi.string(),
    location : joi.object().keys({
        lat : joi.number().required(),
        long : joi.number().required()
    }).required(),
    num_spots : joi.number().integer().min(0).required()
});

StationValidator.outputStationSchema = joi.object().keys({
    station_id : joi.string().required(),
    station_name : joi.string(),
    location : joi.object().keys({
        lat : joi.number().required(),
        long : joi.number().required()
    }).required(),
    spots : joi.array().items(joi.object().keys({
        status : joi.string().valid(["has_bike", "free", "out_of_order"])
    }))
});

module.exports = StationValidator;