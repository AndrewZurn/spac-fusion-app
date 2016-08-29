import {Map, fromJS} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as UserService from '../../services/userService';

const _TEST_AUTH0_USER_ID = '123454321';

// Initial state
const initialState = Map({
  loading: false,
  isLoggedIn: false,
  currentUser: null,
  authenticationToken: null,
  fusionUser: null
});

// Actions
const USER_LOGIN_SUCCESS = 'AppState/USER_LOGIN_SUCCESS';
const USER_LOGIN_ERROR = 'AppState/USER_LOGIN_ERROR';

const GET_FUSION_USER_REQUEST = 'AppState/GET_FUSION_USER_REQUEST';
const GET_FUSION_USER_RESPONSE = 'AppState/GET_FUSION_USER_RESPONSE';

export function onUserLoginSuccess(profile, token) {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: {
      profile: fromJS(profile),
      token: fromJS(token)
    }
  };
}

export function onUserLoginError(error) {
  return {
    type: USER_LOGIN_ERROR,
    payload: error,
    error: true
  };
}

export function getFusionUserRequest() {
  return {type: GET_FUSION_USER_REQUEST};
}

export async function requestGetFusionUser(auth0UserId) {
  return {
    type: GET_FUSION_USER_RESPONSE,
    payload: await UserService.getUserByAuth0Id(auth0UserId)
  };
}

// Reducer
export default function AuthStateReducer(state = initialState, action = {}) {
  var getAuth0UserId = () => {
    if (__DEV__) {
      return _TEST_AUTH0_USER_ID;
    } else {
      return state.get('currentUser').get('userId').split('|')[1];
    }
  };

  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return loop(
          state.set('isLoggedIn', true)
              .set('currentUser', action.payload.profile)
              .set('authenticationToken', action.payload.token),
          Effects.call(getFusionUserRequest)
      );

    case USER_LOGIN_ERROR:
      return initialState;

    case GET_FUSION_USER_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetFusionUser, getAuth0UserId())
      );

    case GET_FUSION_USER_RESPONSE:
      return state
          .set('loading', false)
          .set('fusionUser', action.payload);

    default:
      return state;
  }
}
