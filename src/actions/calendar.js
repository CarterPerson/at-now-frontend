/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import moment from 'moment';
// eslint-disable-next-line
import shortid from 'shortid';

const axios = require('axios');

const ActionTypes = {
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  DELETE_BLOCK: 'DELETE_BLOCK',
  SET_BLOCKS: 'SET_BLOCKS',
  GET_CAL: 'GET_CAL',
  ERROR: 'ERROR',
  ADD_BLOCKS: 'ADD_BLOCKS',
  LOAD_CAL: 'LOAD_CAL',
  STORE_CAL: 'STORE_CAL',
  MAKE_CAL: 'MAKE_CAL',
  CHECK_SCH: 'CHECK_SCH',
  MAKE_EVE: 'MAKE_EVE',
  SET_RECOMMENDATION: 'SET_RECOMMENDATION',
};

function fbObjMaker(data) { // Make object that can be used in FB query
  console.log(data);
  const start = moment().toDate();
  const end = moment().add(7, 'days').toDate();
  const calObject = {
    timeMin: start, // Start time of check, Date()
    timeMax: end, // End time of check, Date()
    items: [
      {
        id: data, // CalendarID
      },
    ],
  };
  return calObject;
}

function eventObjMaker(startT, endT, sum, des = '') { // Takes in params to make event object
  const calEvent = {
    summary: `${sum} ~ @now`,
    description: des,
    colorId: 10, // Possible colors of 1-11, 10 is Dark Green
    start: {
      dateTime: startT,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endT,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
  return calEvent;
}

function loadAtNowCal(jwt) { // Loads current At-Now Calendar from DB
  return (dispatch) => new Promise((resolve, reject) => {
    const config = { headers: { authorization: jwt } }; // Tokens + Authorization
    const payload = { jwt };
    console.log('Here is the jwt object:');
    console.log(config);
    console.log(payload);
    chrome.runtime.sendMessage({ type: 'LOAD_CAL', payload }, (res) => { // passes type and object to chrome
      if (res) {
        dispatch({
          type: ActionTypes.LOAD_CAL, // Redux Return
          payload: res,
        });
        resolve();
      }
      dispatch({
        type: ActionTypes.ERROR,
      });
      reject();
    });
  });
}

function checkSchedule(userID) { // Uses FreeBusy query on calendar based off event
  return (dispatch, getState) => {
    const { calendarString } = getState().calendar.calID;
    const event = fbObjMaker(calendarString); // will have to be split up body objects
    const config = { headers: { Authorization: `Bearer ${userID}` } }; // Tokens + Authorization
    const searchObject = {
      token: config,
      time: event,
    };
    console.log('The search object is:', searchObject);
    chrome.runtime.sendMessage({ type: 'CHECK_SCH', searchObject }, (res) => {
      console.log('Res is: ', res);
      const busy = res[calendarString].busy.map((e) => ({ // may need little help on this part because not always going to primairy path
        id: shortid.generate(),
        start: new Date(e.start),
        end: new Date(e.end),
      }));
      console.log(busy);
      dispatch({
        type: ActionTypes.CHECK_SCH,
        payload: busy,
      });
    });
  };
}

function storeAtNowCal(jwt, id) { // Stores the At-Now Calendar in DB
  console.log('Before Dispatch');
  return (dispatch) => {
    const config = { headers: { authorization: jwt } }; // Tokens + Authorization
    const calObj = {
      auth: config,
      calID: id,
    };
    console.log('Im in storeatnow');
    chrome.runtime.sendMessage({ type: 'STORE_CAL', calObj }, (res) => {
      dispatch({
        type: ActionTypes.STORE_CAL, // Redux Return
        payload: id,
      });
    });
  };
}

function makeCalendar(userID, jwt) {
  return (dispatch) => {
    console.log(userID);
    const config = { headers: { Authorization: `Bearer ${userID}` } }; // Tokens + Authorization
    chrome.runtime.sendMessage({ type: 'MAKE_CAL', config }, (res) => { // passes type and object to chrome
      dispatch(storeAtNowCal(jwt, res.id));
      dispatch({
        type: ActionTypes.MAKE_CAL, // Redux Return
        payload: res.id,
      });
    });
  };
}

function setCal(data) { // Takes stored Item and sets it
  return {
    type: ActionTypes.GET_CAL,
    payload: data,
  };
}

function makeEvent(calID, event, userID) { // Makes an event on user Calendar
  return (dispatch) => {
    const scheduledEvent = eventObjMaker(event.start, event.end, event.title, event.link);
    const config = { headers: { Authorization: `Bearer ${userID}` } }; // Tokens + Authorization
    const eveObject = {
      token: config,
      time: scheduledEvent,
      calendar: calID,
    };
    console.log('Event Object: ');
    console.log(eveObject);
    chrome.runtime.sendMessage({ type: 'MAKE_EVE', eveObject }, (res) => { // passes type and object to chrome
      console.log('Res is: ', res);
      const startTime = Date(res.start.dateTime);
      const endTime = Date(res.end.dateTime);
      const idVal = shortid.generate();
      dispatch({
        type: ActionTypes.MAKE_EVE, // Redux Return
        payload: { start: startTime, end: endTime, id: idVal },
      });
    });
  };
} // On init get primary calendar, go to busy times, upload busy times to busy in redux
// on click, add to blocks after running through make event

function updateBlock(block) {
  return {
    type: ActionTypes.UPDATE_BLOCK,
    payload: block,
  };
}

function deleteBlock(block) {
  return {
    type: ActionTypes.DELETE_BLOCK,
    payload: block.id,
  };
}

function setBlocks(blocks) {
  return {
    type: ActionTypes.SET_BLOCKS,
    payload: blocks,
  };
}

function addBlocks(blocks) {
  console.log(blocks);
  return {
    type: ActionTypes.ADD_BLOCKS,
    payload: blocks,
  };
}

function getRecommendation(assignmentId) {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const { jwt } = getState().auth?.user;

    chrome.runtime.sendMessage({ type: 'GET_RECOMMENDATION', data: { jwt, assignmentId } }, (rec) => {
      if (rec) {
        dispatch({
          type: ActionTypes.SET_RECOMMENDATION,
          payload: rec,
        });

        resolve();
      } else {
        reject();
      }
    });
  });
}

const Calendar = {
  ActionTypes,
  actions: {
    storeAtNowCal,
    loadAtNowCal,
    makeCalendar,
    updateBlock,
    deleteBlock,
    setBlocks,
    addBlocks,
    checkSchedule,
    makeEvent,
    setCal,
    getRecommendation,
  },
};

export default Calendar;
