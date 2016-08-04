import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const EXERCISES_BASE_PATH = configuration.getConfiguration("EXERCISES_PATH");
const API_FAILED_REQUEST_WARNING = configuration.getConfiguration("API_FAILED_REQUEST_WARNING_MESSAGE");

export async function getExercises() {
  return api.get(EXERCISES_BASE_PATH, API_FAILED_REQUEST_WARNING);
}

export function getExercisesSentEventTopic() { return api.xhrSentTopic(EXERCISES_BASE_PATH); }

export function getExercisesFinishedEventTopic() { return api.xhrFinishedTopic(EXERCISES_BASE_PATH); }

/**
 * Search for an exercise with a given exerciseId
 * @param exerciseId {UUID} the id of the exercise to find.
 * @returns {Promise}
 */
export async function getExercise(exerciseId) {
  return api.get(EXERCISES_BASE_PATH + `/${exerciseId}`, API_FAILED_REQUEST_WARNING);
}

export function getExerciseSentEventTopic(exerciseId) { return api.xhrSentTopic(EXERCISES_BASE_PATH + `/${exerciseId}`); }

export function getExerciseFinishedEventTopic(exerciseId) { return api.xhrFinishedTopic(EXERCISES_BASE_PATH + `/${exerciseId}`); }