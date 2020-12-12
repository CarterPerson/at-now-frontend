// eslint-disable-next-line
import moment from 'moment-timezone';

import { ActionTypes } from '../actions';

const startDate = new Date();
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 1);

const initialState = {
  calID: { calendarString: 'primary' },
  busy: [],
  blocks: [], // Blocks when user schedules
  config: {
    day: {
      start: 8,
      end: 22,
    },
  },
  recommendedDuration: 3600000,
};

const CalendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_BLOCK:
      return { ...state, blocks: [...state.blocks.filter((block) => block.id !== action.payload.id), action.payload] };
    case ActionTypes.DELETE_BLOCK:
      return { ...state, blocks: state.blocks.filter((block) => block.id !== action.payload) };
    case ActionTypes.SET_BLOCKS:
      return { ...state, blocks: action.payload };
    case ActionTypes.ADD_BLOCKS:
      return { ...state, blocks: state.blocks.concat(action.payload) };
    case ActionTypes.MAKE_CAL:
      return { ...state, calID: action.payload };
    case ActionTypes.GET_CAL:
      return { ...state, calID: action.payload };
    case ActionTypes.CHECK_SCH:
      return { ...state, busy: state.busy.concat(action.payload) };
    case ActionTypes.MAKE_EVE:
      return {
        ...state,
        blocks: [...state.blocks, {
          ...action.payload,
          start: moment.tz(action.payload.start.dateTime, action.payload.start.timeZone).toDate(),
          end: moment.tz(action.payload.end.dateTime, action.payload.end.timeZone).toDate(),
          id: action.payload.id,
        }],
      }; // append onto block list
    case ActionTypes.STORE_CAL:
      return { ...state, calID: action.payload };
    case ActionTypes.LOAD_CAL:
      return { ...state, calID: action.payload };
    case ActionTypes.ERROR:
      return state;
    case ActionTypes.SET_RECOMMENDATION:
      return { ...state, recommendedDuration: action.payload };
    default:
      return state;
  }
};

export default CalendarReducer;
