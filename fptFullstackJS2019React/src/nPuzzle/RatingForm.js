import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

class RatingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {rating: 1}
    }
    renderStars = (count) => {
        const stars = new Array(count).fill(1).map((i) => <span>★</span>);
        return <div>{stars}</div>;
    }
    fillRadio = (array, def) => {
        return array.map((value) => {
            return <div key = {"xk"+value}>
                <input id = {"x"+value} type="radio" value={value} name="rating" checked={value === def} onChange={(ev) => {this.handleChange(ev)}}/>
                <label htmlFor = {"x"+value}>{this.renderStars(value)}</label>
            </div>
        })
    }
    render() {
        return (
            <form onSubmit = {(ev) => {ev.preventDefault(); this.handleSubmit(ev)}}>
                <div className="col-xs-3">
                    <label className="h3">Rating</label><br/>
                    {this.fillRadio([1, 2, 3, 4, 5], this.state.rating)}
                </div>
                <br/>
                <button  className="btn btn-primary" type="submit">Send</button>
                <button className="btn btn-secondary" type="button" onClick = {(ev) => {ev.stopPropagation(); this.routeBack()}}>Cancel</button>
            </form>
        )
    }
    handleChange = (ev) => {
        const {name, value} = ev.target;
        this.setState({[name]: +value});
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
