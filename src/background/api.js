/* eslint-disable no-undef */
import axios from 'axios';

import {
  API_ROOT, API_SIGNUP, API_SIGNIN, API_ASSIGNMENTS, API_ICSCHECK, API_RECOMMEND, API_STATUS, API_STATUSUPDATE,
} from '../config';

const ROOT = 'https://www.googleapis.com/calendar/v3/'; // General Root
const GET_CAL = 'calendars/primary/'; // Specific Paths
const CAL = 'calendars';
const FB = 'freeBusy';

// * SIGNUP

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'API_SIGNUP') {
      const { googleToken } = request;

      axios.post(API_ROOT + API_SIGNUP, { accessToken: googleToken })
        .then((res) => {
          sendResponse(res.data?.jwt || { err: 'No JWT returned' });
        })
        .catch((err) => {
          sendResponse({ err });
        });

      return true;
    }

    return false;
  },
);

// * SIGNIN

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'API_SIGNIN') {
      const { googleToken } = request;

      axios.post(API_ROOT + API_SIGNIN, { accessToken: googleToken })
        .then((res) => {
          sendResponse({ jwt: res.data?.jwt } || { err: 'No JWT returned' });
        })
        .catch((err) => {
          sendResponse({ err });
        });

      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'FETCH_ASSIGNMENTS') {
      axios.get(API_ROOT + API_ASSIGNMENTS, { headers: { authorization: request.jwt } })
        .then((res) => {
          sendResponse(res.data || { err: 'No assignment list returned' });
        })
        .catch((err) => {
          sendResponse({ err });
        });
      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'CHECK_SCH') {
      const { searchObject } = request;

      axios.post(ROOT + FB, searchObject.time, searchObject.token)
        .then((response) => {
          sendResponse(response.data.calendars);
        })
        .catch((err) => {
          sendResponse({ err });
        });

      return true;
    }
    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'MAKE_EVE') {
      const { eveObject } = request;
      // May need to adjust the calid eventually
      axios.post(`${ROOT + CAL}/${eveObject.calendar.calendarString}/events`, eveObject.time, eveObject.token)
        .then((response) => {
          sendResponse(response.data);
        })
        .catch((err) => {
          sendResponse('Error');
        });
      return true;
    }
    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'MAKE_CAL') {
      const { config } = request;
      // May need to adjust the calid (At-Now)
      axios.post(ROOT + CAL, { summary: 'At-Now' }, config)
        .then((response) => {
          sendResponse(response.data);
        })
        .catch((err) => {
          sendResponse({ err });
        });
      return true;
    }
    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'GET_CAL') {
      const { config } = request;
      // May need to adjust the calid (At-Now)
      axios.get(ROOT + GET_CAL, config)
        .then((response) => {
          sendResponse(response.data);
        })
        .catch((err) => {
          sendResponse({ err });
        });
      return true;
    }
    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'POST_ICS') {
      chrome.storage.local.get(['atnow'], ({ atnow }) => {
        const { jwt } = atnow;
        axios.post(API_ROOT + API_ASSIGNMENTS, { calendar_link: request.payload.ics }, { headers: { authorization: jwt } })
          .then((res) => {
            sendResponse(res || { err: 'Nothing returned from posting ICS' });
          })
          .catch((err) => {
            sendResponse({ err });
          });
      });
      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'POST_TIME') {
      const payload = {
        id: request.id,
        time: request.time,
      };
      axios.post(API_ROOT + API_STATUS, payload, { headers: { authorization: request.payload.token } })
        .then((res) => {
          sendResponse(res.data || { err: 'Nothing returned from time' });
        })
        .catch((err) => {
          sendResponse({ err });
        });
      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'HAS_ICS') {
      const { token } = request;
      axios.get(API_ROOT + API_ICSCHECK, { headers: { authorization: token } })
        .then((res) => {
          sendResponse(res.data || { err: 'Nothing returned from time' });
        })
        .catch((err) => {
          sendResponse({ err });
        });
      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'LOAD_CAL') {
      const token = request.payload.jwt;
      console.log(token);
      axios.get(`${API_ROOT}/calendar`, { headers: { authorization: token } })
        .then((res) => {
          sendResponse(res.data);
        })
        .catch((error) => {
          sendResponse();
        });
      return true;
    }
    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'STORE_CAL') {
      const { calID, auth } = request.calObj;
      axios.post(`${API_ROOT}/calendar`, { calendarString: calID }, auth)
        .then((res) => {
          sendResponse(res.data);
        })
        .catch((error) => {
          sendResponse({ err });
        });
      return true;
    }
    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'GET_RECOMMENDATION') {
      const { jwt, assignmentId } = request.data;

      axios.post(API_ROOT + API_RECOMMEND, { id: assignmentId }, { headers: { authorization: jwt } })
        .then((res) => {
          sendResponse(res.data?.hours ? res.data.hours * 3600000 : null);
        })
        .catch((err) => {
          console.log(err);
          sendResponse();
        });

      return true;
    }

    return false;
  },
);

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.type === 'CHANGE_STATUS') {
      axios.post(API_ROOT + API_STATUSUPDATE, { id: request.payload.id, status: request.payload.status }, { headers: { authorization: request.payload.token } })
        .then((res) => {
          sendResponse('success!');
        })
        .catch((err) => {
          console.log(err);
          sendResponse();
        });

      return true;
    }

    return false;
  },
);
