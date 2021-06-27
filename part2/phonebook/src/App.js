import React, { useState, useEffect } from 'react'
import SearchFilter from './components/SearchFilter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterPersons, setFilterPersons] = useState(persons)

  useEffect(() => {
    personService
      .getAll()
      .then(fetchedPersons => {
        setPersons(fetchedPersons)
      })
  }, [])

  const handlePersonDelete = (id,name) => {
    if(window.confirm(`Delete ${name} ?`))
    {
      personService.deleteResource(id)
      .then(()=>{
        setPersons(persons.filter(p=>p.id !== id))
      })
      .catch(error=>{
        alert(`could not delete ${name}`)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
    setFilterPersons(persons.filter(person => person.name.toLowerCase() === event.target.value.toLowerCase()))
  }

  const handleNameSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName)
    const invalidPerson = newName === '' ||  newNumber === ''
    if(invalidPerson)
    {
      alert('Please enter a valid name and number')
      return
    }
    
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      if(window.confirm(`${newName} is already added to the phonebook, replace old number with a new one?`))
      {
        personService.update(existingPerson.id,newPerson)
        .then(updatedPerson => {
          setPersons(persons.map(p=> p.id !== existingPerson.id ? p : updatedPerson))
        })
      }
    }
    else {
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filterName={filterName} handleFilterNameChange={handleFilterNameChange}></SearchFilter>
      <h2>Add a new number</h2>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleNameSubmit={handleNameSubmit}>
      </PersonForm>

      <h2>Numbers</h2>
      <Persons onDelete={handlePersonDelete} filterName={filterName} persons={persons} filterPersons={filterPersons}></Persons>
    </div>
  )
}

export default App