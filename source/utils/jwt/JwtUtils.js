const jwt = require("jsonwebtoken");
const stringing = require("stringing");
const ConfigSource = require("../../config/ConfigSource");
const Config = require("../../config/Config");
const HetsoDbManager = require("../../db/HetsoDbManager");
const TokenError = require("../../errors/TokenError");

const algorithm = "HS256";
const tokenType = "Bearer";


const getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.AUTH);

const exp = getConfig("jwt_expire");
const secret = stringing.generate(getConfig("secret:length"));

function generateToken(user_id, user, loginRequest, callback) {
    let requestedProfileInfo = {};
    let jwtPayload = {};
    let jwtOptions = {
        algorithm : algorithm,
        audience : "hetso",
        subject : user_id,
        expiresIn : exp,
        issuer : "hetso"
    };

    if (loginRequest.scope) {
        for (let scopeValue of loginRequest.scope) {
            if (user.hasOwnProperty(scopeValue)) {
                jwtPayload[scopeValue] = user[scopeValue];
            }
        }
    }

    if (loginRequest.profile && loginRequest.profile.length > 0) {
        requestedProfileInfo = {};

        for (let profileValue of loginRequest.profile) {
            requestedProfileInfo[profileValue] = user[profileValue];
        }
    }

    jwt.sign(jwtPayload, secret, jwtOptions, (err, token) =>
    {
        if (err) {
            callback(err);
        } 
        else {
            let tokenData = {
                type : tokenType,
                token : token,
            };

            if (requestedProfileInfo) {
                tokenData.profile = requestedProfileInfo;
            }

            callback(null, tokenData);
        }
    });
}

function verifyToken(token, callback) {
    const jwtDecodeOptions = {
        algorithms : [algorithm],
        ignoreExpiration : false,
        ignoreNotBefore : false
    };

    const payload = jwt.decode(token, {complete : true});

    jwt.verify(token, secret, jwtDecodeOptions, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                callback(new TokenError(TokenError.EXPIRED, "token expired."));
            }
            else if (err.name === "JsonWebTokenError") {
                callback(new TokenError(TokenError.INVALID, "token invalid data."));
            }
            else {
                callback(new TokenError(TokenError.INVALID, "token invalid data."));
            }
        }
        else {
            UserModel = HetsoDbManager.getInstance().userModel;
            UserModel.findOne({user_id : decoded.sub}).then((userData) => {
                callback(null, userData, payload);
            }, callback);
        }
    });
}

module.exports = {generateToken, verifyToken}