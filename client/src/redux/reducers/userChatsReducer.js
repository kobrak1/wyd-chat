import { createSlice } from '@reduxjs/toolkit'
import UserService from '../../services/usersService';
import ChatRoomService from '../../services/chatRoomsService';
import { compareDesc, parseISO } from 'date-fns';
import { toast } from './notificationsReducer';

function parseChatRooms(chatRooms) {
  return chatRooms
    .map(chatRoom => ({
      id: chatRoom?.id,
      title: `${chatRoom?.members[0]?.firstName} ${chatRoom?.members[0]?.lastName}`,
      messages: chatRoom.messages,
      contact: { ...chatRoom?.members[0] }
    }))
}

function sortChatRoomsByLatestMessage(chatRooms) {
  return [...chatRooms].sort((roomA, roomB) => {
    const latestMessageA = roomA.messages.at(-1);
    const latestMessageB = roomB.messages.at(-1);

    if (!latestMessageA) return 1; // Place rooms with no messages at the end.
    if (!latestMessageB) return -1;

    const timestampA = parseISO(latestMessageA.timestamp);
    const timestampB = parseISO(latestMessageB.timestamp);

    // Compare timestamps in descending order (latest first).
    return compareDesc(timestampA, timestampB);
  });
}

const initialState = { data: null, loading: false, error: null }

const userChatsSlice = createSlice({
  name: 'userChats',
  initialState: initialState,
  reducers: {
    setUserChats(state, action) {
      const { data } = action.payload

      const parsedData = {
        ...data,
        activeChat: null,
        chatRooms: sortChatRoomsByLatestMessage(parseChatRooms(data.chatRooms))
      }

      return { ...state, data: parsedData, loading: false, error: null }
    },
    createUserChatRoom(state, action) {
      const parsedChatRoom = parseChatRooms(action.payload)

      if (!parsedChatRoom.length) {
        const error = {
          message:
            'Error: Something went wrong, please refresh the page and you should see your new conversation'
        }
        console.error(error.message);

        return {
          ...state,
          error
        }
      }

      return {
        ...state,
        data: {
          ...state.data,
          chatRooms: [...state.data.chatRooms, ...parsedChatRoom],
        }
      }
    },
    setActiveChat(state, action) {
      const findActiveChat = state.data.chatRooms?.find(chatRoom => chatRoom.id === action.payload)

      if (!findActiveChat) {
        const error = {
          message:
            'Error: Unable to select this conversation'
        }
        console.error(error.message);

        return {
          ...state,
          error
        }
      }

      return { ...state, data: { ...state.data, activeChat: findActiveChat } }
    },
    appendChatRoomMessage(state, action) {
      const { activeChat } = state.data
      const { message } = action.payload

      if (!message?.id) {
        const error = {
          message:
            'Error: Unable to add this message, please try again'
        }
        console.error(error.message);

        return {
          ...state,
          error
        }
      }

      const destinationChatRoom = state.data.chatRooms?.find(chatRoom => chatRoom.id === message.chatRoomId)

      // TODO: Get rid of activeChat state, handle it only with chatRooms
      const appendedMessageToActiveChat = activeChat ? {
        ...activeChat,
        messages: destinationChatRoom.id === activeChat.id ? [...activeChat.messages, message] : activeChat.messages
      }
        : null


      const appendedMessageToDestinationChatRoom = {
        ...destinationChatRoom,
        messages: [...destinationChatRoom.messages, message]
      }

      return {
        ...state,
        data: {
          ...state.data,
          activeChat: appendedMessageToActiveChat,
          chatRooms: sortChatRoomsByLatestMessage(state.data.chatRooms
            .map(chatRoom =>
              chatRoom.id !== destinationChatRoom.id ? chatRoom : appendedMessageToDestinationChatRoom
            ))
        }
      }
    },
    setUserChatsLoading(state) {
      state.loading = true
      state.error = null
    },
    setUserChatsError(state, action) {
      state.loading = false
      state.error = { message: `Error: ${action.payload}` }
    },
    resetState(state, action) {
      return initialState
    }
  },
})

export const {
  setUserChats,
  createUserChatRoom,
  setActiveChat,
  appendChatRoomMessage,
  setUserChatsLoading,
  setUserChatsError,
  resetState
} = userChatsSlice.actions

export const initializeUserChats = (userId) => {
  return async (dispatch) => {
    try {
      dispatch(setUserChatsLoading());

      const { data: userChatData } = await UserService.getUser(userId)

      dispatch(setUserChats({ data: userChatData }))
    }
    catch (error) {
      console.error(error)
      dispatch(setUserChatsError(`Unable to fetch your chats data: ${error.message}: ${error.response?.data?.error}`));
      dispatch(toast(`Unable to fetch your chats data: ${error.message}: ${error.response?.data?.error}`, 'error'))

    }
  }
}

export const createUserChatRoomAction = (newChatRoom) => {
  return async (dispatch) => {
    try {
      const { data: chatRoom } = await ChatRoomService.createChatRoom(newChatRoom)

      dispatch(createUserChatRoom([chatRoom]))
      dispatch(activateChat(chatRoom.id))
    }
    catch (error) {
      console.error(error)
      dispatch(setUserChatsError(`Unable to create new chat: ${error.message}: ${error.response?.data?.error}`));
      dispatch(toast(`Unable to create new chat: ${error.message}: ${error.response?.data?.error}`, 'error'))
    }
  }
}

export const activateChat = (chatId) => {
  return (dispatch) => {
    try {
      dispatch(setActiveChat(chatId))
    }
    catch (error) {
      console.error(error)
      dispatch(setUserChatsError(`Unable to select that chat: ${error.message}`));
      dispatch(toast(`Unable to select that chat: ${error.message}`, 'error'))

    }
  }
}

export const createChatRoomMessage = (newMessage) => {
  return async (dispatch) => {
    try {
      const { data: message } = await ChatRoomService.createMessage(newMessage)

      dispatch(appendChatRoomMessage({ message }))
    }
    catch (error) {
      console.error(error)
      dispatch(setUserChatsError(`Unable to send your message: ${error.message}: ${error.response?.data?.error}`))
      dispatch(toast(`Unable to send your message: ${error.message}: ${error.response?.data?.error}`, 'error'))
    }
  }
}

export const resetUserChatsState = () => {
  return (dispatch) => {
    dispatch(resetState())
  }
}

export default userChatsSlice.reducer