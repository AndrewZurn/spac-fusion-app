import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const USERS_BASE_PATH = configuration.getConfiguration('USERS_PATH');
const USER_BY_ID_PATH = userId => USERS_BASE_PATH + `/${userId}`;
const CAN_USER_UNLOCK_WORKOUT = fusionUserId => USER_BY_ID_PATH(fusionUserId) + '/can-unlock-workout';
const USER_BY_AUTH0_ID_PATH = auth0UserId => USERS_BASE_PATH + `/auth0/${auth0UserId}`;
const GET_COMPLETED_WORKOUTS_PATH = (fusionUserId, page) => {
  return USER_BY_ID_PATH(fusionUserId) + `/workouts?page=${page}&pageSize=10`;
}

export async function getUser(userId) {
  return api.get(USER_BY_ID_PATH(userId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}

export async function canUserUnlockWorkout(userId) {
  return api.get(CAN_USER_UNLOCK_WORKOUT(userId))
      .then(response => response.body)
      .catch(error => console.error(`Error during canUserUnlockWorkout. Error: ${error}`));
}

export async function getUserByAuth0Id(auth0UserId) {
  return api.get(USER_BY_AUTH0_ID_PATH(auth0UserId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}

export async function getCompletedWorkouts(fusionUserId, page) {
  return api.get(GET_COMPLETED_WORKOUTS_PATH(fusionUserId, page), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}
