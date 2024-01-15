const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    serviceName: { type: String, required: true },
    type: { type: String, enum: ['Normal', 'VIP'], required: true },
})

module.exports = mongoose.model('Service', serviceSchema);