// 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var testimonySchema = new Schema({
// define the schema for our testimony model

    user : {type: Schema.Types.ObjectId, ref: 'User'},

    content           : {
        user_name : {type: String},
        body	  : {type: String},
        date	  : {type: String}
    }
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);


// create the model for testimonies and expose it to our app
module.exports = mongoose.model('Testimony', testimonySchema);
