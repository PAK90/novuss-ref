/**
 * Created by Arvids on 2019.08.26..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { FirestoreMutation } from '@react-firebase/firestore';
import { Button } from 'primereact/button';

function Incrementer({ liveGameIndex, handleChange }) {

  return (
    <div>
      Adjust the scores
      <FirestoreMutation type="update" path={`/games/${liveGameIndex}`}>
        {({ runMutation }) => {
          return (
            <div style={{ display: 'flex' }}>
              <Button
                style={{ margin: '5px', flex: 1, height: '100px', background: '#e84343' }}
                label="-1"
                onClick={() => handleChange(runMutation, -1)}
              />
              <Button
                style={{ margin: '5px', flex: 1, height: '100px', background: '#f2bb61' }}
                label="0"
                onClick={() => handleChange(runMutation, 0)}
              />
              <Button
                style={{ margin: '5px', flex: 1, height: '100px', background: '#88cd88' }}
                label="+1"
                onClick={() => handleChange(runMutation, 1)}
              />
              <Button
                style={{ margin: '5px', flex: 1, height: '100px', background: '#59bb59' }}
                label="+2"
                onClick={() => handleChange(runMutation, 2)}
              />
              <Button
                style={{ margin: '5px', flex: 1, height: '100px', background: '#31a231' }}
                label="+3"
                onClick={() => handleChange(runMutation, 3)}
              />
            </div>
          );
        }}
      </FirestoreMutation>
    </div>
  );
}

Incrementer.propTypes = {};

const enhance = compose(
  withHandlers({
    handleChange: ({ shots }) => (runMutationFn, change) => {
      runMutationFn({
        shots: [
          ...shots,
          {
            time: Date.now(),
            change,
          },
        ],
      })
    }
  })
);

export default enhance(Incrementer);
