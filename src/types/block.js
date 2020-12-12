import PropTypes from 'prop-types';

const Block = PropTypes.shape({
  id: PropTypes.string.isRequired,
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
});

export default Block;
