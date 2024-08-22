const mongoose = require('mongoose');

const DiscosSchema = new mongoose.Schema({
    id: {
        type: Number, 
        required: true, 
    }, 
    discoName: {
        type: String, 
        required: true, 
    }, 
    tracksQuantity: {
        type: Number, 
        required: true, 
    }, 
    discoTime: {
        type: String, 
        required: true, 
    }, 
});

module.exports = mongoose.model('Disco', DiscosSchema);
