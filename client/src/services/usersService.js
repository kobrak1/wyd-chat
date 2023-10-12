import ChatInstance from './ChatInstance'

const baseURL = '/users'

async function getUser(userId) {
  const user = await ChatInstance.get(`${baseURL}/${userId}`)

  return user
}


async function register(userData) {
  const register = await ChatInstance.post(
    `${baseURL}`,
    userData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }
  )

  return register
}

async function updateUser(updatedUser) {
  const updateUser = await ChatInstance.put(
    `${baseURL}/${updatedUser.id}`,
    updatedUser,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })

  return updateUser
}

export default {
  getUser,
  register,
  updateUser
}