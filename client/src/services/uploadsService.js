import ChatInstance from './ChatInstance'

const baseURL = '/uploads'

async function getFile(fileURL) {
  const file = await ChatInstance.get(`${baseURL}/${fileURL}`)

  return file
}

export default {
  getFile,
}