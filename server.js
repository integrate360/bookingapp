const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');
const bookingRoutes = require('./routes/bookingRoutes');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Set up CORS and WebSocket server
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust origin for production
  },
  pingTimeout: 60000, // 60 seconds timeout for idle clients
  pingInterval: 25000, // Keep connection alive by pinging every 25 seconds
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/api', bookingRoutes);

// WebSocket connection logic
io.on('connection', (socket) => {
  console.log('A staff member connected with socket ID:', socket.id);

  // Emit a connection message when a staff member connects
  socket.emit('connected', { message: 'You are connected to the server!' });

  // Handle booking updates: example of sending booking status to all staff
  socket.on('updateBooking', (bookingStatus) => {
    console.log(`Booking status updated: ${bookingStatus}`);
    io.emit('bookingUpdate', { status: bookingStatus });
  });

  // Handle staff disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Staff disconnected: ${socket.id}, Reason: ${reason}`);
  });
});

// Use environment variables for MongoDB URI and any other secrets
app.set('socketio', io);

// Start the server
server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
