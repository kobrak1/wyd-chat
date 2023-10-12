import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    timeoutId: null,
    message: null,
    type: null,
  },
  reducers: {
    addNotification: (state, action) => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId)
      }
      return action.payload
    },
    removeNotification: () => {
      return {
        timeoutId: null,
        message: null,
        type: null,
      }
    },
  },
})

export const { addNotification, removeNotification } =
  notificationSlice.actions

// * type: 'info' || 'success' || 'warning' || 'error'
export const toast = (message, type, timeout = 5) => {
  return (dispatch) => {
    if (!message || !type) {
      console.error('Error: notification\'s message or type missing')
      return
    }

    const timeoutId = setTimeout(
      () => dispatch(removeNotification()),
      timeout * 1000
    )
    const notification = { message, type, timeoutId }
    dispatch(addNotification(notification))
  }
}

export default notificationSlice.reducer