const express = require("express");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
const Config = require("../config/Config");
const ConfigSource = require("../config/ConfigSource");
const setupRoutes = require("./setupRoutes");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const http = require("http");
const https = require("https");
const Logger = require("../utils/logger/Logger");


const logger = Logger.createLogger(module);


class HetsoHttpServer extends EventEmitter {

	constructor(enforce) {
		super();

		if (enforce != Enforce) {
			throw new Error("Error: Instantiation failed: Use HetsoHttpServer.getInstance() instead of new.");
		}

		this.getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.SERVER);
	}

	static getInstance() {
		if (HetsoHttpServer.instance == null) {
			HetsoHttpServer.instance = new HetsoHttpServer(Enforce);
		}
		return HetsoHttpServer.instance;
	}

	start() {
		if (this.app == null) {
			this.app = express();
			this.app.use(bodyParser.json());
			this.app.use(bodyParser.urlencoded({extended : true}));
            this.app.use(helmet());

			setupRoutes(this);

			if (this.getConfig("ssl:enabled")) {
                const options = {
                    key : fs.readFileSync(path.join(__dirname, "../", "../", "../", this.getConfig("ssl:key")), "utf8"),
                    cert : fs.readFileSync(path.join(__dirname, "../", "../", "../", this.getConfig("ssl:cert")), "utf8"),
                };

                this.server = https.createServer(options, this.app);
            } 
            else {
                this.server = https.createServer(this.app);
            }

            this.app.listen(this.getConfig("port"), (err) => {
            	if (err) {
		            logger.error("error", err);
		            this.emit("error", err);
		        } 
		        else {
		            logger.info("ready");
		            this.emit("ready");
		        }
            });
		}
		else {
			throw new Error("You can call 'start' function only once.");
		}
	}

	useRouter(path, router) {
        this.app.use(path, router.getRouter());
        return this;
    }

    useMiddleware(middleware) {
        this.app.use(middleware);
        return this;
    }

    useRouteMiddleware(path, middleware) {
        this.app.use(path, middleware);
        return this;
    }
}
function Enforce() {
}

module.exports = HetsoHttpServer;