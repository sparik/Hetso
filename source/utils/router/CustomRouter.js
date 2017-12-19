const express = require("express");


class CustomRouter {
	constructor() {
		this.router = express.Router();
	}

	getRouter() {
		return this.router;
	}

	use(path, router) {
		this.router.use(path, router.getRouter());
	}

	useMiddleware(middleware) {
		this.router.use(middleware);
	}

	route(path) {
		return this.router.route(path);
	}
}

module.exports = CustomRouter;