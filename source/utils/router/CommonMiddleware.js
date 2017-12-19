const CustomRouter = require("./CustomRouter");
const Config = require("../../config/Config");
const ConfigSource = require("../../config/ConfigSource");
const HttpError = require("../../errors/HttpError");
const PageNotFound = require("../../errors/PageNotFound");
const {verifyToken} = require("../jwt/JwtUtils");
const TokenError = require("../../errors/TokenError");
const PermissionError = require("../../errors/PermissionError");
const UserRoles = require("../roles/Roles");

class CommonMiddleware extends CustomRouter {

	constructor(enforce) {
		super();

		if (enforce != Enforce) {
			throw new Error("Error: Instantiation failed: can not use new.");
		}
	}

	static getInstance() {
		if (CommonMiddleware.instance == null) {
			CommonMiddleware.instance = new CommonMiddleware(Enforce);
		}
		return CommonMiddleware.instance;
	}

	error404Handler(req, res, next) {
        next(new PageNotFound(req.path));
    };

    errorPageHandler(err, req, res, next) {
        let resStatus = err["status"] || 500;
        let errorResponse = {success : false};

        if (CommonMiddleware.debugMode && err.stack) {
            errorResponse.errors = [{code : err["code"], name : err.name, message : err.message, stack : err.stack}];
        } 
        else {
            errorResponse.errors = [{code : err["code"], name : err.name, message : err.message}];
        }

        if (err["data"])
        {
            errorResponse["data"] = err["data"];
        }

        res.status(resStatus);
        res.json(errorResponse);
    };

    verifyJWTToken() {
        return (req, res, next) => {
            const token = req.headers["authorization"];

            if (token == undefined) {
                next(new TokenError(TokenError.NOT_PROVIDED, "token not provided"));
                return;
            }

            verifyToken(token, (err, userData, payload) => {
                if (err) {
                    next(err);
                    return;
                }
                req.user = userData;
                req.jwtPayload = payload;
                next();
            });
        };
    }

    onlyAdminRoute() {
        return (req, res, next) => {
            if (req.user.role != UserRoles.ADMIN) {
                next(new PermissionError(PermissionError.UNAUTHORIZED));
            }
            else {
                next();
            }
        }
    }

    supportedHttpMethods(methods) {
        return (req, res, next) => {
            if (methods.indexOf(req.method) > -1) {
                next();
            } 
            else {
                next(new HttpError(HttpError.NOT_SUPPORTED_METHODS, `Endpoint does not support http '${req.method}' method.`));
            }
        };
    }
}

CommonMiddleware.debugMode = Config.getInstance().accessPointConfigsFromSource(ConfigSource.SERVER)("debug");

function Enforce() {
}

module.exports = CommonMiddleware;