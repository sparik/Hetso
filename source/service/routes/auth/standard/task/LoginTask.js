const CustomTask = require("../../../../../utils/task/CustomTask");
const HetsoDbManager = require("../../../../../db/HetsoDbManager");
const StandardAuthValidator = require("../validator/StandardAuthValidator");
const async = require("async");
const LoginError = require("../../../../../errors/LoginError");
const {generateToken} = require("../../../../../utils/jwt/JwtUtils");
const ConfigSource = require("../../../../../config/ConfigSource");
const Config = require("../../../../../config/Config");



class LoginTask extends CustomTask {

	constructor(errorCallback) {
		super(errorCallback);

		this.UserModel = HetsoDbManager.getInstance().userModel;
	}

	tryLogin(loginData, ip) {

        StandardAuthValidator.loginUserValidate(loginData, (error, validLoginData) =>
        {
            if (error) {
                this.validationError(error, true);
            } 
            else {
                this.checkUserPass(validLoginData);
            }
        });
    }

    checkUserPass(loginData) {
    	this.UserModel.findOne({username : loginData.username}, (err, userData) => {
    		if (err) {
    			return this.nativeError(err);
    		}
    		if (userData == null) {
    			return this.nativeError(new LoginError(LoginError.FAILED, "Wrong username or password."));
    		}
    		userData.comparePassword(loginData.password, (err, isMatch) => {
    			if (err) {
    				return this.nativeError(new LoginError(LoginError.FAILED, "Wrong username or password."));
    			}
    			this.generateJwtToken(loginData, userData);
    		});
    	})
    }

    generateJwtToken(loginData, userData) {
    	generateToken(userData.user_id, userData, loginData, (err, tokenData) => {
    		if (err) {
    			return this.nativeError(err);
    		}

    		this.ready(tokenData);
    	})
    }
}

module.exports = LoginTask;