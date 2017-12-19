"use strict";
const EventEmitter = require("events");
const Config = require("../config/Config");
const ConfigSource = require("../config/ConfigSource");
const Logger = require("../utils/logger/Logger");
const mongoose = require("mongoose");
const BikeSchema = require("./schema/bike/BikeSchema");
const StationSchema = require("./schema/station/StationSchema");
const UserSchema = require("./schema/user/UserSchema");
const RideSchema = require("./schema/ride/RideSchema");


const logger = Logger.createLogger(module);

class HetsoDbManager extends EventEmitter {
	constructor(enforce) {
		super();

		if (enforce != Enforce) {
			throw new Error("Error: Instantiation failed: Use SmsDbManager.getInstance() instead of new.");
		}

		this.getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.HETSO_DB);
	}

	static getInstance() {
		if (HetsoDbManager.instance == null) {
			HetsoDbManager.instance = new HetsoDbManager(Enforce);
		}
		return HetsoDbManager.instance;
	}

	start() {
		if (this.mongoConnection == null) {
			this.mongoConnection = mongoose.createConnection(this.getConfig("uri"), this.getConfig("options"));
			this.mongoConnection.addListener("connected", () => {
				logger.info("ready");
				this.emit("ready");
			});

			this.mongoConnection.addListener("error", (error) => {
				logger.error("error", error);
				this.emit("error", error);
			});

			this.mongoConnection.addListener("disconnected", () => {
				logger.error("disconnect");
				this.emit("disconnect");
			});


			this.bikeModel = this.mongoConnection.model("Bike", BikeSchema, this.getConfig("collections:bikes"));
			this.stationModel = this.mongoConnection.model("Station", StationSchema, this.getConfig("collections:stations"));
			this.userModel = this.mongoConnection.model("User", UserSchema, this.getConfig("collections:users"));
			this.rideModel = this.mongoConnection.model("Ride", RideSchema, this.getConfig("collections:rides"));
		}
		else {
			throw new Error("You can call 'start' function only once.");
		}
	}
}

function Enforce() {
}

module.exports = HetsoDbManager;