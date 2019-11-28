import React, { Component } from 'react'
import {Field, GameStateEnum} from './Core';
import FieldRenderer from './FieldRenderer';
import Rating from './Rating'
import RatingForm from './RatingForm'
import {withRouter, Switch, Route} from 'react-router-dom'

class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {field: new Field(4, 4), ratingEnabled: false};
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/Puzzle/rating-form">
                        <RatingForm/>
                    </Route>
                    <Route path="/">
                        <FieldRenderer field = {this.state.field} handleMoveStone = {this.handleMoveStone}/>
                        <Rating ratingEnabled = {this.state.ratingEnabled}/>
                    </Route>
                </Switch>
            </div>
        )
    }
    handleMoveStone = (row, col) => {
        const field = this.state.field;
        if (field.gameState !== GameStateEnum.PLAYING)
            return;
        field.move(row, col);
        this.setState({field: field});
        if (field.gameState === GameStateEnum.WON)
            this.setState({ratingEnabled: true});
    }

}

export default withRouter(Puzzle);
