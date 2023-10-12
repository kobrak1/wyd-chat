const verifyRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

verifyRouter.get('/:id', async (req, res) => {
  const io = req.socketServer
  const token = req.params.id

  if (!token) {
    return res.status(401).send({
      error: 'Missing Token'
    })
  }

  const decodedToken = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET)

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(404).send({
      error: 'User does not  exists'
    });
  }

  user.isVerified = true

  await user.save();

  res.status(200).json({
    error: 'Account Verified'
  })

  io.emitEvent('new_user_added', user)
})

module.exports = verifyRouter
