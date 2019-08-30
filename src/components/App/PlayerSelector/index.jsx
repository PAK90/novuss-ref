/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState } from 'recompose';
import { withRouter } from 'react-router-dom'
import { FirestoreDocument, FirestoreMutation } from '@react-firebase/firestore';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Dropdown } from 'primereact/dropdown';

function PlayerSelector(props) {
  const { user, users, history, livePlayer, handleChangePlayer } = props;
  return (
    <FirestoreDocument path={`/users/${user.uid}`}>
      {refUser => {
        return (
          <div>
            <div>{!refUser.value ? 'Please register to play.' : 'You are registered!'}</div>

            <div>
              Live player:
              <Dropdown
                options={users.map(u => ({ label: u.name, value: u.uid, photo: u.photo }))}
                value={livePlayer}
                onChange={handleChangePlayer}
                itemTemplate={(option) => {
                  return (
                    <div key={option.value}>
                      <img src={option.photo} height={20} style={{ borderRadius: '50%' }} />
                      {option.label}
                    </div>
                  )
                }}
              />
            </div>

            <FirestoreMutation type={refUser.value ? 'add' : 'set'} path={refUser.value ? '/games/' : `/users/${user.uid}`}>
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
                  // Start a new game object
                  fetch('/api/start', {
                    method: 'post',
                    body: JSON.stringify({
                      refId: user.uid,
                      playerId: livePlayer,
                      duration: 1,
                    }),
                    headers: { "Content-Type": "application/json" }
                  });
                  history.push('/game');
                };
                return (
                  <Button
                    onClick={refUser.value ? handleStart : handleRegister}
                    label={refUser.value ? 'Start Game' : 'Register as Novuss Player'}
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

PlayerSelector.propTypes = {};

const enhance = compose(
  withState('livePlayer', 'setLivePlayer', ({ users }) => users[0].uid),
  withHandlers({
    handleChangePlayer: ({ setLivePlayer }) => (e) => {
      setLivePlayer(e.target.value)
    },
  }),
  withRouter,
);

export default enhance(PlayerSelector);
