const CustomError = require("./CustomError");

class PageNotFound extends CustomError {

	constructor(path) {
		super("PageNotFound");
		this.message = `page '${path}' not found.`;
		this.status = this.getStatus();
	}

	getStatus() {
		return 404;
	}
}

module.exports = PageNotFound;