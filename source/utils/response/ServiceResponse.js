const {Response} = require("express");
const Logger = require("../logger/Logger");

const logger = Logger.createLogger(module);

class ServiceResponse {

    constructor(response, success) {
        this.originalResponse = response;

        this.success = true;
        this.status = 200;
        this.outcome = null;

        if (success != null) {
            this.success = success;
        }
    }

    setStatus(status) {
        this.status = status;
    }

    setOutcome(data) {
        this.outcome = data;
    }

    send() {
        if (this.originalResponse) {
            let responseData = {
                success : this.success
            };

            if (this.outcome != null) {
                responseData.data = this.outcome;
            }

            this.originalResponse.status(this.status);
            this.originalResponse.json(responseData);

            this.clear();
        } 
        else {
            logger.warn("ServiceResponse closed, you have already sent response.");
        }
    }

    clear() {
        this.originalResponse = null;
        this.outcome = null;
    }
}

module.exports = ServiceResponse;