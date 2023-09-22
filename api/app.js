const { MONGODB_URI } = require('./utils/config')
const express = require('express')
require('express-async-errors')
const { createServer } = require('http');
const cors = require('cors')
const chatRoomsRouter = require('./controllers/chatRooms')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')
const { Server } = require('socket.io');

const app = express()

const httpServer = createServer(app);

morgan.token('chatRoom', (req) => JSON.stringify(req.body))

logger.info('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :chatRoom')
)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

app.use('/api/login', loginRouter)

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  // * Send Message

  socket.on('send message', (message) => {
    console.log('message', message);

    // messages.push(message)

    io.emit('receive message', message)
  })
});
app.use('/api/users', usersRouter)

app.use(middleware.tokenExtractor)

app.use('/api/chatRooms', chatRoomsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = httpServer
