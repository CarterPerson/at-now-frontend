import React from 'react';
import PropTypes from 'prop-types';
import stringHash from 'string-hash';
import './stylesheets/assignmentListItem.scss';
import RightArrow from '../../images/right.svg';

const courseSummaryRegex = /(.*)\[([^.]*.[^.]*)(.*)\]/i;

const getColor = (courseName) => {
  console.log(stringHash(courseName));
  switch (stringHash(courseName) % 4) {
    case 0: return '#8FD783';
    case 1: return '#29631e';
    case 2: return '#00B8FF';
    case 3: return '#006BD1';
    default: return 'grey';
  }
};

const AssignmentListItem = (props) => {
  // parse impt data from assn summary
  const [, title, course] = courseSummaryRegex.exec(props.assignment.summary);

  return (
    <button
      className="assignmentListItem"
      type="button"
      onClick={props.onClick}
    >
      <div className="assignmentListItem-title">{title}</div>
      <div
        className="assignmentListItem-course"
        style={{ backgroundColor: getColor(course) }}
      >
        {course.split('-')[0]}
      </div>
      <img
        className="assignmentListItem-icon"
        src={RightArrow}
        alt="open"
      />
    </button>
  );
};

AssignmentListItem.propTypes = {
  assignment: PropTypes.shape({
    summary: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AssignmentListItem;
