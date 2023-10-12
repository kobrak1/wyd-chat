const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../utils/helperFunctions');

// TODO: Add contacts
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: [validateEmail, 'invalid email']
  },
  firstName: {
    type: String,
    required: true,
    minLength: 2
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2
  },
  passwordHash: String,
  avatarPhoto: {
    type: mongoose.Schema.ObjectId,
    ref: 'File'
  },
  lastTimeOnline: Date,
  socketId: String,
  online: Boolean,
  isVerified: {
    type: Boolean,
    default: false
  },
  chatRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
  ],
},
  {
    methods: {
      generateVerificationToken() {
        const user = this
        const verificationToken = jwt.sign(
          { id: user._id },
          process.env.USER_VERIFICATION_TOKEN_SECRET,
          { expiresIn: '7d' }
        );
        return verificationToken;
      }
    }
  }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
