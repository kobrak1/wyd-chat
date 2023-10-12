const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(401).json({
      error: 'Missing username (it is your email)',
    })
  }

  const user = await User.findOne({ username }).populate('avatarPhoto')

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    })
  }

  if (!user.isVerified) {
    return res.status(403).json({
      error: 'Verify your account before login in. Check your spam folder if you have not received the verification email'
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'Invalid password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SESSION_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  res.status(200).json({
    token,
    id: user._id,
    username: user.username,
    avatarPhoto: user.avatarPhoto,
    firstName: user.firstName,
    lastName: user.lastName
  })
})

module.exports = loginRouter
