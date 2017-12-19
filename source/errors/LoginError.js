const CustomError = require("./CustomError");

class LoginError extends CustomError {
	constructor(code, message) {
		super("LoginError");
		this.code = code;
		this.message = message;
		this.status = this.getStatus();
	}

	getStatus() {
		return 400;
	}
}

LoginError.FAILED = "L1"; // wrong username or password

module.exports = LoginError;