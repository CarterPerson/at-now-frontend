import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { postTime, changeStatus } from '../../actions';
import './stylesheets/submitPage.scss';
import leftVector from '../../images/leftVector.png';

class SubmitPage extends Component {
  submitTime = () => {
    this.props.postTime(this.props.id, document.getElementById('inputBox').value);
    console.log(this.props.id);
    this.props.changeStatus(this.props.id, 'completed', this.props.history);
  }

  render() {
    return (
      <div className="submitContainer">
        <div className="topBar">
          <img className="backArrow" src={leftVector} onClick={() => this.props.history.push('/assignments')} alt="" />
        </div>
        <h1>Good job!</h1>

        <h4 className="submitBlurb"> How long did you spend on this assignment?* </h4>
        <div className="timeReqBoxes">
          <input className="hourInput" type="text" placeholder="Hours" id="inputBox" />
          <button className="submitButton" type="button" onClick={this.submitTime} id="submitButton">Submit</button>
        </div>
        <h3 className="submitBlurb"> *This information is to help you and future users schedule their time</h3>
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  focus: reduxState.assignment.focus,
});

export default withRouter(connect(mapStateToProps, { postTime, changeStatus })(SubmitPage));
