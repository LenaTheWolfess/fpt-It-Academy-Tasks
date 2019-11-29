import React, { Component } from 'react'
import RatingForm from './RatingForm'
import {withRouter, Switch, Route} from 'react-router-dom'

import PuzzleRenderer from './PuzzleRenderer';

class Puzzle extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/Puzzle/rating-form">
                        <RatingForm/>
                    </Route>
                    <Route path="/">
                        <PuzzleRenderer/>
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default withRouter(Puzzle);
