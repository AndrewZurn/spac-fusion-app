import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const USERS_BASE_PATH = configuration.getConfiguration('USERS_PATH');
const USER_BY_ID_PATH = userId => USERS_BASE_PATH + `/${userId}`;
const CAN_USER_UNLOCK_WORKOUT = fusionUserId => USER_BY_ID_PATH(fusionUserId) + '/remaining-workout-unlocks';
const USER_BY_AUTH0_ID_PATH = auth0UserId => USERS_BASE_PATH + `/auth0/${auth0UserId}`;
const GET_COMPLETED_WORKOUTS_PATH = (fusionUserId, page) => {
  return USER_BY_ID_PATH(fusionUserId) + `/workouts?page=${page}&pageSize=10`;
};
const SAVE_COMPLETED_WORKOUTS_PATH = (fusionUserId, workoutId) => {
  return USER_BY_ID_PATH(fusionUserId) + `/workouts/${workoutId}`;
};

export async function getUser(userId) {
  return api.get(USER_BY_ID_PATH(userId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}

export async function getRemainingWorkoutUnlocks(userId) {
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

export async function updateUser(user) {
  return api.put(USER_BY_ID_PATH(user.id), user, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during updateUser. Error: ${error}`));
}

export async function saveCompletedWorkout(completedExerciseResults, userId, workoutId) {
  return api.post(
      SAVE_COMPLETED_WORKOUTS_PATH(userId, workoutId),
      {results: completedExerciseResults},
      API_FAILED_REQUEST_WARNING
  )
      .then(response => {
        let didSaveCompletedWorkout = response.status === 201;
        return {
          didSaveCompletedWorkout,
          saveCompletedWorkoutErrors: [] // figure out what errors to pull here.
        };
      })
      .catch(error => console.error(`Error during updateUser. Error: ${error}`));
}
