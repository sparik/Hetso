"use strict";
const path = require("path");
const fs = require("fs");
const winston = require("winston");
const FileLogRotate = require("winston-daily-rotate-file");

const WinstonLogger = winston.Logger;
const WinstonTransports = winston.transports;

const logsFolder = path.join(__dirname, "..", "..", "logs");


initLogger();

class Logger {
	static createLogger(module, outputFile) {
		let transport;
        let fileLabel = module.filename.split(path.sep).slice(-2).join(path.sep);
        let logLevel = "debug";

        if (outputFile != null) {
            transport = new FileLogRotate({
                level : logLevel,
                label : fileLabel,
                filename : path.join(logsFolder, outputFile),
                json : true,
                timestamp : true
            });
        } 
        else {
            transport = new WinstonTransports.Console({
                colorize : true,
                level : logLevel,
                label : fileLabel,
                timestamp : true
            });
        }

        return new WinstonLogger({transports : [transport]});
	}
}


function initLogger() {
    if (!fs.existsSync(logsFolder)) {
        fs.mkdirSync(logsFolder);
    }

    let fileLogger = new WinstonTransports.File({filename : path.join(logsFolder, "unhandleExceptions.log")});
    let consoleLogger = new WinstonTransports.Console({
        colorize : true,
        level : "debug",
        label : module.filename.split(path.sep).slice(-2).join(path.sep),
        timestamp : true
    });

    let winstonLogger = new WinstonLogger({transports : [fileLogger, consoleLogger]});

    process.on("uncaughtException", (err) => {
        if (err.stack) {
            winstonLogger.error(err.stack);
        } 
        else {
            winstonLogger.error("uncaughtException, no stack trace available");
        }
    });
}


module.exports = Logger