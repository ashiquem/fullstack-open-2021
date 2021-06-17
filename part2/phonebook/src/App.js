import React, { useState, useEffect } from 'react'
import SearchFilter from './components/SearchFilter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterPersons, setFilterPersons] = useState(persons)
  
  useEffect(()=>{
    axios.get('http://localhost:3001/persons')
    .then(response => {
      const fetchedPersons = response.data
      setPersons(fetchedPersons)
    })
  },[])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setnewNumber(event.target.value);
  }

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
    setFilterPersons(persons.filter(person=>person.name.toLowerCase() === event.target.value.toLowerCase())) 
  }

  const handleNameSubmit = (event) => {
    event.preventDefault();

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      alert(`${newName} is already added to the phonebook`)

    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      setPersons(persons.concat(newPerson));
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filterName={filterName} handleFilterNameChange= {handleFilterNameChange}></SearchFilter>
      <h2>Add a new number</h2>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleNameSubmit={handleNameSubmit}>          
        </PersonForm>
      
      <h2>Numbers</h2>
      <Persons filterName={filterName} persons={persons} filterPersons={filterPersons}></Persons>
    </div>
  )
}

export default App