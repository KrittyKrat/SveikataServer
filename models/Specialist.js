const mongoose = require('mongoose');
const Department = require('./Department');

const SpecialistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        index: true
    },
})

module.exports = mongoose.model('Specialist', SpecialistSchema);