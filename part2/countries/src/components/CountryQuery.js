import React from 'react'

const CountryQuery = (props) =>
  <div>
    Find countries <input onChange={props.onChange} value={props.value}></input>
  </div>

export default CountryQuery  