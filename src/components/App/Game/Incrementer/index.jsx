/**
 * Created by Arvids on 2019.08.26..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { Button } from 'primereact/button';

function Incrementer({ handleChange, handleCancel }) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Button
          style={{ margin: '5px', flex: 1, height: '100px', background: '#e84343' }}
          label="-1"
          onClick={() => handleChange(-1)}
        />
        <Button
          style={{ margin: '5px', flex: 1, height: '100px', background: '#f2bb61' }}
          label="0"
          onClick={() => handleChange(0)}
        />
        <Button
          style={{ margin: '5px', flex: 1, height: '100px', background: '#88cd88' }}
          label="+1"
          onClick={() => handleChange(1)}
        />
        <Button
          style={{ margin: '5px', flex: 1, height: '100px', background: '#59bb59' }}
          label="+2"
          onClick={() => handleChange(2)}
        />
        <Button
          style={{ margin: '5px', flex: 1, height: '100px', background: '#31a231' }}
          label="+3"
          onClick={() => handleChange(3)}
        />
      </div>
      <Button
        label="Cancel game"
        onClick={handleCancel}
      />
    </div>
  );
}

Incrementer.propTypes = {};

const enhance = compose(
  withHandlers({
    handleChange: ({ liveGameIndex, score }) => (change) => {
      fetch('/api/shot', {
        method: 'post',
        body: JSON.stringify({
          gameId: liveGameIndex,
          change,
        }),
        headers: { "Content-Type": "application/json" }
      })
    },

    handleCancel: ({ liveGameIndex }) => () => {
      fetch('/api/cancel', {
        method: 'post',
        body: JSON.stringify({
          gameId: liveGameIndex,
        }),
        headers: { "Content-Type": "application/json" }
      })
    }
  })
);

export default enhance(Incrementer);
