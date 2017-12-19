const CustomTask = require("../../../../../utils/task/CustomTask");
const HetsoDbManager = require("../../../../../db/HetsoDbManager");
const BikeValidator = require("../validator/BikeValidator");

class BikeTask extends CustomTask {
	constructor(errorCallback) {
		super(errorCallback);

		this.BikeModel = HetsoDbManager.getInstance().bikeModel;

		this.validateAndReturnData = (bikeData) => {
            const validationResult = BikeValidator.outputBikeValidate(bikeData.toObject({virtuals : true}));
            if (validationResult.error) {
                this.validationError(validationResult.error, false);
            }
            else {
                this.ready(validationResult.value);
            }
        }
	}

	addBike(bikeData) {
	    BikeValidator.createBikeValidate(bikeData, (err, validBikeData) => {
	        if (err) {
                this.validationError(err, true);
                return;
            }
            this.BikeModel.create(validBikeData).then(this.validateAndReturnData, this.nativeError);
        });
    }

    updateBike(bikeId, bikeData) {
	    const validationResult = BikeValidator.updateBikeValidate(bikeData);

	    if (validationResult.error) {
	        this.validationError(validationResult.error, true);
	        return;
        }

        const validBikeData = validationResult.value;

        this.BikeModel.findOneAndUpdate({
            bike_id : bikeId
        }, {
            $set : validBikeData
        }, {
            new : true
        }).then(this.validateAndReturnData, this.nativeError);
    }

    getBike(bikeId) {
	    this.BikeModel.findOne({
            bike_id : bikeId
        }).then(this.validateAndReturnData, this.nativeError);
    }
}

module.exports = BikeTask;