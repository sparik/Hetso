"use strict";
const path = require("path");
const nconf = require("nconf");
const ConfigSource = require("./ConfigSource");
const Logger = require("../utils/logger/Logger");

const logger = Logger.createLogger(module);

class Config {
	constructor(enforce) {
		if (enforce != Enforce) {
			throw new Error("Error: Instantiation failed: Use Config.getInstance() instead of new.");
		}

		const configsFolder = path.join(__dirname, "..", "..", "configs");

		nconf.env();
		nconf.argv();

		nconf.file(ConfigSource.SERVER, {file : path.join(configsFolder, "server.json")});
        nconf.file(ConfigSource.HETSO_DB, {file : path.join(configsFolder, "hetso-db.json")});
        nconf.file(ConfigSource.AUTH, {file : path.join(configsFolder, "auth.json")});
	}

	static getInstance() {
		if (Config.instance == null) {
			Config.instance = new Config(Enforce);
		}
		return Config.instance;
	}

	getConfigFromSource(source, key)
    {
        let retValue;

        if (nconf.stores[source])
        {
            retValue = nconf.stores[source].get(key);
        } else
        {
            retValue = nconf.get(key);
        }

        if (retValue == null)
        {
            logger.warn(`'null' or 'undefined' value for '${key}' configuration from '${source}' source.`);
        }

        return retValue;
    }

    getConfig(key) {
        let retValue = nconf.get(key);
        if (retValue == null) {
            logger.warn(`'null' or 'undefined' value for '${key}' configuration.`);
        }

        return retValue;
    }

    accessPointConfigsFromSource(source) {
        return (key) => {
            return Config.getInstance().getConfigFromSource(source, key);
        };
    }
}

function Enforce(){
}

module.exports = Config;