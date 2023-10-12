import ChatInstance from './ChatInstance'

const baseURL = '/chatRooms'

async function createChatRoom(newChatRoom) {
  const chatRoom = await ChatInstance.post(`${baseURL}`, newChatRoom)

  return chatRoom
}

async function createMessage(newMessage) {
  const id = newMessage.chatRoomId

  const message = await ChatInstance.post(
    `${baseURL}/${id}/messages`,
    newMessage,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }
  )

  return message
}

export default {
  createMessage,
  createChatRoom
}