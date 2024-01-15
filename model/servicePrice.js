const mongoose = require("mongoose")

const servicePriceOptionsSchema = new mongoose.Schema({
    serviceID: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['Hourly', 'Weekly', 'Monthly'], required: true },
})

module.exports = mongoose.model('Service', servicePriceOptionsSchema);