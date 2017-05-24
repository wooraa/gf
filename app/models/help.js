// 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var helpSchema = new Schema({
// define the schema for our account model

    user : {type: Schema.Types.ObjectId, ref: 'User'},

    content           : {
        subject	  : {type: String},
        user_name : {type: String},
        body	  : {type: String}
    }
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);


// create the model for helps and expose it to our app
module.exports = mongoose.model('Help', helpSchema);
