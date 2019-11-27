import React, { Component } from 'react'

export default class Score extends Component {
  state = {
    scoreData: []
  }

  componentDidMount() {
    fetch('http://localhost:4000/api/scores')
      .then(res => res.json())
      .then((data) => {
        this.setState( {
          scoreData: data
        })
      })
      .catch(console.log)
  }

  render() {
    return (
      <table className="table">
        <ScoreTableHeader />
        <ScoreTableBody scoreData={this.state.scoreData}/>
      </table>
    )
  }
}

function ScoreTableHeader() {
  return (
    <thead>
      <tr>
        <th>
          Player
        </th>
        <th>
          Points
        </th>
        <th>
          Date
        </th>
      </tr>
    </thead>

  )
}

function ScoreTableBody({ scoreData }) {
  if (!scoreData.length)
  return "Loading ...";
  const rows = scoreData.map((score, index) =>
    <tr key={index}>
      <td>{score.player}</td>
      <td>{score.points}</td>
      <td>{score.date}</td>
    </tr>
  );
  return (
    <tbody>
      {rows}
    </tbody>
  )
}