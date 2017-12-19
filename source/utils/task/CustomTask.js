const EventEmitter = require("events");
const ValidationError = require("../../errors/ValidationError");

class CustomTask extends EventEmitter {
	constructor(errorCallback) {
		super();

		if (errorCallback) {
			this.errorCallback = errorCallback;
			this.onError(this.defaultErrorHandler);
		}

		this.ready = (data) => {
            this.emit("ready", data);
        };
        this.nativeError = (error) => {
            this.emit("error", error);
        };
        this.validationError = (error, fromInput) => {
            this.emit("error", new ValidationError(fromInput ? ValidationError.INPUT : ValidationError.OUTPUT, error.message));
        };
	}

	clear() {
        this.emit("preDestroy");
        this.errorCallback = null;
        this.removeAllListeners();
    }

    onReady(callback) {
        this.addListener("ready", callback);
    }

    onError(callback) {
        this.addListener("error", callback);
    }

    onPreDestroy(callback) {
        this.addListener("preDestroy", callback);
    }

    defaultErrorHandler(err) {
        this.errorCallback(err);
        this.clear();
    }
}

module.exports = CustomTask;