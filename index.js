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

app.get('/info',(req,res) => {
    const koko = persons.length

    var dt = new Date();
    var utcDate = dt.toUTCString();

    res.send('Puhelinluettelossa ' + koko + ' henkilön tiedot. '+utcDate)


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

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ 
      error: 'name missing' 
    })

  }
  if(body.number === undefined){
    return response.status(400).json({ 
        error: 'number missing' 
      })

  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
    
  }

  persons = persons.concat(person)

  response.json(person)
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
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
  
    response.status(204).end();
  });
  

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)