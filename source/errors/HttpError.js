const CustomError = require("./CustomError");

class HttpError extends CustomError {

	constructor(code, message) {
		super("HttpError");
		this.code = code;
		this.message = message;
		this.status = this.getStatus();
	}

	getStatus() {
		return 400;
	}
}

HttpError.UNSUPPORTED_METHOD = "H1";

module.exports = HttpError;