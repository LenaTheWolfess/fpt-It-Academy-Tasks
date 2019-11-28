import React, { Component } from 'react'
import {Field, GameStateEnum} from './Core';
import FieldRenderer from './FieldRenderer';
import Rating from './Rating'
import RatingForm from './RatingForm'
import SetupRenderer from './SetupRenderer'
import {withRouter, Switch, Route} from 'react-router-dom'

class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field: new Field(4, 4),
            ratingEnabled: false,
            setup: {x: 4, y: 4}
        };
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/Puzzle/rating-form">
                        <RatingForm/>
                    </Route>
                    <Route path="/">
                        <SetupRenderer setup = {this.state.setup} handleChangeSetup = {this.handleChangeSetup}/>
                        <FieldRenderer state = {this.state.field.gameState} stones = {this.state.field.stones} handleMoveStone = {this.handleMoveStone}/>
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
    handleChangeSetup = (setup) => {
        if (!setup.x || !setup.y)
            return;
        if (setup.x < 3 && setup.y < 3)
            return;
        if (setup.x < 2 || setup.y < 2)
            return;
        let newSetup = {x: setup.x, y: setup.y};
        this.setState({setup: newSetup, field: new Field(newSetup.x, newSetup.y), ratingEnabled: false});
    }
}

export default withRouter(Puzzle);
