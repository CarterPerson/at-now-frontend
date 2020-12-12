import { combineReducers } from 'redux';

import AuthReducer from './authReducer';
import CalendarReducer from './calendarReducer';
import assignmentReducer from './assignmentReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  calendar: CalendarReducer,
  assignment: assignmentReducer,
});

export default rootReducer;
