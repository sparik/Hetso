const stationData = require("./stations.json");
const HetsoDbManager = require("../source/db/HetsoDbManager");
const HetsoHttpServer = require("../source/service/HetsoHttpServer");
const userData = require("./users.json");
const async = require("async");
const Logger = require("../source/utils/logger/Logger");

const logger = Logger.createLogger(module);



async.eachSeries([
    HetsoDbManager.getInstance()
    //HetsoHttpServer.getInstance()
], (item, callback) => {

    item.addListener("ready", () => {
        callback(null);
        item.removeAllListeners();
    });

    item.addListener("error", (error) => {
        callback(error);
        item.removeAllListeners();
    });

    item.start();
}, (err) => {
    if (err) {
        logger.error("Cannot init: ", err);
    }
    else {
        async.series([removeStations, initStations, removeBikes, initBikes, removeUsers, initUsers], (err) => {
            if (err) {
                logger.error("Cannot init: ", err);
            }
            else {
                logger.info("Successfully initialized");
                HetsoDbManager.getInstance().stop();
            }
        })
    }
});

function initStations(cb) {
    async.each(stationData, (item, callback) => {
        let station = {
            station_id : item.id,
            spots : [],
            location : {
                lat : item.coords.latitude,
                long : item.coords.longitude
            }
        };

        for (let i = 0; i < item.lotsTotal; ++i) {
            station.spots.push({
                status : "free"
            });
        }

        HetsoDbManager.getInstance().stationModel.create(station, callback);
    }, cb);
}

function removeStations(callback) {
    HetsoDbManager.getInstance().stationModel.remove(null, callback);
}

function removeBikes(callback) {
    HetsoDbManager.getInstance().bikeModel.remove(null, callback);
}

function initBikes(cb) {
    async.times(300, (n, callback) => {
        let bike = {
            status : "out_of_order"
        };

        HetsoDbManager.getInstance().bikeModel.create(bike, callback);
    }, cb);
}

function removeUsers(callback) {
    HetsoDbManager.getInstance().userModel.remove(null, callback);
}

function initUsers(cb) {
    async.each(userData, (item, callback) => {
        HetsoDbManager.getInstance().userModel.create(item, callback);
    }, cb);
}