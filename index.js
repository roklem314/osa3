const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    id: 1,
    name: 'Turin Turambar',
    number: '045-1234567',
  },
  {
    id: 2,
    name: 'Aragorn Ranger',
    number: '050-2345678',
  },
  {
    id: 3,
    name: 'Beren Onehand',
    number: '040-3456789',
  },
  {
  id: 4,
    name: 'Elros Half-elf',
    number: '044-2346744',
  },
]
app.get('/api',(req,res) => {
    res.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (req,res) => {
    res.json(persons)
})
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  const note = {
    name: body.name,
    important: body.important || false,
    number: new number(),
    id: generateId(),
  }

  persons = persons.concat(note)

  response.json(note)
})
app.get('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })
  app.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(note => note.id !== id);
  
    response.status(204).end();
  });

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)