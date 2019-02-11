const mongoose = require('mongoose')



const password = "";
console.log(password)


const url =`mongodb+srv://half_elf:${password}@moria-ivmun.mongodb.net/test?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Person = mongoose.model('Person', noteSchema)

if ( process.argv.length<3 ) {
    console.log('puhelinluettelo:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
  }


const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
})

person.save().then(result => {
  console.log('note saved!');
  mongoose.connection.close();
})

  