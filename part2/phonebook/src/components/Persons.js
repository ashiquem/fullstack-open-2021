import React from 'react'
import Person from './Person'

const Persons = (props) => {
  return (
    props.filterName === '' ?
    props.persons.map(person => <Person onDelete={()=>props.onDelete(person.id,person.name)} key={person.name} name={person.name} number={person.number}></Person>) :
    props.filterPersons.map(person => <Person onDelete={()=>props.onDelete(person.id,person.name)} key={person.name} name={person.name} number={person.number}></Person>)
  )
}

export default Persons