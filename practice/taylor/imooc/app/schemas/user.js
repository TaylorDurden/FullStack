/**
 * Created by taylor on 26/12/16.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods = {
  comparePassword: function(_password, cb) {
      // this.password => 数据库的实体的passwweord
      bcrypt.compare(_password, this.password, function(err, isMatch) {
          if (err) {
              return cb(err);
          }

          cb(null, isMatch);
      });
  }
};

//静态方法
UserSchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort('meta.updateAt').exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({_id: id}).exec(callback);
    }
};

module.exports = UserSchema;