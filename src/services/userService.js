import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const USERS_BASE_PATH = configuration.getConfiguration('USERS_PATH');
const USER_BY_ID_PATH = userId => USERS_BASE_PATH + `/${userId}`;
const CAN_USER_UNLOCK_WORKOUT = userId => USER_BY_ID_PATH(userId) + '/can-unlock-workout';

export async function getUser(userId) {
  return api.get(USER_BY_ID_PATH(userId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}

export function getUserSentEventTopic(userId) { return api.xhrSentTopic(USER_BY_ID_PATH(userId)); }

export function getUserFinishedEventTopic(userId) { return api.xhrFinishedTopic(USER_BY_ID_PATH(userId)); }

export async function canUserUnlockWorkout(userId) {
  return api.get(CAN_USER_UNLOCK_WORKOUT(userId))
      .then(response => response.body)
      .catch(error => console.error(`Error during canUserUnlockWorkout. Error: ${error}`));
}

export function canUserUnlockWorkoutSentEventTopic(userId) { return api.xhrSentTopic(CAN_USER_UNLOCK_WORKOUT(userId)); }

export function canUserUnlockWorkoutFinishedEventTopic(userId) { return api.xhrFinishedTopic(CAN_USER_UNLOCK_WORKOUT(userId)); }
