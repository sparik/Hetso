const CustomRouter = require("../../../../utils/router/CustomRouter");
const CommonMiddleware = require("../../../../utils/router/CommonMiddleware");
const SignupTask = require("./task/SignupTask");
const LoginTask = require("./task/LoginTask");
const ServiceResponse = require("../../../../utils/response/ServiceResponse");
const HttpMethods = require("../../../../utils/http/HttpMethods");

class StandardAuthRouter extends CustomRouter {
	constructor() {
		super();

		this.route("/signup")
			.all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.POST]))
			.post(this.signupUser, this.loginUser);

		this.route("/login")
			.all(CommonMiddleware.getInstance().supportedHttpMethods([HttpMethods.POST]))
			.post(this.loginUser);
	}

	signupUser(req, res, next) {
        const task = new SignupTask(next);

        task.onReady((data) => {
            if (data.autoLogin === true) {
                next();
                task.clear();
            }
            else {
                const response = new ServiceResponse(res);
                response.setOutcome(data);
                response.send();
                task.clear();
            }
        });

        task.trySignup(req.body);
    };

    loginUser(req, res, next) {
    	const task = new LoginTask(next);

    	task.onReady((data) => {
			const response = new ServiceResponse(res);
			response.setOutcome(data);
            response.send();
            task.clear();
    	});

    	task.tryLogin(req.body);
    }
}

module.exports = StandardAuthRouter;