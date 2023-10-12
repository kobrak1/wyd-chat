const { Server } = require('socket.io');
const User = require('../models/user');
const logger = require('./logger')

// TODO: Apply api middlewares logic like isValidId and errors handling here
class SocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:5173'
      }
    });

    this.activeUserSessions = [];

    this.setupSocketListeners();
  }

  // * Create a static method to get the SocketServer instance
  static getInstance(httpServer) {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer(httpServer);
    }
    return SocketServer.instance;
  }

  setupSocketListeners() {
    this.io.on('connection', (socket) => {
      logger.info(`${socket.id} client wants to connect.`);

      socket.on('login', async ({ id }) => {
        if (!id) return

        const user = await User.findByIdAndUpdate(id, {
          socketId: socket.id,
          online: true,
        })

        // TODO: Remove code below when migration to webhooks is completed
        if (!user) return

        logger.info(`⚡: ${user.username} just connected!`);

        this.activeUserSessions = this.getUniqueArrayValues([...this.activeUserSessions, id])

        this.emitEvent('users_online', this.activeUserSessions)
      })

      socket.on('disconnect', async () => {
        if (!socket.id) return

        const user = await User.findOneAndUpdate({ socketId: socket.id }, {
          socketId: null,
          online: false,
          lastTimeOnline: new Date().toISOString()
        })

        // TODO: Remove code below when migration to webhooks is completed
        if (!user) return

        this.activeUserSessions = this.activeUserSessions.filter(activeUser => activeUser !== user.id)

        this.emitEvent('users_online', this.activeUserSessions)
      });

      socket.on('typing', async ({ from, to }) => {
        if (!from || !to) return

        const toUser = await User.findById(to);

        this.emitEventToRoom(toUser.socketId, 'user_starts_typing', from)
      })

      socket.on('stopped_typing', async ({ from, to }) => {
        if (!from || !to) return

        const toUser = await User.findById(to);

        this.emitEventToRoom(toUser.socketId, 'user_stopped_typing', from)
      })

    })
  }

  emitEvent(event, data) {
    if (!event || !data) {
      logger.error('Missing event or data')
      return
    }

    this.io.emit(event, data);
  }

  // * room is user's socketId for now
  emitEventToRoom(room, event, data) {
    if (!room || !event || !data) {
      logger.error('Missing room, event or data')
      return
    }

    this.io.to(room).emit(event, data)
  }

  // TODO: Remove method below when migration to webhooks is completed
  getUniqueArrayValues(arrayValues) {
    return [...new Set(arrayValues)]
  }
}

module.exports = SocketServer;