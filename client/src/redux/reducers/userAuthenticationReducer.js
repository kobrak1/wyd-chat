import { createSlice } from '@reduxjs/toolkit'
import LoginService from '../../services/loginService';
import UsersService from '../../services/usersService';
import { LocalStorageManager } from '../../utils/LocalStorageManager';
import { resetUserChatsState } from './userChatsReducer';
import { toast } from './notificationsReducer';

const { setItem, removeItem } = LocalStorageManager

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
}

const loggedUserSlice = createSlice({
  name: 'userAuthentication',
  initialState: initialState,
  reducers: {
    login(state, action) {
      setItem('user', action.payload)

      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      }
    },
    logout(state, action) {
      removeItem('user')

      return initialState
    },
    updateUserDetails(state, action) {
      const { firstName, lastName, avatarPhoto } = action.payload

      const updatedUser = { ...state.user, firstName, lastName, avatarPhoto }

      removeItem('user')
      setItem('user', updatedUser)

      return { ...state, user: updatedUser }
    }
  },
})

export const { login, logout, updateUserDetails } = loggedUserSlice.actions

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const loggedInUser = await LoginService.login(credentials)

      dispatch(login(loggedInUser.data))
    } catch (error) {
      console.error(error);
      dispatch(toast(error?.response?.data.error, 'error'))
    }
  }
}

export const updateUserAction = (updatedUser) => {
  return async (dispatch) => {
    try {
      const { data } = await UsersService.updateUser(updatedUser)

      dispatch(updateUserDetails(data.updatedUser))
      dispatch(toast('User successfully updated', 'success'))
    } catch (error) {
      console.error(error)
      dispatch(toast(error?.response?.data.error, 'error'))
    }
  }
}

export const keepUserSessionAlive = (user) => {
  return (dispatch) => {
    dispatch(login(user))
  }
}

export const logoutUser = ({ id }) => {
  return (dispatch) => {
    dispatch(logout(id))
    dispatch(resetUserChatsState())
  }
}

export default loggedUserSlice.reducer