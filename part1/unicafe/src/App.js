import React, { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick} >{text}</button>

const Statistic = ({ text, value }) => 
<tr>
  <td>{text}</td>
  <td>{value}</td> 
</tr>

const Statistics = (props) => {
  const { good, neutral, bad, all, average, positive } = props
  const header = <h1>statistics</h1>

  if (all === 0) {
    return (
      <div>
        {header}
        <div>No feedback given</div>
      </div>
    )
  }

  return (
    <div>
      {header}
      <table>
        <tbody>
          <Statistic text='good' value={good}></Statistic>
          <Statistic text='neutral' value={neutral}></Statistic>
          <Statistic text='bad' value={bad}></Statistic>
          <Statistic text='all' value={all}></Statistic>
          <Statistic text='average' value={average}></Statistic>
          <Statistic text='positive' value={positive + '%'}></Statistic>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementValue = (value, setValue) => {
    setValue(value + 1);
  }


  const all = good + bad + neutral
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={() => incrementValue(good, setGood)} ></Button>
      <Button text={'neutral'} onClick={() => incrementValue(neutral, setNeutral)}></Button>
      <Button text={'bad'} onClick={() => incrementValue(bad, setBad)}></Button>

      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}></Statistics>
    </div>
  )
}

export default App