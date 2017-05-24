// load the things needed for GraFund's plans.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
    // imagePath: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Plan', planSchema);
