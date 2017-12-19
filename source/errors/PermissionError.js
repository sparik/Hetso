const CustomError = require("./CustomError");

class PermissionError extends CustomError {
    constructor(code, message) {
        super("PermissionError");
        this.code = code;
        this.message = message;
        this.status = this.getStatus();
    }

    getStatus() {
        return 401
    }
}

PermissionError.UNAUTHORIZED = "No permission to access this resource";

module.exports = PermissionError;