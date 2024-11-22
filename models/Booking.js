const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, default: 'pending' }, 
  acceptedBy: { type: String, default: null }, 
});

module.exports = mongoose.model('Booking', BookingSchema);
