/*eslint-disable react/prop-types*/

import React from 'react';
import HomeViewContainer from './home/HomeViewContainer';
import ColorViewContainer from './colors/ColorViewContainer';

/**
 * AppRouter is responsible for mapping a navigator scene to a view
 */
export default function AppRouter(props) {
  const key = props.scene.route.key;

  if (key === 'Home') {
    return <HomeViewContainer />;
  }

  if (key.indexOf('Workout') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
      <ColorViewContainer
        index={index}
      />
    );
  }

  if (key.indexOf('Calendar') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
        <ColorViewContainer
            index={index}
        />
    );
  }

  if (key.indexOf('Profile') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
        <ColorViewContainer
            index={index}
        />
    );
  }

  throw new Error('Unknown navigation key: ' + key);
}
