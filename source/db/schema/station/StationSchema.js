const mongoose = require("mongoose");
const ConfigSource = require("../../../config/ConfigSource");
const Config = require("../../../config/Config");

const getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.HETSO_DB);

const StationSchema = new mongoose.Schema({
	station_id : {
		type : Number,
		required : true
	},
	station_name : {
		type : String,
		default : "Unnamed station"
	},
	location : {
		lat : {
			type : Number,
			required : true
		},
		long : {
			type : Number,
			required : true
		}
	},
	spots : [{
		status : {
			enum : ["has_bike", "free", "out_of_order"]
		}
	}]
});

StationSchema.set("autoIndex", getConfig("autoIndex"));
StationSchema.index({"spots.status" : 1});
StationSchema.index({station_id : 1}, {unique : true})

module.exports = StationSchema;