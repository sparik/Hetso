const CustomRouter = require("../../../utils/router/CustomRouter");
const StandardAuthRouter = require("./standard/StandardAuthRouter");

class AuthRouter extends CustomRouter {
	constructor() {
		super();

		this.use("/standard", new StandardAuthRouter());
	}
}

module.exports = AuthRouter;