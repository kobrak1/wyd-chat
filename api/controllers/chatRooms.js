const chatRoomsRouter = require('express').Router()
const ChatRoom = require('../models/chatRoom')
const File = require('../models/file')
const Message = require('../models/message')
const User = require('../models/user')
const { userExtractor, isValidId, chatRoomExtractor, fileExtractor, s3Instance } = require('../utils/middleware')

chatRoomsRouter.post('/', userExtractor, async (req, res) => {
  const { members } = req.body
  const io = req.socketServer
  const userId = req.user.id

  if (members?.length !== 2) {
    return res.status(400).json({
      error: 'Error: A chat room must have two members'
    })
  }

  if (!members.includes(userId.toString())) {
    return res.status(403).json({
      error: 'Can not create a chat room for other users'
    })
  }

  // * Query the ChatRoom collection to find a room with both members
  const existingChatRoom = await ChatRoom.exists({
    members: {
      $all: members,
    },
  });

  if (existingChatRoom) {
    return res.status(403).json({
      error: 'Error: A chat room containing this members already exists'
    })
  }

  const chatRoom = new ChatRoom({
    members
  })

  const savedChatRoom = await chatRoom.save()

  await savedChatRoom.populate({
    path: 'members',
    match: { _id: { $ne: userId } }, // * Only retrieve the members that are not the user making the request
    select: 'firstName lastName avatarPhoto lastTimeOnline online',
    populate: 'avatarPhoto'
  })

  // * Add the chat room to both users
  const updatePromises = members.map(userId => {
    return User.findByIdAndUpdate(
      userId,
      { $push: { chatRooms: savedChatRoom.id } }
    );
  });

  await Promise.all(updatePromises);

  res.status(201).json(savedChatRoom)

  const savedChatRoomToJSON = savedChatRoom.toJSON()

  const fromUser = await User.findById(userId).lean().select('firstName lastName avatarPhoto lastTimeOnline online').populate('avatarPhoto')
  const toUser = await User.findById(savedChatRoomToJSON?.members[0]?.id)

  fromUser.id = fromUser._id.toString()
  delete fromUser._id

  const changedMemberToChatRoomCreator = [{ ...savedChatRoomToJSON, members: [fromUser] }]

  if (toUser.socketId) {
    io.emitEventToRoom(toUser.socketId, 'new_chatRoom', changedMemberToChatRoomCreator)
  }
})

chatRoomsRouter.get('/:id/messages', [isValidId, chatRoomExtractor], async (req, res) => {
  const { id } = req.chatRoom

  const chatRoomMessages = await Message.find({
    chatRoomId: id
  })

  res.status(200).json(chatRoomMessages)
})

chatRoomsRouter.post('/:id/messages', [isValidId, userExtractor, chatRoomExtractor, fileExtractor, s3Instance], async (req, res) => {
  const { from, to, text } = req.body
  const selectedChatRoom = req.chatRoom
  const user = req.user
  const io = req.socketServer

  const { s3, file } = req

  if (user.id.toString() !== from) {
    return res.status(403).json({
      error: 'User must be the one sending the message'
    })
  }

  let savedNewFile

  if (file) {
    const fileName = await s3.writeFile(file)

    const newFile = new File({
      name: fileName,
      size: file.size,
      type: file.mimetype
    })

    savedNewFile = await newFile.save()
  }

  const message = new Message({
    from,
    to,
    text,
    file: savedNewFile,
    timestamp: new Date().toISOString(),
    chatRoomId: selectedChatRoom.id
  })

  const savedMessage = await message.save()

  await savedMessage.populate('file')

  selectedChatRoom.messages = selectedChatRoom.messages.concat(savedMessage)

  await selectedChatRoom.save()

  res.status(200).json(savedMessage)

  const toUser = await User.findById(to);

  if (toUser.socketId) {
    io.emitEventToRoom(toUser.socketId, 'receive_message', savedMessage)
  }
})

module.exports = chatRoomsRouter
