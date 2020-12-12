/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setUser, clearUser } from '../actions';
import './stylesheets/auth.scss';
import logo from '../icons/128.png';
import Loadable from './shared/loadable';

const Auth = (props) => {
  const [isIdentitySupported, setIdentitySupported] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const processTokenResponse = (googleToken) => {
    if (googleToken) {
      props.setUser({
        googleToken,
      });
    } else {
      props.clearUser();
      props.onDeauth();
    }
  };

  const handleAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      chrome.identity.getAuthToken({ interactive: false }, processTokenResponse);
    } else {
      props.clearUser();
      props.onDeauth();
    }
  };

  const triggerSignIn = () => {
    chrome.identity.getAuthToken({ interactive: true }, processTokenResponse);
  };

  useEffect(() => {
    let unlisten;

    if (!isLoaded) {
      if (chrome?.identity) {
        // * USE CHROME IDENTITY API (PROD)
        setIdentitySupported(true);

        chrome.identity.getAuthToken({ interactive: false }, (token) => {
          processTokenResponse(token);
        });

        unlisten = chrome.identity.onSignInChanged.addListener(handleAuthChange);

        setLoaded(true);
      }
    }

    return unlisten ? unlisten() : undefined;
  });

  useEffect(() => {
    if (props.auth?.user?.jwt) {
      props.onAuth();
    }
  }, [props.auth?.user]);

  return (
    <Loadable loaded={(props.auth.user == null || props.auth.user?.jwt) && isLoaded}>
      {props.auth.user?.jwt
        ? props.children
        : (
          <div className="auth">
            <img src={logo} alt="Logo" width="50" height="50" />
            <p> Welcome to at-now! </p>
            {isIdentitySupported
              ? (
                <button
                  className="auth-signin btn btn-light"
                  type="button"
                  onClick={triggerSignIn}
                >
                  Sign in with Google
                </button>
              ) : 'This context is not supported'}
          </div>
        )}
    </Loadable>
  );
};

Auth.propTypes = {
  onAuth: PropTypes.func,
  onDeauth: PropTypes.func,
};

Auth.defaultProps = {
  onAuth: () => console.log('authenticated'),
  onDeauth: () => console.log('deauthenticated'),
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  setUser,
  clearUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
