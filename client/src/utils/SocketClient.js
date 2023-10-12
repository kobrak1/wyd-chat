import { io } from 'socket.io-client'

// A little API for the stateful socket connection, just to keep it out of the global
// namespace and away from the socket middleware
export default class SocketClient {
  socket

  connect() {
    this.socket = io()
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(eventName, data) {
    if (this.socket) {
      this.socket.emit(eventName, data)
    }
  }

  on(eventName, func) {
    if (this.socket) {
      this.socket.on(eventName, func)
    }
  }
}