const mongoose = require("mongoose");
const ConfigSource = require("../../../config/ConfigSource");
const Config = require("../../../config/Config");

const getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.HETSO_DB);

const RideSchema = new mongoose.Schema({
	ride_id : {
		type : String,
		required : true
	},
	bike_id : {
		type : String,
		required : true
	},
	start_point : {
		station_id : {
			type : String,
			required : true
		},
		spot : {
			type : Number,
			required : true
		},
	},
	end_point : {
		station_id : {
			type : String,
		},
		spot : {
			type : Number,
		},
	},
	start_timestamp : {
		type : Number,
		required : true
	},
	end_timestamp : {
		type : Number,
		required : false
	},
	user_id : {
		type : String,
		required : true
	}
});

RideSchema.pre('validate', function(next) {
    var ride = this;

    if (ride.isNew && ride.ride_id == null)
    {
        ride.ride_id = `ride|${ride.id}`;
    }

    next();
});

RideSchema.set("autoIndex", getConfig("autoIndex"));
RideSchema.index({ride_id : 1}, {unique : true});
RideSchema.index({"start_point.station_id" : 1});
RideSchema.index({"end_point.station_id" : 1});
RideSchema.index({start_timestamp : 1});
RideSchema.index({user_id : 1});

module.exports = RideSchema;