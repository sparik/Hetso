const CustomRouter = require("../../../../utils/router/CustomRouter");
const CommonMiddleware = require("../../../../utils/router/CommonMiddleware");
const ServiceResponse = require("../../../../utils/response/ServiceResponse");
const HttpMethods = require("../../../../utils/http/HttpMethods");
const UserRoles = require("../../../../utils/roles/Roles");

class BikeRouter extends CustomRouter {
	constructor() {
		super();

		this.route("/")
			.all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.POST]))
			.post(this.addBike);
	}

	addBike(req, res, next) {
		const task = new BikeTask();

		task.onReady((data) => {
			const response = new ServiceResponse(res);
			response.setOutcome(data);
			response.send();

			task.clear();
		});

		task.addBike(req.body);
	}

}

module.exports = BikeRouter;