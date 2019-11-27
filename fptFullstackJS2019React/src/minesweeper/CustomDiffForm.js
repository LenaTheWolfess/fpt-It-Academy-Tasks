import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class CustomDiffForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            row: 10,
            col: 10,
            mines: 10
        }
    }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Rows</label>
        <input type="number" style={{width: 40}} name="row" onChange={this.handleChange}></input>
        <label>Columns</label>
        <input type="number" style={{width: 40}} name="col" onChange={this.handleChange}></input>
        <label>Mines</label>
        <input type="number" style={{width: 40}} name="mines" onChange={this.handleChange}></input>
        <button type="submit"className="btn btn-primary">Set</button>
      </form>
    )
  }

 handleChange(event) {
     let {name, value} = event.target;
     this.setState({[name] : value})
 }
 handleSubmit(event) {
     event.preventDefault()
     this.props.handleSubmit(this.state);
 }
}

export default CustomDiffForm
