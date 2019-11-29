import React, { Component } from 'react'
import {Field, GameStateEnum} from './Core';
import FieldRenderer from './FieldRenderer';
import Rating from './Rating'
import SetupRenderer from './SetupRenderer'
import {withRouter} from 'react-router-dom'

import KeyboardEventHandler from 'react-keyboard-event-handler';
const KEYBOARDENUM = {DOWN: 'down', UP: 'up', RIGTH: 'right', LEFT: 'left'};

class PuzzleRenderer extends Component {
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
                <SetupRenderer setup = {this.state.setup} handleChangeSetup = {this.handleChangeSetup}/>
                <FieldRenderer state = {this.state.field.gameState} stones = {this.state.field.stones} handleMoveStone = {this.handleMoveStone}/>
                <KeyboardEventHandler
                    handleKeys={[KEYBOARDENUM.LEFT, KEYBOARDENUM.RIGTH, KEYBOARDENUM.UP, KEYBOARDENUM.DOWN]}
                    onKeyEvent={(key, ev) =>{ ev.preventDefault(); this.handleKeyEvent(key, ev)}}
                />
                <Rating ratingEnabled = {this.state.ratingEnabled}/>
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
    handleKeyEvent = (key, ev) => {
        const field = this.state.field;
        if (field.gameState !== GameStateEnum.PLAYING)
            return;
        let dir;
        switch (key) {
            case KEYBOARDENUM.DOWN: dir = field.direction.DOWN; break;
            case KEYBOARDENUM.UP: dir = field.direction.UP; break;
            case KEYBOARDENUM.LEFT: dir = field.direction.LEFT; break;
            case KEYBOARDENUM.RIGTH: dir = field.direction.RIGTH; break;
            default: return;
        }
        field.moveDir(dir);
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

export default withRouter(PuzzleRenderer);
