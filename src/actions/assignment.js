/* eslint-disable no-undef */
const ActionTypes = {
  FETCH_ASSIGNMENTS: 'FETCH_ASSIGNMENTS',
  POST_ICS: 'POST_ICS',
  POST_TIME: 'POST_TIME',
  SET_FOCUS: 'SET_FOCUS',
  HAS_ICS: 'HAS_ICS',
  CHANGE_STATUS: 'CHANGE_STATUS',
};

function fetchAssignments() {
  console.log(' fetching Assignments');
  return (dispatch, getState) => {
    const { jwt } = getState().auth.user;
    console.log(getState());
    chrome.runtime.sendMessage({ type: 'FETCH_ASSIGNMENTS', jwt }, (assignments) => {
      dispatch({
        type: ActionTypes.FETCH_ASSIGNMENTS,
        payload: assignments,
      });
    });
  };
}

function postICS(link) {
  return (dispatch, getState) => {
    const payload = {
      ics: link,
      token: getState().auth.user.jwt,
    };

    chrome.runtime.sendMessage({ type: 'POST_ICS', payload }, (res) => {
      dispatch({
        type: ActionTypes.POST_ICS,
        payload: res,
      });
    });
  };
}

function postTime(id, time) {
  return (dispatch, getState) => {
    const payload = {
      id,
      time,
      token: getState().auth.user.jwt,
    };

    chrome.runtime.sendMessage({ type: 'POST_TIME', payload }, (res) => {
      dispatch({
        type: ActionTypes.POST_TIME,
        payload: res,
      });
    });
  };
}

// "assignment/statusupdate"
function changeStatus(id, status, history) {
  return (dispact, getState) => {
    const payload = {
      id,
      status,
      token: getState().auth.user.jwt,
    };

    chrome.runtime.sendMessage({ type: 'CHANGE_STATUS', payload }, (res) => {
      history.push('/assignments');
    });
  };
}

function setFocus(assignment) {
  return (dispatch) => {
    dispatch({ type: 'SET_FOCUS', payload: assignment });
  };
}

function hasICS(extensionHistory) {
  return (dispatch, getState) => {
    const token = getState().auth.user.jwt;
    console.log(token, 'token');
    console.log('sending message to check for ICS');

    chrome.runtime.sendMessage({ type: 'HAS_ICS', token }, (res) => {
      if (res.ICS) {
        extensionHistory.push('/assignments');
      } else if (res.err.message.localeCompare('Request failed with status code 404') === 0) {
        extensionHistory.push('/calendarReq');
      }

      dispatch({
        type: ActionTypes.HAS_ICS,
        payload: res,
      });
    });
  };
}

const Assignment = {
  ActionTypes,
  actions: {
    fetchAssignments,
    postICS,
    postTime,
    setFocus,
    hasICS,
    changeStatus,
  },
};

export default Assignment;
