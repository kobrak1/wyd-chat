const mongoose = require('mongoose')
const S3ClientManager = require('../utils/S3ClientManager');
const { parseISO, isAfter } = require('date-fns');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  tempURL: String,
  tempUrlExpirationDate: Date
})

fileSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

fileSchema.post('init', async function (doc) {
  // * if there is no tempURL or if the tempUrl is expired, generate a new temp url
  if (doc && (!doc.tempURL || isAfter(parseISO(doc.tempUrlExpirationDate), new Date()))) {
    const s3 = S3ClientManager.getInstance()

    const tempURL = await s3.generateTempPublicURL(doc.name)

    doc.tempURL = tempURL.url
    doc.tempUrlExpirationDate = tempURL.expirationDate

    await doc.save()


    return doc
  }
})

const File = mongoose.model('File', fileSchema)

module.exports = File
