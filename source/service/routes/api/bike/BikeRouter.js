const CustomRouter = require("../../../../utils/router/CustomRouter");
const CommonMiddleware = require("../../../../utils/router/CommonMiddleware");
const ServiceResponse = require("../../../../utils/response/ServiceResponse");
const HttpMethods = require("../../../../utils/http/HttpMethods");
const UserRoles = require("../../../../utils/roles/Roles");
const BikeTask = require("./task/BikeTask");

class BikeRouter extends CustomRouter {
	constructor() {
		super();

		this.route("/")
			.all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.POST]),
				CommonMiddleware.getInstance().verifyJWTToken(),
				CommonMiddleware.getInstance().onlyAdminRoute())
			.post(this.addBike);

		this.route("/:bikeId")
			.all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.GET, HttpMethods.PUT]))
			.get(this.getBike)
			.put(CommonMiddleware.getInstance().verifyJWTToken(),
				CommonMiddleware.getInstance().onlyAdminRoute(),
				this.updateBike);

		this.router.param("bikeId", this.bikeIdParamHandler);
	}

	bikeIdParamHandler(req, res, next, bikeId) {
		const task = new BikeTask(next);

		task.onReady((data) => {
			req.bike = data;
			next();

			task.clear();
		});

		task.getBike(bikeId);
	}

	getBike(req, res, next) {
        const response = new ServiceResponse(res);
        response.setOutcome(req.bike);
        response.send();
	}

	addBike(req, res, next) {
		const task = new BikeTask(next);

		task.onReady((data) => {
			const response = new ServiceResponse(res);
			response.setOutcome(data);
			response.send();


			task.clear();
		});

		task.addBike(req.body);
	}

	updateBike(req, res, next) {
		const task = new BikeTask(next);

		task.onReady((data) => {
            const response = new ServiceResponse(res);
			response.setOutcome(data);
			response.send();

			task.clear();
		});

		task.updateBike(req.bike.bike_id, req.body);
	}

}

module.exports = BikeRouter;