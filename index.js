const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())
/*
let persons = [
    {
        name: "Arto Hellas",
        number: 040 - 123456,
        id: 1
    },
    {
        name: "Martti Tienari",
        number: 040 - 123456,
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: 040 - 123456,
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: 040 - 123456,
        id: 4
    }
]
*/
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            const note = "<p>puhelinluoettelossa " + persons.length + " henkilön tiedot</p>" + new Date()
            res.send(
                note
            )
        })
})

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}
/**db muodossa */
app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(formatPerson))
        })
})
/**db muodossa */
app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})
/**db muodossa */
app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})
/* MUOKKAAMISTA VARTEN
app.put('/api/persons/:id', (request, response) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person
      .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatedPerson => {
        response.json(formatPerson(updatedPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })
*/
const generateId = () => {
    const randomId = Math.floor(Math.random() * Math.floor(10000))
    return randomId
}
/**db muodossa */
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number || "-"
    })

    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
})

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

