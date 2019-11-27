import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

class CarDetail extends Component {
    state = {
        car: null,
        error: false
    }
    componentDidMount() {
        fetch('http://localhost:4000/api/cars/'+this.props.match.params.id)
          .then(res => res.json())
          .then((data) => {
            this.setState( {
                car: data
              })
          })
          .catch(() => {this.setState({error: true})})
      }
    render() {
        const {car, error} = this.state;
        if (error)
            return "there have been an error";
        if (!car)
          return "loading ...";
        const data = <tr><td>{car.brand}</td><td>{car.spz}</td></tr>;
        return (<div>
            <table className="table">
                <thead>
                    <tr>
                    <th>brand</th>
                    <th>spz</th>
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </table>
            <button type="button" className="btn btn-primary" onClick = {(ev) => {ev.stopPropagation(); this.handleGoBack()}}>Go back</button>
            </div>
        )
    }
    handleGoBack = () => {
        this.props.history.push("/cars")
    }
}

export default withRouter(CarDetail)
