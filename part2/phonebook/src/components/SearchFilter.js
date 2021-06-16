import React from 'react'

const SearchFilter = (props) => {
  return (
    <div>
      filter shown with: <input value={props.filterName} onChange={props.handleFilterNameChange} />
    </div>
  )
}

export default SearchFilter