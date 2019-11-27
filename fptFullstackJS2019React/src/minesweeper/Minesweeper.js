import React, { Component } from 'react'
import FieldComponent from './Field'
import { Field, GameStateEnum, DifEnum } from './Core'
import GameState from './GameState'
import Score from './Score'
import Comments from './Comments'
import CommentForm from './CommentForm'
import CustomDiffForm from './CustomDiffForm'
import { Switch, Route, withRouter } from 'react-router-dom'

class Minesweeper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      field: new Field(10, 10, 10),
      col: 10,
      row: 10,
      mines: 10,
      customForm: false
    }
  }

  render() {
    const { field } = this.state
    return (
      <div>
        <h1>Minesweeper</h1>
        <Switch>
          <Route path={`/minesweeper/score`}>
            <GameState gameState={field.gameState}
                   handleNewGame={this.handleNewGame} />
            <Score />
          </Route>
          <Route path={`/minesweeper/comment-form`}>
            <CommentForm/>
          </Route>
          <Route path={`/`}>
            <GameState gameState={field.gameState}
                   handleNewGame={this.handleNewGame} />
            <select name="dificulty" onChange={(ev) => this.difficultyChange(ev)}>
              <option value="BEGINNER">Beginner</option>
              <option value="ADVANCED">Advanced</option>
              <option value="MASTER">Master</option>
              <option value="EXPERT">Expert</option>
              <option value="CUSTOM">Custom</option>
            </select>
            {this.displayCustomForm()}
            <button className="btn btn-secondary" onClick = {(ev) => {ev.stopPropagation(); this.restart()}}>Restart</button>
            <FieldComponent field={field}
                        handleOpen={this.handleOpen}
                        handleMark={this.handleMark}/>
            <Comments/>
            <button className="btn btn-primary" onClick = {(ev) => {ev.stopPropagation(); this.showForm()}}>Add comment</button>
          </Route>
        </Switch>
      </div>
    )
  }
  displayCustomForm = () => {
    if (!this.state.customForm)
      return <br/>;
    return <CustomDiffForm handleSubmit={this.handleCustomDiffSubmit}/>
  }
  difficultyChange = (ev) => {
    const {name, value} = ev.target;
    if (name === "dificulty") {
      if (value === "CUSTOM") {
        this.setState({customForm: true});
        return;
      }
      const diff = DifEnum[value];
      this.setState({mines: diff.mines, row: diff.row, col:  diff.col, customForm: false})
    }
  }
  handleCustomDiffSubmit = (settings) => {
    const {row, col, mines} = settings;
    this.setState({mines: mines, row: row, col:  col})
    this.setState({ field: new Field(row, col, Math.min(col * row, mines)) })
  }
  showForm = () => {
    const { history } = this.props
    history.push(`/minesweeper/comment-form`)
  }

  handleOpen = (row, col) => {
    const { field } = this.state
    if (field.gameState != GameStateEnum.PLAYING)
       return;
    field.openTile(row, col)
    this.setState({ field: field })
    if(field.gameState === GameStateEnum.WON) {
      this.addScoreToDb()
    }
  }

  routeToScores() {
    const { history } = this.props
    history.push(`/minesweeper/score`)
  }

  addScoreToDb() {
    fetch('http://localhost:4000/api/scores', {
      method: 'POST',
      body: JSON.stringify({
        player: 'Miska',
        points: Math.floor(Math.random(100))
      }), headers: {
        "Content-type": "application/json"
      }
      }).then(response => response.json())
      .then(response => this.routeToScores())
  }

  handleMark = (row, col) => {
    const { field } = this.state
    field.markTile(row, col)
    this.setState({ field: field })
  }
  restart = () => {
    const {row, col, mines} = this.state;
    this.setState({ field: new Field(row, col, Math.min(col * row, mines)) })
  }
  handleNewGame = () => {
    const { history, match } = this.props
    const {row, col, mines} = this.state;
    this.setState({ field: new Field(row, col, Math.min(col * row, mines)) })
    history.push(`${match.url}`)
  }
}

export default withRouter(Minesweeper)