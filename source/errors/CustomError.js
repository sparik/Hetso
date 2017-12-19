class CustomError extends Error {
	constructor(name, data) {
		super();
		this.name = name;

		if (data) {
			this.data = data;
		}

		Error.captureStackTrace(this, this.constructor);
	}

	getStatus() {
		return 400;
	}
}

module.exports = CustomError