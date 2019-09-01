/**
 * Created by Arvids on 2019.08.27..
 */
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require("firebase/app");
const http = require("http");
const socketIo = require("socket.io");
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
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const io = socketIo(server);
// io.set('origins', '*:*');
let timerInterval;
// io.on('connection', socket => {
//   console.log('New client connected');
//   //Here we listen on a new namespace called "incoming data"
//   socket.on('timer in', (data) => {
//     // Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
//     console.log('broadcasting');
//     socket.broadcast.emit('timerOut', { timeLeft: data });
//   });
//
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

app.post('/api/start', (req, res, next) => {
  // Starts a game, sets a timeout in X minutes that'll end it.
  const { playerId, refId, duration } = req.body;
  res.setHeader('Content-Type', 'application/json');
  const currentTime = new Date();
  // Add a 3 second buffer for server stuff and socket stuff.
  let endTime = new Date().setMinutes(currentTime.getMinutes() + duration, currentTime.getSeconds() + 1);

  // TODO: add a setInterval that sockets the time left to any listeners every second.
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerInterval = setInterval(() => {
    const timeLeft = endTime - Date.now();
    console.log('emitting time left: ', timeLeft);
    io.sockets.emit('timerOut', timeLeft);
  }, 1000);

  db.collection('games').add({
    startTime: currentTime.getTime(),
    endTime,
    shots: [],
    ref: refId,
    player: playerId,
    active: true,
  }).then(gameRef => (
    // Set up a setTimeout that sets active:false after duration.
    setTimeout(() => {
      console.log('ending game due to time');
      gameRef.update({
        active: false,
      });
      clearInterval(timerInterval);
    }, endTime - currentTime.getTime())
  ));
  res.sendStatus(200).end();
});

app.post('/api/shot', (req, res, next) => {
  const { change, gameId } = req.body;
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json');
  const gameRef = db.collection('games').doc(gameId);

  gameRef.update({
    'shots': firebase.firestore.FieldValue.arrayUnion({
      timestamp: Date.now(),
      change,
    })
  }).then(() => {
    gameRef.get().then(doc => {
      const score = doc.data().shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
      // If player has sunk all the things, end the game!
      if (score >= 32) {
        clearInterval(timerInterval);
        gameRef.update({
          active: false,
        });
      }
    })
  });
  res.sendStatus(200).end();
});

app.post('/api/cancel', (req, res) => {
  const { gameId } = req.body;
  clearInterval(timerInterval);
  db.collection('games').doc(gameId).delete();
  res.sendStatus(200).end();
});

const path = require('path');
app.use(express.static(path.resolve(__dirname, '../build')));

// Express serve up index.html file if it doesn't recognize route
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
// });

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));