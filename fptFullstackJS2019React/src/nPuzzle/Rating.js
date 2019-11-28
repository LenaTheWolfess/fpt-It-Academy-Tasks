import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

class Rating extends Component {
    constructor (props) {
        super(props);
        this.state = {rating: null}
    }
    componentDidMount() {
        fetch('http://localhost:4000/api/rating')
        .then(res => res.json())
        .then((data) => {
          const arr = data.map((item) => item.rating).reduce((prev, now) => prev + now);
          let average = 0;
          if (data.length)
            average = arr / data.length;
          this.setState( {
              rating: average
            })
        })
        .catch(() => {this.setState({error: true})})
    }
    showAddButton = (enabled) => {
        if (!enabled)
            return null;
        return <div>
                    <br/>
                    <button className="btn btn-primary" onClick = {(ev) => {this.openForm()}}>Add rating</button>
                </div>;
    }
    render() {
        let ratingEnabled = this.props.ratingEnabled;
        return (
            <div>
                <br/>
                <h3>Current game rating is: {Math.floor(this.state.rating*100)/100}</h3>
                {this.showAddButton(ratingEnabled)}
            </div>
        )
    }
    openForm() {
        this.props.history.push("/Puzzle/rating-form");
    }
}

export default withRouter(Rating);
