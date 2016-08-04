import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as WorkoutService from '../../services/workoutService';

const WORKOUT_STATE = 'WORKOUT_STATE';

// Initial state
const initialState = Map({
  exercises: [],
  loading: false
});

// Actions
const GET_WORKOUTS_REQUEST = `${WORKOUT_STATE}/GET_WORKOUTS_REQUEST`;
const GET_WORKOUTS_RESPONSE = `${WORKOUT_STATE}/GET_WORKOUTS_RESPONSE`;

const GET_WORKOUT_REQUEST = `${WORKOUT_STATE}/GET_WORKOUT_REQUEST`;
const GET_WORKOUT_RESPONSE = `${WORKOUT_STATE}/GET_WORKOUT_RESPONSE`;

export function getWorkouts() {
  return { type: GET_WORKOUTS_REQUEST };
}

export function getWorkout(id) {
  return {
    type: GET_WORKOUT_REQUEST,
    value: id
  };
}

export async function requestGetWorkouts() {
  return {
    type: GET_WORKOUTS_RESPONSE,
    payload: await WorkoutService.getWorkouts(),
    receivedAt: Date.now()
  }
}

export async function requestGetWorkout(id) {
  return {
    type: GET_WORKOUT_RESPONSE,
    payload: await WorkoutService.getWorkout(id),
    receivedAt: Date.now()
  }
}

export default function WorkoutStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_WORKOUTS_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetWorkouts)
      );

    case GET_WORKOUTS_RESPONSE:
      return state
          .set('loading', false)
          .set('exercises', action.payload);

    case GET_WORKOUT_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetWorkout(action.value))
      );

    case GET_WORKOUT_RESPONSE:
      return state
          .set('loading', false)
          .set('exercises', [action.payload]);

    default:
      return state;
  }
}