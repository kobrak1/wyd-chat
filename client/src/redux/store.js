import { configureStore } from '@reduxjs/toolkit'
import userChatsReducer from './reducers/userChatsReducer'
import socketMiddleware from './middleware/socketMiddleware'
import SocketClient from '../utils/SocketClient'
import userAuthenticationReducer from './reducers/userAuthenticationReducer'
import userContactsReducer from './reducers/userContactsReducer'
import notificationsReducer from './reducers/notificationsReducer'

const socket = new SocketClient()

export const store = configureStore({
  reducer: {
    userChats: userChatsReducer,
    userAuthentication: userAuthenticationReducer,
    userContacts: userContactsReducer,
    notification: notificationsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware(socket)),
})
