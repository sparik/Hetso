const CustomTask = require("../../../../../utils/task/CustomTask");
const HetsoDbManager = require("../../../../../db/HetsoDbManager");
const StandardAuthValidator = require("../validator/StandardAuthValidator");
const async = require("async");
const SignupError = require("../../../../../errors/SignupError");


class SignupTask extends CustomTask {

	constructor(errorCallback) {
		super(errorCallback);

		this.UserModel = HetsoDbManager.getInstance().userModel;
	}

	trySignup(signupData) {
		StandardAuthValidator.signupUserValidate(signupData, (error, validSignupData) => {
			if (error) {
				this.validationError(error, true);
			}
			else {

				this.checkDuplications(signupData, (err) => {
					if (err) {
						return this.nativeError(err);
					}
					this.signup(signupData, signupData.auto_login === true);
				});
			}
		});
	}

	checkDuplications(signupData, cb) {
		async.parallel([
            (callback) => {
                if (signupData.username) {
                    this.UserModel.findOne({username : signupData.username}, (err, item) =>
                    {
                        if (err) {
                            callback(err);
                        } 
                        else if (item) {
                            callback(new SignupError(SignupError.USERNAME_EXISTS, `User with '${signupData.username}' username already exists.`));
                        } 
                        else {
                            callback(null);
                        }
                    });
                } 
                else {
                    callback(null);
                }
            },
            (callback) => {
                if (signupData.email) {
                    this.UserModel.findOne({email : signupData.email}, (err, item) =>
                    {
                        if (err) {
                            callback(err);
                        } 
                        else if (item) {
                            callback(new SignupError(SignupError.EMAIL_EXISTS, `User with '${signupData.email}' email already exists.`));
                        } 
                        else {
                            callback(null);
                        }
                    });
                } 
                else {
                    callback(null);
                }
            },
            (callback) => {
                if (signupData.mobile) {
                    this._UserModel.findOne({mobile : signupData.mobile}, (err, item) => {
                        if (err) {
                            callback(err);
                        } 
                        else if (item) {
                            callback(new SignupError(SignupError.MOBILE_EXISTS, `User with '${signupData.mobile}' mobile already exists.`));
                        } 
                        else {
                            callback(null);
                        }
                    });
                } else
                {
                    callback(null);
                }
            }
        ], 
        (err) =>
        {
            cb(err);
        });
	}

	signup(userData, auto_login) {
		this.UserModel.create(userData).then((userData) => {

			this.validateAndReturnData(userData);
			
		}, this.nativeError);
	}

	validateAndReturnData(data) {
		if (data == null) {
			this.ready(data);
		}
		else {
			StandardAuthValidator.outputUserValidate(data, (err, validData) => {
				if (err) {
					this.validationError(err, false);
				}
				else {
					this.ready(validData);
				}
			})
		}
	}
}

module.exports = SignupTask;