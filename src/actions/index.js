import Auth from './auth';
import Calendar from './calendar';
import Assignment from './assignment';

export const ActionTypes = {
  ...Auth.ActionTypes,
  ...Calendar.ActionTypes,
  ...Assignment.ActionTypes,
};

export const {
  setUser,
  clearUser,
} = Auth.actions;

export const {
  makeCalendar,
  addBlocks,
  setCal,
  storeAtNowCal,
  loadAtNowCal,
  updateBlock,
  deleteBlock,
  setBlocks,
  checkSchedule,
  makeEvent,
  getRecommendation,
} = Calendar.actions;

export const {
  fetchAssignments,
  postICS,
  postTime,
  setFocus,
  hasICS,
  changeStatus,
} = Assignment.actions;
