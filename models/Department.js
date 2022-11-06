const mongoose = require('mongoose');
const Institution = require('./Institution');

const DepartmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    institutionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        index: true
    },
})

module.exports = mongoose.model('Department', DepartmentSchema);