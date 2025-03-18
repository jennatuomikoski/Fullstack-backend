require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require("cors")
const mongoose = require('mongoose')
const PhoneBook = require('./models/phonebook')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
// Connect db
const url = process.env.MONGODB_URI
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error.message)
  })

// Get all persons
app.get('/api/persons', (request, response, next) => {
  PhoneBook.find({})
  .then((entries) => {
    response.json(entries)
  })
  .catch(error => next(error))
})
// Get info
app.get('/info', (request, response, next) => {
  PhoneBook.countDocuments({})
    .then((count) => {
      const currentDate = new Date()
      const info = `
        <p>Phonebook has info for ${count} peoples</p>
        <p>${currentDate}</p>
      `
      response.send(info)
    })
    .catch(error => next(error))
})
// Check if there is data with matching id
app.get('/api/persons/:id', (request, response, next) => {
  PhoneBook.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Add a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const newPerson = new PhoneBook({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Delete
app.delete('/api/persons/:id', (request, response, next) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  PhoneBook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// Unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id '})
  }

  next(error)
}

app.use(errorHandler)