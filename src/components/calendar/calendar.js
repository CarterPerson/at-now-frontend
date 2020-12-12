import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Types from '../../types';
import './stylesheets/calendar.scss';

import Day from './day';

const getCurrentWeek = (day) => {
  if (!day) {
    return [];
  }

  const zeroes = { minute: 0, second: 0, millisecond: 0 };

  return [0, 1, 2, 3, 4, 5, 6].reduce((week, dayOfWeek) => {
    week.push({
      start: moment().day(dayOfWeek).set({ hour: day.start, ...zeroes }).toDate(),
      end: moment().day(dayOfWeek).set({ hour: day.end, ...zeroes }).toDate(),
    });

    return week;
  }, []);
};

const filterCurrentDay = (blocks, start, end) => (
  blocks.filter((block) => (
    moment(block.start).isBetween(moment(start), moment(end))
    || moment(block.end).isBetween(moment(start), moment(end))
    || (block.start < start && block.end > end)
  ))
);

const Calendar = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className={`calendar ${popoverOpen ? 'faded' : ''}`}>
      {getCurrentWeek(props.config.day).map(({ start, end }) => (
        <Day
          key={String(start.getTime())}
          start={start}
          end={end}
          busy={filterCurrentDay(props.busy, start, end)}
          blocks={filterCurrentDay(props.blocks, start, end)}
          createEvent={props.createEvent}
          setPopoverOpen={setPopoverOpen}
        />
      ))}
    </div>
  );
};

Calendar.propTypes = {
  busy: PropTypes.arrayOf(Types.Block),
  blocks: PropTypes.arrayOf(Types.Block),
  createEvent: PropTypes.func,
};

Calendar.defaultProps = {
  busy: [],
  blocks: [],
  createEvent: () => {},
};

const mapStateToProps = (state) => ({
  busy: state.calendar.busy,
  blocks: state.calendar.blocks,
  config: state.calendar.config,
});

export default connect(mapStateToProps, null)(Calendar);
