/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { FirestoreCollection, FirestoreProvider } from '@react-firebase/firestore';
import 'firebase/auth';
import PlayerSelector from '../PlayerSelector';

function Main(props) {
  const {
    user,
    signOut,
    signInWithGoogle,
  } = props;

  return (
    <div>
      <h2>This is Novuss Ref</h2>
      {user ?
        <div>
          <img src={user.photoURL} height={50} style={{ borderRadius: '50%' }} />
          Hello, {user.displayName}!
          <FirestoreCollection path="/users/" >
            {d => {
              return d.value ? <PlayerSelector user={user} users={d.value}/> : 'Loading players...'
            }}
          </FirestoreCollection>
        </div>
        :
        <div>Please sign in.</div>
      }
      {user
        ? <button onClick={signOut}>Sign out</button>
        : <button onClick={signInWithGoogle}>Sign in</button>
      }
    </div>
  );
}

Main.propTypes = {};

const enhance = compose(
  // withFirebaseAuth({
  //   providers,
  //   firebaseAppAuth,
  // })
);

export default enhance(Main);
