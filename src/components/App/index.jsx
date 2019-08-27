/**
 * Created by Arvids on 2019.08.20..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './Main';
import Game from './Game';
import { FirestoreProvider } from '@react-firebase/firestore';
import firebaseConfig from '../../firebaseConfig';
import firebase from 'firebase';
import { compose } from 'recompose';
import withFirebaseAuth from 'react-with-firebase-auth';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

function App({ ...topProps }) {
  console.log('app props: ', topProps);
  return (
    <FirestoreProvider {...firebaseConfig} firebase={firebase}>
      <Router>
        <Route path="/" exact render={(props) => <Main {...props} {...topProps} />} />
        <Route path="/game/" render={(props) => <Game {...props} {...topProps} />} />
      </Router>
    </FirestoreProvider>
  )
}

App.propTypes = {};

const enhance = compose(
  withFirebaseAuth({
    providers,
    firebaseAppAuth,
  })
);

export default enhance(App);
