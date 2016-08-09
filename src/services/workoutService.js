import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const WORKOUTS_BASE_PATH = configuration.getConfiguration('WORKOUTS_PATH');
const GET_WORKOUT_BY_ID = workoutId => { return WORKOUTS_BASE_PATH + `/${workoutId}`; };
const GET_TODAYS_WORKOUT = WORKOUTS_BASE_PATH + '/today';

export async function getWorkouts() {
  return api.get(WORKOUTS_BASE_PATH, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}

export function getWorkoutsSentEventTopic() { return api.xhrSentTopic(WORKOUTS_BASE_PATH); }

export function getWorkoutsFinishedEventTopic() { return api.xhrFinishedTopic(WORKOUTS_BASE_PATH); }

export async function getTodaysWorkout() {
  return api.get(GET_TODAYS_WORKOUT, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getTodaysWorkouts. Error: ${error}`));
}

export function getTodaysWorkoutSentEventTopic() { return api.xhrSentTopic(GET_TODAYS_WORKOUT); }

export function getTodaysWorkoutFinishedEventTopic() { return api.xhrFinishedTopic(GET_TODAYS_WORKOUT); }

/**
 * Search for an workout with a given workoutId
 * @param workoutId {UUID} the id of the workout to find.
 * @returns {Promise}
 */
export async function getWorkout(workoutId) {
  return api.get(GET_WORKOUT_BY_ID(workoutId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body);
}

export function getWorkoutSentEventTopic(workoutId) { return api.xhrSentTopic(WORKOUTS_BASE_PATH + `/${workoutId}`); }

export function getWorkoutFinishedEventTopic(workoutId) { return api.xhrFinishedTopic(WORKOUTS_BASE_PATH + `/${workoutId}`); }
