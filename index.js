const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(morgan('tiny'))

app.use(bodyParser.json())

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

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    const note = "<p>puhelinluoettelossa " + persons.length + " henkilön tiedot</p>" + new Date()
    res.send(
        note
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * Math.floor(10000))
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

