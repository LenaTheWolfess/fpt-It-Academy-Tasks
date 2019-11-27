import React, { Component } from 'react'
import {NavLink, withRouter} from 'react-router-dom'

class CarTable extends Component {
    state = {
        cars: [],
        error: false
    }
    componentDidMount() {
        this.reload()
      }
    render() {
        if (this.state.error)
            return "there have been an error"
        const data = this.state.cars.map((car, i) => {
        return <tr key = {"c"+i}>
                 <td><NavLink to={"/cars/car-detail/"+car._id}>{car.brand}</NavLink></td>
                 <td>{car.spz}</td>
                 <td><button type="button" className="btn btn-secondary" onClick = {(ev) => {ev.stopPropagation(); this.handleEdit(car._id)}}>Edit</button></td>
                 <td><button type="button" className="btn btn-primary" onClick = {(ev) => {ev.stopPropagation(); this.handleDelete(car._id) }}>Delete</button></td>
              </tr>
        });
        if (!data || !data.length)
            return "Loading ...";
        return (
            <div>
                <button type="button" className="btn btn-primary" onClick = {(ev) => {ev.stopPropagation(); this.handleAdd()}}>New</button>
                <table className="table">
                    <thead>
                        <tr>
                        <th>brand</th>
                        <th>spz</th>
                        <th/>
                        <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {data}
                    </tbody>
                </table>
            </div>
        )
    }
    reload = () => {
        fetch('http://localhost:4000/api/cars')
        .then(res => res.json())
        .then((data) => {
          this.setState( {
              cars: data
            })
        })
        .catch(() => {this.setState({error: true})})
    }
    removeCar = (id) => {
        const cars = this.state.cars;
        this.setState({cars: cars.filter((car) => car._id !== id)});
    }
    handleEdit = (id) => {
        const history = this.props.history;
        history.push("/cars/form-edit/"+id);
    }
    handleAdd = () => {
        const history = this.props.history;
        history.push("/cars/form-new");
    }
    handleDelete = (id) => {
        fetch('http://localhost:4000/api/cars/'+id, {
            method: 'DELETE',
            headers: {
              "Content-type": "application/json"
            }
            })
            .then(() => this.removeCar(id))
            .catch(console.log)
    }
}

export default withRouter(CarTable)
