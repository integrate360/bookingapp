const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

mongoose
  .connect(
    'mongodb+srv://integrate360:Admin%40123%2A%2A@aerial.lxzjvti.mongodb.net/bookingapp?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

app.use(cors());
app.use(express.json());
app.use('/api', bookingRoutes);

io.on('connection', (socket) => {
  console.log('A staff member connected with socket ID:', socket.id);

  socket.emit('connected', { message: 'You are connected to the server!' });

  socket.on('disconnect', () => {
    console.log('Staff disconnected:', socket.id);
  });
});

app.set('socketio', io);

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
