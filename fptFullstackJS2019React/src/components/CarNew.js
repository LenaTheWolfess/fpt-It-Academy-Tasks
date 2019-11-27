import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class CarNew extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.routeBack = this.routeBack.bind(this)
        this.initState = {
            brand: "",
            spz: "",
            brandError: null,
            spzError: null,
            formValid: false,
            formValidated: false,
            brandD: false,
            spzD: false
        }
        this.state = this.initState;
    }
  render() {
    return (
      <form id="form" className={this.formCl()} noValidate onSubmit={this.handleSubmit}>
       <div className="form-group">
        <input type="text" className={this.brandCl()} name="brand" onChange={this.handleChange} placeholder="brand" value={this.state.brand}></input>
        <div className="invalid-feedback">{this.state.brandError}</div>
       </div>
       <div className="form-group">
        <input type="text" className={this.spzCl()}  name="spz" onChange={this.handleChange} placeholder="spz" value={this.state.spz}></input>
        <div className="invalid-feedback">{this.state.spzError}</div>
       </div>
        <button type="submit"className="btn btn-primary" disabled = {!this.state.formValid}>Send</button>
        <button type="button" className="btn btn-secondary" onClick = {(ev) => {ev.stopPropagation(); this.handleReset()}}>Reset</button>
        <button type="button" className="btn btn-secondary" onClick = {(ev)=>{ev.stopPropagation(); this.routeBack()}}>Cancel</button>
      </form>
    )
  }
 brandCl = () => {
   return this.state.brandError ? 'form-control is-invalid' : this.state.formValidated && this.state.brandD ? 'form-control is-valid' : 'form-control';
 }
 spzCl = () => {
  return this.state.spzError ? 'form-control is-invalid' : this.state.formValidated && this.state.spzD ? 'form-control is-valid' : 'form-control';
 }
 formCl = () => {
   return 'form';
 }
 handleChange(event) {
     let {name, value} = event.target;
     this.setState({[name] : value}, () => this.validate(name, value));
 }
 handleReset = () => {
    this.setState(this.initState);
 }
 validateSpz = (spz) => {
    const res = spz.match(/[A-Z]{2}[0-9]{3}[A-Z]{2}/);
    return res && res.length;
 }
 validate = (name , value) => {
    let {brandError, spzError, brandD, spzD} = this.state;
    switch (name) {
      case 'brand':
        brandError = value && value.trim().length >= 1 ? null : 'brand is too short';
        brandD = true;
        break;
      case 'spz':
        spzError = value && value.trim().length === 7 && this.validateSpz(value) ? null : 'spz has to have 2 capitals 3 numbers 2 capitals';
        spzD = true;
      break;
      default:
      break;
    }
    this.setState({
      brandError: brandError,
      spzError: spzError,
      brandD: brandD,
      spzD: spzD
    }, () => this.validateForm())
 }
 validateForm = () => {
   this.setState({formValid: !this.state.brandError && ! this.state.spzError, formValidated: true})
 }
 handleSubmit(event) {
     event.preventDefault()
     let {brand, spz} = this.state;
     if (!brand || !brand.trim().length || !spz || !spz.trim().length)
        return;
     fetch('http://localhost:4000/api/cars', {
      method: 'POST',
      body: JSON.stringify({
        brand: brand,
        spz: spz
      }), headers: {
        "Content-type": "application/json"
      }
      }).then(response => response.json())
      .then(() => this.routeBack())
      .catch(console.log)
 }
 routeBack() {
    const { history } = this.props
    history.push(`/cars`)
 }
}

export default withRouter(CarNew)
