var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},// refers to the currently signed in user
    account: {type: Schema.Types.ObjectId, ref: 'Account'},
    choice: {type: Object, required: true},// a list of packages a user selected
    confirm: {type: String, uppercase: true, default: 'Confirmed'}
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports = mongoose.model('Order', orderSchema);
