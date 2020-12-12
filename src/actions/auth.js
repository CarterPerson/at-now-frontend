/* eslint-disable no-undef */
const ActionTypes = {
  SET_USER: 'SET_USER',
  CLR_USER: 'CLR_USER',
  SIGN_UP: 'SIGN_UP',
  SIGN_IN: 'SIGN_IN',
};

function signup(googleToken) {
  return (dispatch) => {
    chrome.runtime.sendMessage({ type: 'API_SIGNUP', googleToken }, (jwt) => {
      dispatch({
        type: ActionTypes.SIGN_UP,
        payload: jwt,
      });
    });
  };
}

function signin(googleToken) {
  return (dispatch) => {
    chrome.runtime.sendMessage({ type: 'API_SIGNIN', googleToken }, ({ jwt }) => {
      if (!jwt) {
        dispatch(signup(googleToken));
      } else {
        dispatch({
          type: ActionTypes.SIGN_IN,
          payload: jwt,
        });
      }
    });
  };
}

function setUser(user) {
  return (dispatch) => {
    // initiate signin/signup flow
    dispatch(signin(user.googleToken));

    // set google token in redux
    dispatch({
      type: ActionTypes.SET_USER,
      payload: user,
    });
  };
}

function clearUser() {
  return {
    type: ActionTypes.CLR_USER,
  };
}

const Auth = {
  ActionTypes,
  actions: {
    setUser,
    clearUser,
    signup,
    signin,
  },
};

export default Auth;
