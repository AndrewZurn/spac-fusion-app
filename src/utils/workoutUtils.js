import moment from 'moment';

export function getName(workout) {
  const exercise = findExercise(workout);

  let exerciseName = '';
  if (exercise && exercise.name) {
    exerciseName = exercise.name;
  }

  return exerciseName;
}

export function getPreviewText(workout) {
  let previewText = '';
  if (workout && workout.previewText) {
    previewText = workout.previewText;
  }
  return previewText;
}

export function getExerciseInstructions(workout) {
  const exercise = findExercise(workout);

  let exerciseDescription = '';
  if (exercise && exercise.instructions) {
    exerciseDescription = exercise.instructions;
  }

  return exerciseDescription;
}

export function getExerciseOptionsText(workout, extendedDescriptions) {
  let exerciseOptions = getExerciseOptions(workout);
  if (extendedDescriptions) {
    exerciseOptions = exerciseOptions.map(option => {
      return `${option.name} - ${option.targetAmount} ${option.type}`;
    });
  } else {
    exerciseOptions = exerciseOptions.map(option => option.name);
  }

  return exerciseOptions;
}

export function getExerciseOptions(workout) {
  const exercise = findExercise(workout);

  let exerciseOptions = [];
  if (exercise && exercise.exerciseOptions) {
    exerciseOptions = workout.exercise.exerciseOptions;
  }

  return exerciseOptions;
}

export function getDuration(workout) {
  let durationText = '';
  if (workout && workout.duration) { durationText = workout.duration; }
  return durationText;
}

export function getDay(workout) {
  let dayText = '';
  if (workout && workout.workoutDate) {
    dayText = moment(workout.workoutDate).format('dddd');
  }
  return dayText;
}

function findExercise(workout) {
  if (workout && workout.exercise) {
    return workout.exercise;
  } else {
    return null;
  }
}
