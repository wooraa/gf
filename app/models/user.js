// load the things we need for our user profile
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    account          : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    local            : {
        email        : {type: String, lowercase: true},
        password     : String,
        location     : String
    }
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
