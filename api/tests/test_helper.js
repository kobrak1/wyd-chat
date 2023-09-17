const ChatRoom = require('../models/chatRoom')
const User = require('../models/user')
const _ = require('lodash')

const initialChatRooms = [
  {
    title: 'First Dummy',
    author: 'Dummy author',
    url: 'https://dummy.com',
    likes: 5,
  },
  {
    title: 'Second Dummy',
    author: 'Second dummy author',
    url: 'https://dummy2.com',
    likes: 10,
  },
  {
    title: 'Third Dummy',
    author: 'Dummy author',
    url: 'https://dummy3.com',
    likes: 7,
  },
]

const postNewChatRoom = {
  title: 'New chatRoom post',
  author: 'New author',
  url: 'https://new-post.com',
  likes: 2,
}

const nonExistingId = async () => {
  const chatRoom = new ChatRoom({ content: 'willremovethissoon', title: 'noTitle' })
  await chatRoom.save()
  await chatRoom.remove()

  return chatRoom._id.toString()
}

const chatRoomsInDb = async () => {
  const chatRooms = await ChatRoom.find({})
  return chatRooms.map((chatRoom) => chatRoom.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const initialUsers = [
  {
    username: 'root',
    name: 'root user',
    password: 'rootpass',
  },
  {
    username: 'pmaff',
    name: 'Pablo Maffioli',
    password: 'pabpass',
  },
]

const postNewUser = {
  username: 'nonSensePoetry',
  name: 'Edward Lear',
  password: 'Pobble',
}

const mostChatRooms = (chatRooms) => {
  const topAuthor = _.chain(chatRooms)
    .groupBy('author')
    .map((group, author) => {
      return { author: author, chatRooms: group.length }
    })
    .maxBy((object) => object.chatRooms)
    .value()

  return topAuthor
}

const mostLikes = (chatRooms) => {
  const topAuthor = _.chain(chatRooms)
    .groupBy('author')
    .map((group, author) => {
      return {
        author: author,
        likes: group.reduce((prev, next) => {
          return (prev += next.likes)
        }, 0),
      }
    })
    .maxBy((object) => object.likes)
    .value()

  return topAuthor
}

module.exports = {
  initialChatRooms,
  chatRoomsInDb,
  nonExistingId,
  postNewChatRoom,
  usersInDb,
  initialUsers,
  postNewUser,
  mostChatRooms,
  mostLikes,
}