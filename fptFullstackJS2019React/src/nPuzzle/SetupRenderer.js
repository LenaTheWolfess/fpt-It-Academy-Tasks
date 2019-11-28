import React, {Component} from 'react'

export default class SetupRenderer extends  Component {
    constructor(props) {
        super(props);
        this.state = this.props.setup;
    }
    render() {
        const { x, y } = this.state
        const { handleChangeSetup } = this.props;
        return (
        <div>
            <input type="number" min="2" max="20" name="x" value={x} onChange = {(ev) => {this.handleChange(ev)}}></input>
            <button type="button" className="btn btn-secondary" onClick = {(ev) => {handleChangeSetup(this.state)}}>Set</button>
            <input type="number" min="2" max="20" name="y" value={y} onChange = {(ev) => {this.handleChange(ev)}} ></input>
        </div>);
    }
    handleChange = (ev) => {
        const {name, value} = ev.target;
        this.setState({[name]: value})
    }
}