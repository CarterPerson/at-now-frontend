import React from 'react';
import {
  MemoryRouter as Router, Route, Switch,
} from 'react-router-dom';
// import { createMemoryHistory } from 'history';
import { connect } from 'react-redux';
import {
  makeEvent, makeCalendar, checkSchedule, setCal, hasICS, loadAtNowCal, storeAtNowCal,
} from '../actions';
import './stylesheets/app.scss';

import Auth from './auth';
import AssignmentList from './assignments/assignmentList';
import AssignmentDetail from './assignments/assignmentDetail';
import CalendarReq from './calendarReq';
import SubmitPage from './assignments/submit_Response';

// const history = createMemoryHistory();

const FallBack = ({ match }) => {
  console.log(match);
  return (
    <div>
      URL Not Found: {match.path}
    </div>
  );
};

const App = (props) => (
  <div className="app">
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={({ history }) => (
            <Auth
              onAuth={() => {
                console.log('I am in auth');
                props.checkSchedule(props.googleToken);

                props.loadAtNowCal(props.jwt)
                  .then((_res) => {
                    props.checkSchedule(props.googleToken);
                  })
                  .catch((error) => {
                    console.log('This is the error: ', error);
                    console.log('Making Calendar');
                    props.makeCalendar(props.googleToken, props.jwt);
                  });

                props.hasICS(history);
              }}
            />
          )}
        />
        <Route exact path="/calendarReq">
          <CalendarReq />
        </Route>
        <Route path="/assignments/:id/submit"
          render={({ match }) => (
            <SubmitPage id={match.params.id} />
          )}
        />
        <Route
          path="/assignments/:id"
          render={({ match }) => (
            <AssignmentDetail id={match.params.id} />
          )}
        />
        <Route path="/assignments">
          <AssignmentList />
        </Route>
        <Route component={FallBack} />
      </Switch>
    </Router>
  </div>
);

const mapStateToProps = (state) => ({
  googleToken: state.auth.user?.googleToken,
  jwt: state.auth.user?.jwt,
  calID: state.calendar.calID,
});

const mapDispatchToProps = {
  makeEvent,
  makeCalendar,
  checkSchedule,
  loadAtNowCal,
  storeAtNowCal,
  setCal,
  hasICS,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
