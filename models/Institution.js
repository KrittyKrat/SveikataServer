const mongoose = require('mongoose');

const InstitutionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Institution', InstitutionSchema);