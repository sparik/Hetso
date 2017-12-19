const CustomRouter = require("../../../utils/router/CustomRouter");
const BikeRouter = require("./bike/BikeRouter");

class ApiRouter extends CustomRouter {
	constructor() {
		super();

		this.route("/bike", new BikeRouter());
	}
}

module.exports = ApiRouter;