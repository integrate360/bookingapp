const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// Create a booking
router.post('/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // Notify staff via WebSocket
    const io = req.app.get('socketio');
    io.emit('newBooking', booking);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a booking
router.put('/bookings/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { staffName } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Booking already accepted' });
    }

    booking.status = 'accepted';
    booking.acceptedBy = staffName;
    await booking.save();

    res.status(200).json({ message: 'Booking accepted successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all bookings
router.get('/bookings', async (req, res) => {
    try {
      const bookings = await Booking.find(); // Retrieve all bookings from the database
      res.status(200).json({ bookings }); // Respond with all the bookings
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
