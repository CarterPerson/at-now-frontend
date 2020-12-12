/* eslint-disable no-undef */
import { ActionTypes } from '../actions';

const initialState = {
  user: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };

    case ActionTypes.CLR_USER:
      return { ...state, user: null };

    case ActionTypes.SIGN_UP:
    case ActionTypes.SIGN_IN:
      chrome.storage.local.set({ atnow: { jwt: action.payload } }, () => {
        console.log('saved key to local storage');
      });

      return { ...state, user: { jwt: action.payload, ...state.user } };

    default:
      return state;
  }
};

export default AuthReducer;
