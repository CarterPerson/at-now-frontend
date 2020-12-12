import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import Types from '../../types';
import Check from '../../images/check.svg';
import Cross from '../../images/cross.svg';
import './stylesheets/tooltip.scss';

const calculateDuration = (block) => (
  block.end.getTime() - block.start.getTime()
);

const updateDuration = (block, durationDelta) => ({
  ...block,
  start: new Date(block.start.getTime() - (durationDelta / 2)),
  end: new Date(block.end.getTime() + (durationDelta / 2)),
});

const Tooltip = (props) => (
  <div className="tooltip">
    <Popover
      open={props.anchor != null}
      anchorEl={props.anchor}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
    >
      <div className="tooltip-container">
        <div className="tooltip-duration">
          <input
            id={`tooltip-${props.block.id}`}
            type="number"
            defaultValue={calculateDuration(props.block) / 3600000}
          />
          hours
        </div>
        <div className="tooltip-actions">
          <button
            type="button"
            alt="delete"
            onClick={() => {
              props.onClose();
              props.onDelete();
            }}
          >
            <img
              src={Cross}
              alt=""
            />
          </button>
          <button
            type="button"
            alt="save"
            onClick={() => {
              const { value } = document.getElementById(`tooltip-${props.block.id}`);
              props.onUpdate(updateDuration(props.block, (value * 3600000) - calculateDuration(props.block)));
              props.onClose();
            }}
          >
            <img
              src={Check}
              alt=""
            />
          </button>
        </div>
      </div>
    </Popover>
  </div>
);

Tooltip.propTypes = {
  block: Types.Block.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Tooltip;
