const PORT = 3001
const BASE_URL = '/api/persons'

const express = require('express')

const app = express()
app.use(express.json())

const persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    nam: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get(BASE_URL,(request,reponse)=>{
  reponse.json(persons)
})


app.listen(PORT,()=>
{
  console.log(`server running on port ${PORT}`);
})

