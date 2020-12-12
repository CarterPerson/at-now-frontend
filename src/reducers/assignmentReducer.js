import { ActionTypes } from '../actions';

const initialState = {
  assignments: [],
  focus: null,
  hasICS: false,
};

const assignmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.POST_ICS:
      if (!action.payload.err) {
        return { ...state, hasICS: true };
      } else {
        return { ...state, hasICS: false };
      }

    case ActionTypes.FETCH_ASSIGNMENTS:
      return { ...state, assignments: action.payload };

    case ActionTypes.POST_TIME:
      return state;

    case ActionTypes.SET_FOCUS:
      return { ...state, focus: action.payload };

    case ActionTypes.HAS_ICS:
      return { ...state, hasICS: true };

    default:
      return state;
  }
};

export default assignmentReducer;
