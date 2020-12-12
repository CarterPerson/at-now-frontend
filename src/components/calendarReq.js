/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './stylesheets/calendarReq.scss';
import { withRouter } from 'react-router';
import back from '../images/back.png';
import dartmouth from '../images/dartmouth.png';
import { postICS } from '../actions';

class calendarReq extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarICS: '',
      question: false,
      dartmouth: false,
      icsError: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      calendarICS: e.target.value,
    });
  }

  submitICS = () => {
    console.log('setting');
    // change URL in post to right one, don't know how backend works right now
    this.props.postICS(this.state.calendarICS);

    setTimeout(() => {
      if (this.props.hasICS) {
        this.setState({
          icsError: false,
        });
        this.props.history.push('/assignments');
      } else {
        this.setState({
          icsError: true,
        });
      }
    }, 5000);
    console.log('finished setting');
  }

  redirectCalendar = () => {
    chrome.tabs.create({ url: 'https://canvas.dartmouth.edu/calendar' });
    setTimeout(() => {
      this.props.history.push('/assignments');
    }, 1000);
  }

  render() {
    return (
      <div className="calendarReq">
        { this.state.question
          ? (
            <div className="calendarForm">
              { this.state.dartmouth ? (
                <div className="calendarReqDisplay">
                  <img src={back} alt="Back" width="20" height="20" onClick={() => this.setState({ dartmouth: true, question: false })} />
                  <img src={dartmouth} alt="Dartmouth" width="152" height="115" />
                  <button type="button" className="btn btn-outline-success" onClick={() => this.redirectCalendar()}>Get Calendar</button>
                </div>
              )
                : (
                  <div className="calendarReqDisplay">
                    <img src={back} alt="Back" width="20" height="20" onClick={() => this.setState({ dartmouth: true, question: false })} />
                    <form>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Enter Calendar ICS: </label>
                        <input type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Calendar ics"
                          onChange={this.handleChange}
                          value={this.state.calendarICS}
                        />
                        { this.state.icsError ? (
                          <div className="alert alert-danger" role="alert">
                            Invalid ICS!
                          </div>
                        ) : null}
                        <small id="emailHelp" className="form-text text-muted">We&apos;ll never share your calendar ics with anyone else.</small>
                      </div>
                    </form>
                    <button type="button" className="btn btn-outline-success" onClick={() => this.submitICS()}>Submit</button>
                  </div>
                )}
            </div>
          )
          : (
            <div className="calendarReqDisplay">
              <h1> Do you go to Dartmouth? </h1>
              <div className="calendarReqQuestion">
                <button type="button" className="btn btn-outline-dark" onClick={() => this.setState({ dartmouth: true, question: true })}>Yes</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => this.setState({ dartmouth: false, question: true })}>No</button>
              </div>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  calendar: reduxState.calendar,
  hasICS: reduxState.assignment.hasICS,
});

export default withRouter(connect(mapStateToProps, { postICS })(calendarReq));
