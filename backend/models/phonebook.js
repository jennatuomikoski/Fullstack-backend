const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    },
  });

const PhoneBook = mongoose.model('PhoneBook', phonebookSchema)

module.exports = PhoneBook