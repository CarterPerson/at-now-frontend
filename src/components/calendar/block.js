import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import moment from 'moment';
import { updateBlock, deleteBlock } from '../../actions';
import Types from '../../types';
import './stylesheets/block.scss';

import Tooltip from './tooltip';

const calculateBounds = (block, dayStart, dayEnd, dayHeight) => ({
  top: ((block.start.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * dayHeight,
  height: ((block.end.getTime() - block.start.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * dayHeight,
});

const Block = (props) => {
  const [isDragging, setDragging] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const bounds = calculateBounds(
    {
      start: moment.max(moment(props.block.start), moment(props.dayStart)).toDate(),
      end: moment.min(moment(props.block.end), moment(props.dayEnd)).toDate(),
    }, props.dayStart, props.dayEnd, props.dayHeight,
  );

  const handleStart = () => {
    setDragging(true);
  };

  const handleStop = (e, { lastX, lastY }) => {
    setDragging(false);

    const timeOffset = (lastY - bounds.top) * ((props.dayEnd.getTime() - props.dayStart.getTime()) / props.dayHeight);
    const dayOffset = lastX / 35;

    if (timeOffset === 0 && dayOffset === 0) {
      props.onClick(e);
      return true;
    }

    const newStart = new Date(props.block.start);
    const newEnd = new Date(props.block.end);

    newStart.setTime(newStart.getTime() + timeOffset);
    newStart.setDate(newStart.getDate() + dayOffset);
    newEnd.setTime(newEnd.getTime() + timeOffset);
    newEnd.setDate(newEnd.getDate() + dayOffset);

    props.updateBlock({
      ...props.block,
      start: newStart,
      end: newEnd,
    });

    return false;
  };

  return (
    <>
      <Draggable
        grid={[(250 - (props.dayWidth * 7)) / 8 + props.dayWidth, 5]}
        position={{
          x: 0,
          y: bounds.top,
        }}
        onStart={handleStart}
        onStop={handleStop}
        disabled={!props.interactive}
      >
        <div
          className={`block ${props.type} ${isDragging ? 'dragging' : ''}`}
          id={`block-${props.block.id}`}
          style={{
            height: bounds.height,
            width: props.dayWidth,
          }}
          tabIndex={0}
          role="button"
          aria-label="event"
          onMouseMove={(e) => {
            props.onHover(e);

            if (props.interactive) {
              e.stopPropagation();
            }
          }}
          onClick={() => {
            setAnchor(document.getElementById(`block-${props.block.id}`));
            props.setPopoverOpen(true);
          }}
        />
      </Draggable>
      <Tooltip
        block={props.block}
        anchor={anchor}
        onClose={() => {
          setAnchor(null);
          props.setPopoverOpen(false);
        }}
        onDelete={() => props.deleteBlock(props.block)}
        onUpdate={(block) => props.updateBlock(block)}
      />
    </>
  );
};

Block.propTypes = {
  block: Types.Block.isRequired,
  dayStart: PropTypes.instanceOf(Date).isRequired,
  dayEnd: PropTypes.instanceOf(Date).isRequired,
  dayHeight: PropTypes.number.isRequired,
  dayWidth: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  setPopoverOpen: PropTypes.func,
};

Block.defaultProps = {
  interactive: false,
  onClick: () => {},
  onHover: () => {},
  setPopoverOpen: () => {},
};

const mapDispatchToProps = {
  updateBlock,
  deleteBlock,
};

export default connect(null, mapDispatchToProps)(Block);
