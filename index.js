require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Person = require('./models/person')

const morgan  = require('morgan')
app.use(bodyParser.json())
const cors = require("cors"); 
const uuid = require('uuid')
app.use(express.static('build'))

morgan.token('id', function getBody (req) {
  return req.id
})
morgan.token('body', function (req, res) { 
    console.log(req.method)
    if(req.method == 'POST')
    app.use(morgan(':method :url :response-time :id '))
})

app.use(assignId)
//app.use(morgan(':method :url :response-time :id '))
app.use(morgan('tiny'))
app.use(cors())
// app.use(cors({  
//     origin: ["http://localhost:3001/api/persons"],
//     methods: ["POST"],
//     allowedHeaders: ["Content-Type","request"]
// }));
// const mongoose = require('mongoose')


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
function assignId (req, res, next) {
    req.id = uuid.v4()
    next()
  }

app.get('/info',(req,res) => {
    const koko = persons.length

    var dt = new Date();
    var utcDate = dt.toUTCString();

    res.send('Puhelinluettelossa ' + koko + ' henkilön tiedot. '+utcDate)


})
// app.get('/api/persons', (req,res) => {
//     res.json(persons)
// })
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  var found = 0;
  persons.find(function(reservedName){
    // console.log(reservedName.name === body.name)
        if(reservedName.name === body.name ){
            found = 1;
            // console.log("Found " + found)
        }
       
  })
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

   if(found === 1) {
    return response.status(400).json({   
        error: 'name is reserved' 
        
      }) 

   }

  const person = Person({
    id: generateId(),
    name: body.name,
    number: body.number
  })

  // persons = persons.concat(person)

  // response.json(person)
  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(204).end() 
      }
    })
    .catch(error => next(error))
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id);
     Person.findByIdAndRemove(request.params.id)
     .then(result => {
       response.status(204).end()
     })
     .catch(error => next(error))
   });
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // olemattomien osoitteiden käsittely
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

  

//   app.listen(3000, function() {  
//     console.log("My API is running...");
// });

// module.exports = app; 
 
  

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})