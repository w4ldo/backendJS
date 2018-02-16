const mongoose = require('mongoose')

const url = 'mongodb://username:password@ds237858.mlab.com:37858/fullstackdb'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] !== undefined & process.argv[3] !== undefined) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    person
        .save()
        .then(response => {
            console.log('Added person: ', process.argv[2], ', with number: ', process.argv[3])
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, ':', person.number)
            })
            mongoose.connection.close()
        })
}



