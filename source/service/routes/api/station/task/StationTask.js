const CustomTask = require("../../../../../utils/task/CustomTask");
const HetsoDbManager = require("../../../../../db/HetsoDbManager");
const StationValidator = require("../validator/StationValidator");

class StationTask extends CustomTask {
    constructor(errorCallback) {
        super(errorCallback);

        this.StationModel = HetsoDbManager.getInstance().stationModel;

        this.validateAndReturnData = (stationData) => {
            const validationResult = StationValidator.outputStationValidate(stationData.toObject({virtuals : true}));
            if (validationResult.error) {
                this.validationError(validationResult.error, false);
            }
            else {
                this.ready(validationResult.value);
            }
        }
    }

    getStation(stationId) {
        this.StationModel.findOne({
            station_id : stationId
        }).then(this.validateAndReturnData, this.nativeError);
    }

    addStation(data) {
        const validationResult = StationValidator.createStationValidate(data);

        if (validationResult.error) {
            this.validationError(validationResult.error, true);
            return;
        }

        const validData = validationResult.value;



        validData.spots = [];

        for (let i = 0; i < validData.num_spots; ++i) {
            validData.spots.push({
                status : "free"
            });
        }

        delete validData.num_spots;

        this.StationModel.create(validData).then(this.validateAndReturnData, this.nativeError);
    }

    updateStation(stationId, data) {
        const validationResult = StationValidator.updateStationValidate(data);

        if (validationResult.error) {
            this.validateAndReturnData(validationResult.error, true);
            return;
        }

        const validUpdate = validationResult.value;

        let mongoUpdate = validUpdate;

        for (let i = 0; i < validUpdate.spot_updates.length; ++i) {
            const spotId = validUpdate.spot_updates[i].spot_id
            mongoUpdate[`spots.${spotId}`] = validUpdate.spot_updates[i].spot;
        }

        delete mongoUpdate.spot_updates;

        this.StationModel.findOneAndUpdate({station_id : stationId}, {
            $set : mongoUpdate
        }, {new : true}).then(this.validateAndReturnData, this.nativeError);
    }
}

module.exports = StationTask;