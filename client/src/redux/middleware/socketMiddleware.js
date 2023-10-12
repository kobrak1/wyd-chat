import { appendChatRoomMessage, createUserChatRoom } from '../reducers/userChatsReducer';
import { addUser, removeTypingUser, setOnlineUsersById, setTypingUser } from '../reducers/userContactsReducer';

export default function socketMiddleware(socket) {
  return (params) => (next) => (action) => {
    const { dispatch } = params
    const { type, payload } = action

    switch (type) {
      // * Connect to the socket when a user logs in
      case 'userAuthentication/login': {
        socket.connect()
        socket.emit('login', payload)

        // * Set up all the socket event handlers
        // * When these events are received from the socket, they'll dispatch the proper Redux action

        // TODO: Remove method below when migration to webhooks is completed
        // * Update the online users list every time a user logs in or out
        socket.on('users_online', (onlineUsers) => {
          dispatch(setOnlineUsersById(onlineUsers))
        })

        // * Append a message every time a new one comes in
        socket.on('receive_message', (message) => {
          dispatch(appendChatRoomMessage({ message }))
        })

        // * Remove if some user stops typing
        socket.on('user_stopped_typing', (userId) => {
          dispatch(removeTypingUser(userId));
        })

        // * Add if some user starts typing
        socket.on('user_starts_typing', (userId) => {
          dispatch(setTypingUser(userId))
        })

        // * Append a user every time a new one is registered
        socket.on('new_user_added', (user) => {
          dispatch(addUser(user))
        })

        socket.on('new_chatRoom', (chatRoom) => {
          dispatch(createUserChatRoom(chatRoom))
        })

        break
      }

      // * Telling the sever that this user is typing...
      case 'userContacts/sendThisUserIsTyping': {
        socket.emit('typing', payload)

        break
      }

      // * Telling the server that this user stopped typing..
      case 'userContacts/sendThisUserStoppedTyping': {
        socket.emit('stopped_typing', payload)

        return
      }

      // * Disconnect from the socket when a user logs out
      case 'userAuthentication/logout': {
        socket.disconnect()
        break
      }
    }

    return next(action)
  }
}