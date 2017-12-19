const CustomError = require("./CustomError");

class ValidationError extends CustomError {
	constructor(code, message) {
		super("ValidationError");
		this.message = message;
		this.code = code;
		this.status = this.getStatus();
	}

	getStatus() {
		return 400;
	}
}

ValidationError.INPUT = "V1"; // Input data validation error
ValidationError.OUTPUT = "V2"; // Output data validation error

module.exports = ValidationError;