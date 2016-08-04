import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const WORKOUTS_BASE_PATH = configuration.getConfiguration("WORKOUTS_PATH");
const API_FAILED_REQUEST_WARNING = configuration.getConfiguration("API_FAILED_REQUEST_WARNING_MESSAGE");

export async function getWorkouts() {
  return api.get(WORKOUTS_BASE_PATH, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}

export function getWorkoutsSentEventTopic() { return api.xhrSentTopic(WORKOUTS_BASE_PATH); }

export function getWorkoutsFinishedEventTopic() { return api.xhrFinishedTopic(WORKOUTS_BASE_PATH); }

/**
 * Search for an workout with a given workoutId
 * @param workoutId {UUID} the id of the workout to find.
 * @returns {Promise}
 */
export async function getWorkout(workoutId) {
  return api.get(WORKOUTS_BASE_PATH + `/${workoutId}`, API_FAILED_REQUEST_WARNING)
      .then(response => response.body);
}

export function getWorkoutSentEventTopic(workoutId) { return api.xhrSentTopic(WORKOUTS_BASE_PATH + `/${workoutId}`); }

export function getWorkoutFinishedEventTopic(workoutId) { return api.xhrFinishedTopic(WORKOUTS_BASE_PATH + `/${workoutId}`); }