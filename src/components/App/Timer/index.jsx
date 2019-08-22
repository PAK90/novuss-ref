/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { FirestoreDocument, FirestoreMutation } from '@react-firebase/firestore';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';

function Timer({ user }) {
  console.log(user);
  return (
    <FirestoreDocument path={`/users/${user.uid}`}>
      {d => {
        console.log(d);
        return (
          <div>
            <div>{!d.value ? 'Please register to play.' : 'You are registered!'}</div>
            <FirestoreMutation type="set" path={d.value ? '/test/' : `/users/${user.uid}`}>
              {({ runMutation }) => {
                const handleRegister = () => {
                  runMutation({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                  });
                };
                const handleStart = () => {
                  console.log('woop starting!');
                };
                return (
                  <Button
                    onClick={d.value ? handleStart : handleRegister}
                    label={d.value ? 'Start Game' : 'Register as Novuss Player'}
                  />
                );
              }}
            </FirestoreMutation>
          </div>
        );
      }}
    </FirestoreDocument>
  );
}

Timer.propTypes = {};

const enhance = compose(
  // withHandlers({
  //   handleRegister: ({ user }) => () => {
  //     db.collection('user').add({ user })
  //   },
  //   handleStartGame: () => () => {
  //
  //   },
  // }),
);

export default enhance(Timer);
