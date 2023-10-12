const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { default: mongoose } = require('mongoose')
const ChatRoom = require('../models/chatRoom')
const multer = require('multer')
const S3ClientManager = require('./S3ClientManager')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message,
    })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }
  else if (error.name === 'SyntaxError') {
    return res.status(400).json({
      error: error.message,
    })
  }

  else if (error.name === 'Invalid login') {
    return res.status(400).json({
      error: error.message,
    })
  }

  logger.error(error.message)

  next(error)
}

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req)
  next()
}

const userExtractor = async (req, res, next) => {
  const token = getTokenFrom(req)

  const decodedToken = jwt.verify(token, process.env.SESSION_TOKEN_SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  const findUser = await User.findById(decodedToken.id)

  if (!findUser) {
    return res.status(404).json({
      error: 'User not found'
    })
  }

  req.user = await User.findById(decodedToken.id)

  next()
}

const chatRoomExtractor = async (req, res, next) => {
  const token = getTokenFrom(req)

  const decodedToken = jwt.verify(token, process.env.SESSION_TOKEN_SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  const chatRoom = await ChatRoom.findById(req.params.id)

  if (!chatRoom) {
    return res.status(404).json({
      error: 'This chat room does not exist'
    })
  }

  req.chatRoom = chatRoom

  next()
}

function isValidId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
    return res
      .status(400)
      .send({ error: 'Invalid Id' })
  }

  next()
}

function attachWebSocket(socketServer) {
  return (req, res, next) => {
    req.socketServer = socketServer
    next()
  };
}

// * Configure Multer and return the upload middleware
function fileExtractor(req, res, next) {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // * Max file size is 5MBs
  }); // TODO: Set file size limit

  // * Create a middleware for handling file uploads
  const uploadFile = upload.single('file');

  // * Middleware to handle file uploads and convert to Buffers
  return uploadFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // * Handle Multer errors (e.g., file size exceeded)
      return res.status(400).json({ error: 'File upload error' });
    } else if (err) {
      // * Handle other errors
      return res.status(500).json({ error: 'Internal server error' });
    }

    next();
  });
}

function s3Instance(req, res, next) {
  req.s3 = S3ClientManager.getInstance()

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  chatRoomExtractor,
  isValidId,
  attachWebSocket,
  fileExtractor,
  s3Instance
}
