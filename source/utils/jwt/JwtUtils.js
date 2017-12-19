const jwt = require("jsonwebtoken");
const stringing = require("stringing");
const ConfigSource = require("../../config/ConfigSource");
const Config = require("../../config/Config");

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
        role : user.role,
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

module.exports = {generateToken}