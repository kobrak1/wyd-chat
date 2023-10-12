const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { isValidId, userExtractor, fileExtractor, s3Instance } = require('../utils/middleware');
const { validateEmail } = require('../utils/helperFunctions');
const nodemailer = require('nodemailer');
const File = require('../models/file');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

usersRouter.get('/', userExtractor, async (req, res) => {
  const users = await User.find({ isVerified: true })
    .select('firstName lastName avatarPhoto lastTimeOnline online')
    .populate('avatarPhoto')

  res.json(users)
})

usersRouter.get('/:id', [isValidId, userExtractor], async (req, res) => {
  const { id } = req.user

  const users = await User.findById(id)
    .populate({
      path: 'chatRooms',
      populate: [
        {
          path: 'messages',
          populate: 'file'
        },
        {
          path: 'members',
          match: { _id: { $ne: id } }, // * Only retrieve the members that are not the user making the request
          select: 'firstName lastName avatarPhoto lastTimeOnline online',
          populate: 'avatarPhoto'
        },
      ],
    })

  res.json(users)
})

usersRouter.post('/', [fileExtractor, s3Instance], async (req, res) => {
  const { s3, file } = req
  const { username, firstName, lastName, password } = req.body

  // * For now username can only be an email address
  const isValidUsername = validateEmail(username)

  if (!isValidUsername) {
    return res.status(400).json({
      error: 'username must be a valid email address'
    })
  }

  if (password && password.length >= 8) {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username must be unique ' })
    }
  } else
    return res.status(400).json({
      error:
        'Password must be provided and must be at least 8 characters long',
    })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

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

  const user = new User({
    username,
    firstName,
    lastName,
    passwordHash,
    avatarPhoto: savedNewFile,
    lastTimeOnline: null
  })

  const savedUser = await user.save()

  const verificationToken = savedUser.generateVerificationToken();

  const baseURL = process.env.NODE_ENV === 'production' ? 'https://wyd-chat.onrender.com' : 'http://localhost:3003'

  const url = `${baseURL}/api/verify/${verificationToken}`
  transporter.sendMail({
    to: username,
    subject: 'Verify Account',
    html: `Click <a href = '${url}'>here</a> to confirm your email.`
  })

  res.status(201).json({
    message: `Sent a verification email to ${username}`
  })
})

usersRouter.put('/:id', [isValidId, userExtractor, fileExtractor, s3Instance], async (req, res) => {
  const { s3, file } = req
  const { id } = req.user
  const { firstName, lastName } = req.body

  let savedNewFile

  if (file) {
    const fileName = await s3.writeFile(file)

    const newFile = new File({
      name: fileName,
      size: file.size,
      type: file.mimetype
    })

    savedNewFile = await newFile.save()

    const userInDB = await User.findById(id)

    const prevAvatarPhoto = userInDB.avatarPhoto?.name

    if (prevAvatarPhoto) {
      s3.deleteFile(prevAvatarPhoto)
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { firstName, lastName, avatarPhoto: savedNewFile },
    {
      new: true,
    }
  ).select('firstName lastName avatarPhoto')
    .populate('avatarPhoto')

  if (!updatedUser) {
    return res
      .status(404)
      .json({ error: 'Unable to find user' })
  }

  res.status(200).json({
    updatedUser
  })
})

module.exports = usersRouter
