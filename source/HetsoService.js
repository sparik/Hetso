const async = require("async");
const Logger = require("./utils/logger/Logger");
const HetsoDbManager = require("./db/HetsoDbManager");
const HetsoHttpServer = require("./service/HetsoHttpServer");

const logger = Logger.createLogger(module);

logger.info(`Running process id '${ process.pid}'`);

async.eachSeries([
	HetsoDbManager.getInstance(),
	HetsoHttpServer.getInstance()
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
        logger.error("Hetso service could not be started: ", err);
    }
    else {
        logger.info("Hetso service running");
    }
});