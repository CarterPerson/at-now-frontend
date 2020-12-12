import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Types from '../../types';
import './stylesheets/day.scss';

import Block from './block';

const DAY_HEIGHT = 135;
const DAY_WIDTH = 30;

const getTitle = (start) => {
  switch (start.getDay()) {
    case 0: return 'Sun';
    case 1: return 'Mon';
    case 2: return 'Tue';
    case 3: return 'Wed';
    case 4: return 'Thu';
    case 5: return 'Fri';
    case 6: return 'Sat';
    default: return 'Err';
  }
};

const bodyRef = React.createRef();

const generatePlaceholder = (mouseY, placeholderDuration, start, end) => {
  const { top } = bodyRef.current.getBoundingClientRect();

  const mouseDate = ((end.getTime() - start.getTime()) * (((mouseY - top) - ((mouseY - top) % 5)) / DAY_HEIGHT)) + start.getTime();
  const startDate = new Date(mouseDate - (placeholderDuration / 2));
  const endDate = new Date(mouseDate + (placeholderDuration / 2));

  return {
    id: 'proposed',
    start: moment.max(moment(startDate), moment(start)).toDate(),
    end: moment.min(moment(endDate), moment(end)).toDate(),
  };
};

const Day = (props) => {
  const [isHovering, setHovering] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  return (
    <div
      className="day"
    >
      <div className="day-title">
        {getTitle(props.start)}
      </div>
      <div
        ref={bodyRef}
        className="day-body"
        style={{
          height: DAY_HEIGHT,
          width: DAY_WIDTH,
        }}
        tabIndex={0}
        role="button"
        onClick={() => {
          if (isHovering && !popoverOpen) {
            props.createEvent(generatePlaceholder(mouseY, props.recommendedDuration, props.start, props.end));
          }
        }}
        onMouseMove={(e) => { setHovering(true); setMouseY(e.clientY); }}
        onMouseLeave={() => setHovering(false)}
      >
        {props.busy.map((block) => (
          <Block
            key={`block-busy-${block.start.getTime()}`}
            block={block}
            dayStart={props.start}
            dayEnd={props.end}
            dayHeight={DAY_HEIGHT}
            dayWidth={DAY_WIDTH}
            type="busy"
          />
        ))}
        {props.blocks.map((block) => (
          <Block
            key={`block-event-${block.start.getTime()}`}
            block={block}
            dayStart={props.start}
            dayEnd={props.end}
            dayHeight={DAY_HEIGHT}
            dayWidth={DAY_WIDTH}
            type="event"
            interactive
            onHover={() => setHovering(false)}
            onClick={() => console.log('event clicked')}
            setPopoverOpen={(open) => {
              setPopoverOpen(open);
              props.setPopoverOpen(open);

              if (open) {
                setHovering(false);
              }
            }}
          />
        ))}
        {isHovering && !popoverOpen
          ? (
            <Block
              block={generatePlaceholder(mouseY, props.recommendedDuration, props.start, props.end)}
              dayStart={props.start}
              dayEnd={props.end}
              dayHeight={DAY_HEIGHT}
              dayWidth={DAY_WIDTH}
              type="proposed"
            />
          ) : null}
      </div>
    </div>
  );
};

Day.propTypes = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  busy: PropTypes.arrayOf(Types.Block),
  blocks: PropTypes.arrayOf(Types.Block),
  setPopoverOpen: PropTypes.func,
  recommendedDuration: PropTypes.number,
  createEvent: PropTypes.func,
};

Day.defaultProps = {
  busy: [],
  blocks: [],
  recommendedDuration: 0,
  createEvent: (event) => console.log('creating event', event),
  setPopoverOpen: () => {},
};

const mapStateToProps = (state) => ({
  recommendedDuration: state.calendar.recommendedDuration,
});

export default connect(mapStateToProps, null)(Day);
