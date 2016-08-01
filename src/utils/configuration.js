import {Map} from 'immutable';
import * as env from '../../env';

let baseConfig = {
  'USERS_PATH': '/users',
  'EXERCISES_PATH': '/exercises',
  'WORKOUTS_PATH': '/workouts'
};

let localConfig = Map({
  ...baseConfig,
  'API_ROOT': 'http://localhost:8080'
});

let testConfig = Map({
  ...baseConfig,
  'API_ROOT': 'http://SOME_TEST_HOST:8080'
});

let prodConfig = Map({
  ...baseConfig,
  'API_ROOT': 'http://SOME_PROD_HOST:8080'
});

let configuration = getConfig();

export function setConfiguration(name, value) {
  configuration = configuration.set(name, value);
}

export function setAll(properties) {
  configuration = configuration.merge(properties);
}

export function unsetConfiguration(name) {
  configuration = configuration.delete(name);
}

export function getConfiguration(key) {
  if (!configuration.has(key)) {
    throw new Error('Undefined configuration key: ' + key);
  }

  return configuration.get(key);
}

function getConfig() {
  let environment = env.ENVIRONMENT;
  if (environment == 'prod') {
    return prodConfig;
  } else if (environment == 'test') {
    return testConfig;
  } else if (environment == 'local') {
    return localConfig;
  } else {
    throw new Error('Undefined configuration key: ENVIRONMENT in current environment config file.');
  }
}