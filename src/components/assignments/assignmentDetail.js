/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import moment from 'moment';
import {
  setBlocks, getRecommendation, makeEvent, changeStatus, addBlocks,
} from '../../actions';
import recommendTimes from '../../scripts/timeRecommender';
import Calendar from '../calendar/calendar';
import './stylesheets/assignmentDetail.scss';
import leftVector from '../../images/leftVector.png';

class AssignmentDetail extends Component {
  componentDidMount() {
    this.props.getRecommendation(this.props.assignment._id)
      .then(() => {
        const blocks = recommendTimes(this.props.recommendedDuration / 3600000, this.props.busy, this.props.assignment.end);
        this.props.setBlocks(blocks || []);
      })
      .catch((err) => console.log('failed to get time recommendation for', this.props.assignment, err));
  }

  openInCanvas = () => {
    // eslint-disable-next-line no-undef
    chrome.tabs.create({ url: this.props.assignment.courseUrl });
  }

  onSave = () => {
    const blockArray = this.props.blocks;
    blockArray.forEach((data) => {
      console.log(data);
      const newObj = { ...data, title: this.props.assignment.summaryObject.assignmentSummary, link: this.props.assignment.courseUrl };
      this.props.makeEvent(this.props.calID, newObj, this.props.googleToken);
    });
    this.props.setBlocks([]);
    this.props.changeStatus(this.props.assignment._id, 'scheduled', this.props.history);
  }

  onSubmit = () => {
    this.props.history.push(`/assignments/${this.props.assignment._id}/submit`);
  }

  render() {
    return (
      <div className="assignmentDetail">
        <div className="headerBox">
          <img className="backArrow" src={leftVector} onClick={() => this.props.history.push('/assignments')} alt="" />
          <div
            className="assignmentDetail-title"
            role="button"
            tabIndex={0}
            onClick={this.openInCanvas}
          >
            {this.props.assignment.summary.split('[')[0].trim()}
          </div>
        </div>
        <div className="assignmentDetail-summary">
          Estimated Time: {this.props.recommendedDuration / 3600000} hours <br />
          Status: {this.props.assignment.status} <br />
          Due: {moment(this.props.assignment.end).format('lll')}
        </div>
        <Calendar
          createEvent={(event) => this.props.addBlocks({
            ...event,
            id: shortid.generate(),
          })}
        />
        <div className="buttonContainer">
          <button
            className="assignmentDetail-submit"
            type="button"
            alt="Submit"
            onClick={this.onSave}
          >
            Save
          </button>
          <button
            className="assignmentDetail-submit"
            type="button"
            alt="Submit"
            onClick={this.onSubmit}
          >
            Finished
          </button>

        </div>

      </div>
    );
  }
}

AssignmentDetail.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  busy: state.calendar.busy,
  googleToken: state.auth.user.googleToken,
  calID: state.calendar.calID,
  blocks: state.calendar.blocks,
  assignment: state.assignment.assignments.find((assn) => assn._id === ownProps.id),
  recommendedDuration: state.calendar.recommendedDuration,
});

const mapDispatchToProps = {
  setBlocks,
  addBlocks,
  makeEvent,
  getRecommendation,
  changeStatus,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AssignmentDetail));
