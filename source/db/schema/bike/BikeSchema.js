const mongoose = require("mongoose");
const ConfigSource = require("../../../config/ConfigSource");
const Config = require("../../../config/Config");

const getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.HETSO_DB);

const BikeSchema = new mongoose.Schema({
	bike_id : {
		type : Number,
		required : true
	},
	status : {
		type : String,
		required : true,
		enum : ["in_station", "in_ride", "in_repair", "out_of_order"]
	},
	location : {
		station_id : Number,
		spot : Number
	}
});


BikeSchema.set("autoIndex", getConfig("autoIndex"));
BikeSchema.index({bike_id : 1}, {unique : true});
BikeSchema.index({status : 1});
BikeSchema.index({"location.station_id" : 1});

module.exports = BikeSchema;