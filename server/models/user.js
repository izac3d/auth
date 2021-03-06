const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_I = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }, 
    token: {
        type: String
    }
});

userSchema.pre('save', function(next){
    var user = this;

    if (user.isModified('password')) {
        
        bcrypt.genSalt(SALT_I, (err, salt)=>{
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

userSchema.methods.genToken = function(cb){
    var token = jwt.sign(this._id.toHexString(), 'secret statement');

    this.token = token;
    this.save(function(err, user){
        if (err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    const user = this;
    jwt.verify(token, 'secret statement', function(err, decoded){

        user.findOne({'_id': decoded, 'token': token}, function(err, user){
            if (err) return cb(err);
            cb(null, user);
        })

    });
    
}

const User = mongoose.model('User', userSchema);

module.exports = {User}