const CustomError = require("./CustomError");

class SignupError extends CustomError {

	constructor(code, message) {
		super("SignupError");
		this.code = code;
		this.message = message;
		this.status = this.getStatus();
	}

	getStatus() {
		return 400;
	}
}

SignupError.USERNAME_EXISTS = "SU1"; // user with username already exists
SignupError.EMAIL_EXISTS = "SU2"; // user with email already exists
SignupError.MOBILE_EXISTS = "SU3"; // user with mobile already exists

module.exports = SignupError;