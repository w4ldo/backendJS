const mongoose = require('mongoose')

const url = 'mongodb://username:password@ds237858.mlab.com:37858/fullstackdb'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person