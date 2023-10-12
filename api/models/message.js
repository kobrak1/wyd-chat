const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: function () {
      return !this.file;
    },
    minLength: 1,
    maxLength: [4000, 'Too many characters, max length is 4000']
  },
  file: {
    type: mongoose.Schema.ObjectId,
    ref: 'File',
    required: function () {
      return !this.text
    },
  },
  timestamp: {
    type: Date,
    required: true,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  unread: {
    type: Boolean,
    default: true
  }
})

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
