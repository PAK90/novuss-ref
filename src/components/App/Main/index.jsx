/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../../firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function Main(props) {
  const {
    user,
    signOut,
    signInWithGoogle,
  } = props;

  return (
    <div>
      <h2>Welcome to Novuss Ref!</h2>
      {user
        ? <div>Hello, {user.displayName}!</div>
        : <div>Please sign in.</div>
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
  withFirebaseAuth({
    providers,
    firebaseAppAuth,
  })
);

export default enhance(Main);
