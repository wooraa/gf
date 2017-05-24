var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var confirmSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    confirm: {type: Boolean},
    Comment: {type: String}
},
{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports = mongoose.model('Confirm', confirmSchema);
