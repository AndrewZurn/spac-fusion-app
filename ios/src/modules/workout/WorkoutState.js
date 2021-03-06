import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as WorkoutService from '../../services/workoutService';
import * as UserService from '../../services/userService';

// Initial state
const initialState = Map({
  workouts: [],
  canUnlockWorkout: false,
  isStartingWorkout: false,
  loading: false
});

// Actions
const GET_WORKOUTS_REQUEST = 'WORKOUT_STATE/GET_WORKOUTS_REQUEST';
const GET_WORKOUTS_RESPONSE = 'WORKOUT_STATE/GET_WORKOUTS_RESPONSE';

const GET_WORKOUT_REQUEST = 'WORKOUT_STATE/GET_WORKOUT_REQUEST';
const GET_WORKOUT_RESPONSE = 'WORKOUT_STATE/GET_WORKOUT_RESPONSE';

const GET_TODAYS_WORKOUT_REQUEST = 'WORKOUT_STATE/GET_TODAYS_WORKOUT_REQUEST';
const GET_TODAYS_WORKOUT_RESPONSE = 'WORKOUT_STATE/GET_TODAYS_WORKOUT_RESPONSE';

const CAN_UNLOCK_WORKOUT_REQUEST = 'WORKOUT_STATE/CAN_UNLOCK_WORKOUT_REQUEST';
const CAN_UNLOCK_WORKOUT_RESPONSE = 'WORKOUT_STATE/CAN_UNLOCK_WORKOUT_RESPONSE';

const SETUP_FOR_WORKOUT_DETAILS = 'WORKOUT_STATE/SETUP_FOR_WORKOUT_DETAILS';

// ACTION STATE FUNCTIONS
export function getWorkouts() {
  return {type: GET_WORKOUTS_REQUEST};
}

export function getWorkout(id) {
  return {
    type: GET_WORKOUT_REQUEST,
    id
  };
}

export function getTodaysWorkout() {
  return {type: GET_TODAYS_WORKOUT_REQUEST};
}

export function canUnlockWorkout(userId) {
  return {
    type: CAN_UNLOCK_WORKOUT_REQUEST,
    userId
  };
}

/**
 * Setup for a DetailsView of a Workout.
 * @param isStartingWorkout {boolean} true if starting a workout,
 *                                    false if a normal details view is to be presented.
 * @returns {{type: string, isStartingWorkout: *}}
 */
export function setupForWorkoutDetails(isStartingWorkout) {
  return {
    type: SETUP_FOR_WORKOUT_DETAILS,
    isStartingWorkout
  };
}

export async function requestGetWorkouts() {
  return {
    type: GET_WORKOUTS_RESPONSE,
    payload: await WorkoutService.getWorkouts(),
    receivedAt: Date.now()
  };
}

export async function requestGetWorkout(id) {
  return {
    type: GET_WORKOUT_RESPONSE,
    payload: await WorkoutService.getWorkout(id),
    receivedAt: Date.now()
  };
}

export async function requestGetTodaysWorkout() {
  return {
    type: GET_TODAYS_WORKOUT_RESPONSE,
    payload: await WorkoutService._getTodaysWorkout(),
    receivedAt: Date.now()
  };
}

export async function requestCanUnlockWorkout(userId) {
  return {
    type: CAN_UNLOCK_WORKOUT_RESPONSE,
    payload: await UserService.canUserUnlockWorkout(userId),
    receivedAt: Date.now()
  };
}

// REDUCERS
export default function WorkoutStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    // REQUESTS
    case GET_WORKOUTS_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetWorkouts)
      );

    case GET_WORKOUT_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetWorkout, action.id)
      );

    case GET_TODAYS_WORKOUT_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetTodaysWorkout)
      );

    case CAN_UNLOCK_WORKOUT_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestCanUnlockWorkout, action.userId)
      );

    case SETUP_FOR_WORKOUT_DETAILS:
      return state.set('isStartingWorkout', action.isStartingWorkout);

    // RESPONSES
    case GET_WORKOUTS_RESPONSE:
      return state
          .set('loading', false)
          .set('workouts', action.payload);

    case GET_WORKOUT_RESPONSE:
      return state
          .set('loading', false)
          .set('workouts', [action.payload]);

    case GET_TODAYS_WORKOUT_RESPONSE:
      return state
          .set('loading', false)
          .set('workouts', [action.payload]);

    case CAN_UNLOCK_WORKOUT_RESPONSE:
      return state
          .set('loading', false)
          .set('canUnlockWorkout', action.payload.canUnlockWorkout);

    default:
      return state;
  }
}
