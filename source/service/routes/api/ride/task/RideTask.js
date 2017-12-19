const CustomTask = require("../../../../../utils/task/CustomTask");
const HetsoDbManager = require("../../../../../db/HetsoDbManager");
const RideValidator = require("../validator/RideValidator");

class RideTask extends CustomTask {
    constructor(errorCallback) {
        super(errorCallback);

        this.RideModel = HetsoDbManager.getInstance().rideModel;

        this.validateAndReturnData = (rideData) => {
            const validationResult = RideValidator.outputRideValidate(rideData.toObject({virtuals : true}));
            if (validationResult.error) {
                this.validationError(validationResult.error, false);
            }
            else {
                this.ready(validationResult.value);
            }
        }
    }

    addRide(data) {
        const validationResult = RideValidator.createRideValidate(data);

        if (validationResult.error) {
            this.validationError(validationResult.error, true);
            return;
        }

        const validData = validationResult.value;

        this.RideModel.create(validData).then(this.validateAndReturnData, this.nativeError);
    }

    getRide(rideId) {
        this.RideModel.findOne({ride_id : rideId}).then(this.validateAndReturnData, this.nativeError);
    }

    endRide(rideId, data) {
        const validationResult = RideValidator.endRideValidate(data);

        if (validationResult.error) {
            this.validationError(validationResult.error, true);
            return;
        }

        const validData = validationResult.value;

        this.RideModel.findOneAndUpdate({
            ride_id : rideId
        }, {
            $set : validData
        }).then(this.validateAndReturnData, this.nativeError);
    }
}

module.exports = RideTask;