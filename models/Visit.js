const mongoose = require('mongoose');

const VisitSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialist",
        index: true
    },
})

module.exports = mongoose.model('Visit', VisitSchema);