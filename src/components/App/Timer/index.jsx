/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { FirestoreCollection, FirestoreDocument } from '@react-firebase/firestore';

function Timer(props) {

  return (
    <FirestoreCollection path="/test/" limit={1}>
      {d => {
        console.log(d);
        return (
          <div>
            Timer goes here! <div>{d.isLoading ? 'loading...' : d.value[0].argh}</div>
            <button
              // onClick={() => db.collection('test').add({
              //   data: 'waffles',
              //   user: props.user,
              // })}
            >
              Start timer
            </button>
          </div>
        );
      }}
    </FirestoreCollection>
  );
}

Timer.propTypes = {};

const enhance = compose();

export default enhance(Timer);
