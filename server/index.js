/**
 * Created by Arvids on 2019.08.27..
 */
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require("firebase/app");
const path = require('path');
require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "novuss-ref.firebaseapp.com",
  databaseURL: "https://novuss-ref.firebaseio.com",
  projectId: "novuss-ref",
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/servertime', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ timestamp: Date.now() }));
});

app.post('/api/start', (req, res, next) => {
  // Starts a game, returns the server's initial timestamp.
  const { playerId, refId } = req.body;
  res.setHeader('Content-Type', 'application/json');
  const currentTime = new Date();
  db.collection('games').add({
      startTime: currentTime.getTime(),
      endTime: currentTime.setMinutes(currentTime.getMinutes() + 5),
      shots: [],
      ref: refId,
      player: playerId,
    });
  next();
});

app.post('/api/shot', (req, res, next) => {
  const { change, gameId } = req.body;
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json');
  db.collection('games').doc(gameId).update({
    'shots': firebase.firestore.FieldValue.arrayUnion({
      timestamp: Date.now(),
      change,
    })
  });
  next();
});

app.post('/api/cancel', (req, res) => {

});
// All remaining requests return the React app, so it can handle routing.
app.get('*', (request, response) => {
  console.log('returning *');
  response.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));