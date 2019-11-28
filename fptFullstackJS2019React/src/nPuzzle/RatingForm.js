import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

class RatingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {rating: 1}
    }
    render() {
        return (
            <form onSubmit = {(ev) => {ev.preventDefault(); this.handleSubmit(ev)}}>
                <div className="col-xs-3">
                    <label className="h3" for="ex1" >Rating</label><br/>
                    <input id="ex1" className="input-sm" type="number" name="rating" placeholder="1" min="1" max="5" onChange = {(ev) => {this.handleChange(ev)}}></input>
                </div>
                <br/>
                <button  className="btn btn-primary" type="submit">Send</button>
                <button className="btn btn-secondary" type="button" onClick = {(ev) => {ev.stopPropagation(); this.routeBack()}}>Back</button>
            </form>
        )
    }
    handleChange = (ev) => {
        const {name, value} = ev.target;
        this.setState({[name]: value});
    }
    handleSubmit = (ev) => {
        fetch('http://localhost:4000/api/rating', {
            method: 'POST',
            body: JSON.stringify({
              rating: this.state.rating
            }), headers: {
              "Content-type": "application/json"
            }
            }).then(response => response.json())
            .then(() => this.routeBack())
            .catch(console.log)
    }
    routeBack = () => {
        const { history } = this.props
        history.push(`/Puzzle`)
    }
}

export default withRouter(RatingForm)
