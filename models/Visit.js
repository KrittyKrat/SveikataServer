const mongoose = require('mongoose');

const VisitSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    specialistID: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Visit', VisitSchema);