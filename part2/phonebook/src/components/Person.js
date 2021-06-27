import React from 'react'

const Person = (props) => 
<p>
  {props.name} {props.number}
  <button onClick={props.onDelete}>Delete</button>
</p>

export default Person