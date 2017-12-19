const CustomRouter = require("../../../../utils/router/CustomRouter");
const CommonMiddleware = require("../../../../utils/router/CommonMiddleware");
const ServiceResponse = require("../../../../utils/response/ServiceResponse");
const HttpMethods = require("../../../../utils/http/HttpMethods");
const UserRoles = require("../../../../utils/roles/Roles");
const RideTask = require("./task/RideTask");

class RideRouter extends CustomRouter {
    constructor() {
        super();

        this.route("/")
            .all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.POST]))
            .post(this.addRide);

        this.route("/:rideId")
            .all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.GET, HttpMethods.PUT]))
            .get(this.getRide)
            .put(this.endRide);

        this.router.param("rideId", this.rideIdParamHandler);
    }

    rideIdParamHandler(req, res, next, rideId) {
        const task = new RideTask(next);

        task.onReady((ride) => {
            req.ride = ride;
            next();

            task.clear();
        });

        task.getRide(rideId);
    }

    getRide(req, res, next) {
        const response = new ServiceResponse(res);

        response.setOutcome(req.ride);
        response.send();
    }

    endRide(req, res, next) {
        const task = new RideTask(next);

        task.onReady((data) => {
            const response = new ServiceResponse(res);
            response.setOutcome(data);
            response.send();
        });

        task.endRide(req.ride.ride_id, req.body);
    }

    addRide(req, res, next) {
        const task = new RideTask(next);

        task.onReady((data) => {
            const response = new ServiceResponse(res);
            response.setOutcome(data);
            response.send();
        })

        task.addRide(req.body);
    }
}

module.exports = RideRouter;