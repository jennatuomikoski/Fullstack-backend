const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  },
  {
    id: "5",
    name: "Gary Poppendieck",
    number: "39-23-6423122"
  },
  {
    id: "6",
    name: "Gary Doppendieck",
    number: "39-23-6423122"
  },  
  {
    id: "7",
    name: "Harry Doppendieck",
    number: "39-23-64231223"
  },
]
// Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
// Get info
app.get('/info', (request, response) => {
  const currentDate = new Date()
  const info = `
  <p>Phonebook has info for ${persons.length} peoples</p>
  <p>${currentDate}</p>
  `
  response.send(info)
})
// Check if there is data with matching id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  
})

// Add a new person
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('Request body', body)
  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }
  // Check is name unique
  const nameUnique = persons.find(person => person.name === body.name) 
  if (nameUnique) {
    return response.status(400).json({ error: 'name must be unique'})
  }

  // Generate a random ID
  const id =(() => {
    let newId;
    do {
      newId = Math.floor(Math.random() * 1000000).toString();
    } while (persons.some(person => person.id === newId));
    return newId;
  })();

  // Create a new person object
  const newPerson = {
    id: id.toString(),
    name: body.name,
    number: body.number,
  }

  // Add new person to the array
  persons = persons.concat(newPerson)

  response.json(newPerson)
})

// Delete
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})