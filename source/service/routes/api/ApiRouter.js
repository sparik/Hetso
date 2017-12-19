const CustomRouter = require("../../../utils/router/CustomRouter");
const BikeRouter = require("./bike/BikeRouter");
const StationRouter = require("./station/StationRouter");
const RideRouter = require("./ride/RideRouter");

class ApiRouter extends CustomRouter {
	constructor() {
		super();

		this.use("/bike", new BikeRouter());
		this.use("/station", new StationRouter());
		this.use("/ride", new RideRouter());
	}
}

module.exports = ApiRouter;