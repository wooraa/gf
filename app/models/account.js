// load the things we need for our account details (bank details, contact details) profile
// name (bank name) should be an array of Nigerian Banks
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var accountSchema = new Schema({
// define the schema for our account model

    user : {type: Schema.Types.ObjectId, ref: 'User'},

    details           : {
        bank_name     : {type: String},
        account_name  : {type: String},
        account_number: {type: String},
        phone_number  : {type: String},
        account_email : {type: String, lowercase: true},
        user_name     : {type: String},
        referrer      : {type: String}, //user-name
        comment       : {type: String},
        date_modified : {type: String},
        message       : {type: String},
        msg_1         : {type: String},
        msg_2         : {type: String},
        msg_3         : {type: String},
        note          : {type: String}
    },

    upline            : {
        bank_name     : {type: String},
        account_name  : {type: String},
        account_number: {type: String},
        phone_number  : {type: String},
        user_name     : {type: String},
        plan          : {type: String},
        time          : {type: String},
        confirmed     : {type: Boolean, default: false},
        when          : {type: String},
        message       : {type: String},
        msg_1         : {type: String},
        msg_2         : {type: String},
        msg_3         : {type: String},
        note          : {type: String}
    },

    downline          : {
        bank_name     : {type: String},
        account_name  : {type: String},
        account_number: {type: String},
        phone_number  : {type: String},
        user_name     : {type: String},
        plan          : {type: String},
        time          : {type: String},
        confirmed     : {type: Boolean, default: false},
        when          : {type: String},
        message       : {type: String},
        msg_1         : {type: String},
        msg_2         : {type: String},
        msg_3         : {type: String},
        note          : {type: String}
    }
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);


// create the model for accounts and expose it to our app
module.exports = mongoose.model('Account', accountSchema);

// Access Bank, First Bank, Fidelity Bank, Zenith, Diamond, UBA, Eco, Skye, GTB, FCMB, Wema, Stanbic, Sterlin, Union,
// STD CHARTD, keystone, Heritage, Aso, Enterprise, Jaiz, Suntrust, Jubilee, Citi, Fin, Mainstreet
// array sample= var parentSchema = new Schema({ children: [childSchema] });
//
// bank : {type: String, required: true,
//        enum: ['Access Bank', 'First Bank', 'Fidelity Bank', 'Zenith Bank',
//        'Diamond Bank', 'UBA', 'Eco Bank', 'Skye Bank', 'GT Bank',
//        'FCMB', 'Wema Bank', 'Stanbic IBTC Bank', 'Sterlin Bank', 'Union Bank',
//        'Standard Chartered Bank', 'keystone Bank', 'Heritage Bank', 'Aso Bank',
//        'Enterprise Bank', 'Jaiz Bank', 'Suntrust Bank', 'Jubilee Bank', 'Citi Bank']
//        },
//