import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.routeBack = this.routeBack.bind(this)
        this.state = {
            player: "",
            comment: "",
            playerError: null,
            commentError: null,
            formValid: false,
            formValidated: false,
            playerD: false,
            commentD: false
        }
    }
  render() {
    return (
      <form id="form" className={this.formCl()} novalidate onSubmit={this.handleSubmit}>
       <div className="form-group">
        <input type="text" className={this.playerCl()} name="player" onChange={this.handleChange} placeholder="name" invalid={!this.state.playerError}></input>
        <div className="invalid-feedback">{this.state.playerError}</div>
       </div>
       <div className="form-group">
        <input type="text" className={this.commentCl()}  name="comment" onChange={this.handleChange} placeholder="comment"></input>
        <div className="invalid-feedback">{this.state.commentError}</div>
       </div>
        <button type="submit"className="btn btn-primary" disabled = {!this.state.formValid}>Send</button>
        <button type="button" className="btn btn-secondary" onClick = {(ev)=>{ev.stopPropagation(); this.routeBack()}}>Cancel</button>
      </form>
    )
  }
 playerCl = () => {
   return this.state.playerError ? 'form-control is-invalid' : this.state.formValidated && this.state.playerD ? 'form-control is-valid' : 'form-control';
 }
 commentCl = () => {
  return this.state.commentError ? 'form-control is-invalid' : this.state.formValidated && this.state.commentD ? 'form-control is-valid' : 'form-control';
 }
 formCl = () => {
   return 'form';
 }
 handleChange(event) {
     let {name, value} = event.target;
     this.setState({[name] : value}, () => this.validate(name, value));
 }
 validate = (name , value) => {
    let {playerError, commentError, playerD, commentD} = this.state;
    switch (name) {
      case 'player':
        playerError = value && value.length >= 3 ? null : 'player name is too short';
        playerD = true;
        break;
      case 'comment':
        commentError = value && value.length >= 3 ? null : 'comment is too short';
        commentD = true;
      break;
      default:
      break;
    }
    this.setState({
      playerError: playerError,
      commentError: commentError,
      playerD: playerD,
      commentD: commentD
    }, () => this.validateForm())
 }
 validateForm = () => {
   this.setState({formValid: !this.state.playerError && ! this.state.commentError, formValidated: true})
 }
 handleSubmit(event) {
     event.preventDefault()
     let {player, comment} = this.state;
     if (!player || !player.trim().length || !comment || !comment.length())
        return;
     fetch('http://localhost:4000/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        player: player,
        comment: comment
      }), headers: {
        "Content-type": "application/json"
      }
      }).then(response => response.json())
      .then(response => this.routeBack())
 }
 routeBack() {
    const { history } = this.props
    history.push(`/minesweeper`)
 }
}

export default withRouter(CommentForm)
