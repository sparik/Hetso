const mongoose = require("mongoose");
const ConfigSource = require("../../../config/ConfigSource");
const Config = require("../../../config/Config");
const bcrypt = require("bcryptjs");
const Roles = require("../../../utils/roles/Roles");

const getConfig = Config.getInstance().accessPointConfigsFromSource(ConfigSource.HETSO_DB);

const UserSchema = new mongoose.Schema({
	user_id : {
		type : String,
		required : true
	},
	username : {
		type : String,
		required : true
	},
	password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String
    },
    mobile : {
        type : String
    },
    role : {
        type : String,
        required : true,
        enum : [Roles.ADMIN, Roles.USER, Roles.TECH],
        default : Roles.USER
    }
});

UserSchema.pre('validate', function(next) {
    var user = this;

    if (user.isNew && user.user_id == null)
    {
        user.user_id = `auth|${user.id}`;
    }

    next();
});


UserSchema.pre('validate', function(next) {
    var user = this;

    if (!user.isModified('password')) {
		next();
		return;
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
        	next(err);
        	return;
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
            	next(err);
            	return;
            }

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	var user = this;

    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) {
        	cb(err);
        	return;
        }
        cb(null, isMatch);
    });
};

UserSchema.set("autoIndex", getConfig("autoIndex"));
UserSchema.index({user_id : 1}, {unique : true});
UserSchema.index({username : 1}, {unique : true});
UserSchema.index({email : 1});
UserSchema.index({mobile : 1});


module.exports = UserSchema;

