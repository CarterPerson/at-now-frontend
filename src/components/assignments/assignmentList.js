import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Collapse } from 'react-collapse';
import moment from 'moment-timezone';
import './stylesheets/assignmentList.scss';
import { fetchAssignments, setFocus } from '../../actions';
import RightArrow from '../../images/right.svg';

import AssignmentListItem from './assignmentListItem';

class AssignmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unscheduledThisWeekOpen: true,
      scheduledOpen: true,
      allUnscheduledOpen: true,
      completedOpen: true,
    };
  }

  componentDidMount() {
    this.props.fetchAssignments();
  }

  openAssignment = (id) => {
    this.props.history.push(`/assignments/${id}`);
  }

  toggleSection = (section) => {
    this.setState((prevState) => ({
      [section]: !prevState[section],
    }));
  }

  isUnscheduledThisWeek = (assignment) => {
    const due = moment(assignment.end);
    return due > moment() && due < moment().day(moment().day() + 7) && assignment.status === 'unscheduled';
  }

  isScheduled = (assignment) => (
    assignment.status === 'scheduled'
  );

  isUnscheduled = (assignment) => (
    assignment.status === 'unscheduled'
  );

  isCompleted = (assignment) => (
    assignment.status === 'completed'
  )

  render() {
    return (
      <div className="assignmentList">
        <div className={`assignmentList-section-header ${this.state.unscheduledThisWeekOpen ? 'open' : 'closed'}`}>
          <button
            type="button"
            alt="Expand Section"
            onClick={() => this.toggleSection('unscheduledThisWeekOpen')}
          >
            <img
              src={RightArrow}
              alt=""
            />
          </button>
          Unscheduled This Week
        </div>
        <Collapse isOpened={this.state.unscheduledThisWeekOpen}>
          <div className="assignmentList-section-content">
            {(this.props.assignments?.filter((assn) => this.isUnscheduledThisWeek(assn)) || []).map((assignment) => (
              <AssignmentListItem
                key={assignment._id}
                assignment={assignment}
                onClick={() => this.openAssignment(assignment._id)}
              />
            ))}
          </div>
        </Collapse>
        <div className={`assignmentList-section-header ${this.state.scheduledOpen ? 'open' : 'closed'}`}>
          <button
            type="button"
            alt="Expand Section"
            onClick={() => this.toggleSection('scheduledOpen')}
          >
            <img
              src={RightArrow}
              alt=""
            />
          </button>
          Scheduled
        </div>
        <Collapse isOpened={this.state.scheduledOpen}>
          <div className="assignmentList-section-content">
            {(this.props.assignments?.filter((assn) => this.isScheduled(assn)) || []).map((assignment) => (
              <AssignmentListItem
                key={assignment._id}
                assignment={assignment}
                onClick={() => this.openAssignment(assignment._id)}
              />
            ))}
          </div>
        </Collapse>
        <div className={`assignmentList-section-header ${this.state.allUnscheduledOpen ? 'open' : 'closed'}`}>
          <button
            type="button"
            alt="Expand Section"
            onClick={() => this.toggleSection('allUnscheduledOpen')}
          >
            <img
              src={RightArrow}
              alt=""
            />
          </button>
          All Unscheduled
        </div>
        <Collapse isOpened={this.state.allUnscheduledOpen}>
          <div className="assignmentList-section-content">
            {(this.props.assignments?.filter((assn) => this.isUnscheduled(assn)) || []).map((assignment) => (
              <AssignmentListItem
                key={assignment._id}
                assignment={assignment}
                onClick={() => this.openAssignment(assignment._id)}
              />
            ))}
          </div>
        </Collapse>
        <div className={`assignmentList-section-header ${this.state.completedOpen ? 'open' : 'closed'}`}>
          <button
            type="button"
            alt="Expand Section"
            onClick={() => this.toggleSection('completedOpen')}
          >
            <img
              src={RightArrow}
              alt=""
            />
          </button>
          Completed
        </div>
        <Collapse isOpened={this.state.completedOpen}>
          <div className="assignmentList-section-content">
            {(this.props.assignments?.filter((assn) => this.isCompleted(assn)) || []).map((assignment) => (
              <AssignmentListItem
                key={assignment._id}
                assignment={assignment}
                onClick={() => this.openAssignment(assignment._id)}
              />
            ))}
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return ({
    assignments: state.assignment.assignments.sort((a, b) => new Date(a.end) - new Date(b.end)),
  });
};

export default withRouter(connect(mapStateToProps, { fetchAssignments, setFocus })(AssignmentList));
