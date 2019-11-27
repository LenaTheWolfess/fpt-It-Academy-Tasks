import React, { Component } from 'react'
import CarsTable from './CarTable'
import CarDetail from './CarDetail'
import CarNew from './CarNew'
import CarEdit from './CarEdit'
import { Switch, Route, withRouter } from 'react-router-dom'

class Cars extends Component {
    render() {
        return (<div>
              <Switch>
                  <Route path="/cars/form-new"><CarNew/></Route>
                  <Route path="/cars/form-edit/:id"><CarEdit/></Route>
                  <Route path="/cars/car-detail/:id"><CarDetail/></Route>
                  <Route path="/cars"><CarsTable/></Route>
              </Switch>
            </div>);
    }
}

export default withRouter(Cars)
