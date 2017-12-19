const CustomRouter = require("../../../../utils/router/CustomRouter");
const CommonMiddleware = require("../../../../utils/router/CommonMiddleware");
const ServiceResponse = require("../../../../utils/response/ServiceResponse");
const HttpMethods = require("../../../../utils/http/HttpMethods");
const UserRoles = require("../../../../utils/roles/Roles");
const StationTask = require("./task/StationTask");

class StationRouter extends CustomRouter {
    constructor() {
        super();

        this.route("/")
            .all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.POST]))
            .post(this.addStation);

        this.route("/:stationId")
            .all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.GET, HttpMethods.PUT]))
            .get(this.getStation)
            .put(this.updateStation);

        this.router.param("stationId", this.stationIdParamHandler);
    }

    stationIdParamHandler(req, res, next, stationId) {
        const task = new StationTask(next);

        task.onReady((station) => {
            req.station = station;
            next();

            task.clear();
        });

        task.getStation(stationId);
    }

    getStation(req, res, next) {
        const response = new ServiceResponse(res);

        response.setOutcome(req.station);
        response.send();
    }

    updateStation(req, res, next) {
        const task = new StationTask(next);

        task.onReady((data) => {
            const response = new ServiceResponse(res);
            response.setOutcome(data);
            response.send();
        });

        task.updateStation(req.station.station_id, req.body);
    }

    addStation(req, res, next) {
        const task = new StationTask(next);

        task.onReady((data) => {
            const response = new ServiceResponse(res);
            response.setOutcome(data);
            response.send();
        })

        task.addStation(req.body);
    }
}

module.exports = StationRouter;