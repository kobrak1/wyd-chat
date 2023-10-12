import { createSlice, current } from '@reduxjs/toolkit'
import ChatInstance from '../../services/ChatInstance';
import { toast } from './notificationsReducer';

const initialState = {
  data: null,
  onlineUsersById: [],
  loading: false,
  error: null,
  typingUsersById: []
}

const usersSlice = createSlice({
  name: 'userContacts',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      const { data, currentUserId } = action.payload

      const filterCurrentUser = data.filter(user => user.id !== currentUserId)
        .map(user => ({ ...user, fullName: `${user.firstName} ${user.lastName}` }))

      return { ...state, data: filterCurrentUser, loading: false, error: null }
    },
    // TODO: Remove method below when migration to webhooks is completed
    setOnlineUsersById: (state, action) => {
      return { ...state, onlineUsersById: action.payload }
    },
    addUser: (state, action) => {
      const user = action.payload

      const userWithFullName = { ...user, fullName: `${user.firstName} ${user.lastName}` }

      return { ...state, data: [...state.data, userWithFullName] }
    },
    setTypingUser: (state, action) => {
      return { ...state, typingUsersById: [...state.typingUsersById, action.payload] }
    },
    removeTypingUser: (state, action) => {
      return { ...state, typingUsersById: state.typingUsersById.filter(userId => userId !== action.payload) }
    },
    sendThisUserIsTyping: (state, action) => {

    },
    sendThisUserStoppedTyping: (state, action) => {

    },
    setUsersLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setUsersError(state, action) {
      state.loading = false
      state.error = { message: `Error: ${action.payload}` }
    },
    resetState(state, action) {
      return initialState
    }
  },
})

export const {
  setUsers,
  addUser,
  setOnlineUsersById,
  setTypingUser,
  removeTypingUser,
  sendThisUserIsTyping,
  sendThisUserStoppedTyping,
  setUsersLoading,
  setUsersError,
  resetState
} = usersSlice.actions
export default usersSlice.reducer

export function initializeUserContacts(currentUserId) {
  return async (dispatch) => {
    dispatch(setUsersLoading())

    try {
      const { data } = await ChatInstance.get('/users')

      dispatch(setUsers({ data: data, currentUserId }))
    } catch (error) {
      // Not handling errors
      console.error(error)
      dispatch(setUsersError(`Unable to fetch users data: ${error.message}: ${error.response?.data?.error}`));
      dispatch(toast(`Unable to fetch users data: ${error.message}: ${error.response?.data?.error}`, 'error'))
    }
  }
}
