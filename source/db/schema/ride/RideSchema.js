const mongoose = require("mongoose");
const ConfigSource = require("../../../config/ConfigSource");
const Config = require("../../../config/Config");

const getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.HETSO_DB);

const RideSchema = new mongoose.Schema({
	ride_id : {
		type : Number,
		required : true
	},
	start_point : {
		station_id : {
			type : Number,
			required : true
		},
		spot : {
			type : Number,
			required : true
		},
	},
	end_point : {
		station_id : {
			type : Number,
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
		type : Number,
		required : true
	}
});

RideSchema.set("autoIndex", getConfig("autoIndex"));
RideSchema.index({ride_id : 1}, {unique : true});
RideSchema.index({"start_point.station_id" : 1});
RideSchema.index({"end_point.station_id" : 1});
RideSchema.index({start_timestamp : 1});
RideSchema.index({user_id : 1});

module.exports = RideSchema;