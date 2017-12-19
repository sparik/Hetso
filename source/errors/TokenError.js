const CustomError = require("./CustomError");

class TokenError extends CustomError {
    constructor(code, message) {
        super("TokenError");
        this.code = code;
        this.message = message;
        this.status = this.getStatus();
    }

    getStatus() {
        return 401
    }
}

TokenError.NOT_PROVIDED = "No JWT token provided";
TokenError.EXPIRED = "JWT token expired";
TokenError.INVALID = "JWT token is invalid";

module.exports = TokenError;