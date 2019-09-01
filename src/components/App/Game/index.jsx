/**
 * Created by Arvids on 2019.08.26..
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import socketIOClient from "socket.io-client";
import { FirestoreCollection, FirestoreDocument } from '@react-firebase/firestore';
import Incrementer from './Incrementer';
import { Button } from 'primereact/button';
import GameDisplay from './GameDisplay';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: null,
    };
  }

  componentDidMount() {
    let server;
    if (process.env.NODE_ENV === 'development') {
      server = 'http://127.0.0.1:3001';
    }
    const socket = socketIOClient(server);
    socket.on('timerOut', data => {
      this.setState({ timeLeft: data });
      console.log('data');
    });
  }

  render() {
    return (
      <FirestoreCollection path="/games/">
        {games => {
          if (games.isLoading) {
            return 'Loading games...';
          }
          // TODO: this can probably mess up when you find more than one game, if one ended early.
          // To be fair, in reality this will rarely be a problem.
          let liveGameIx = games.value.findIndex(g => g.active);
          if (liveGameIx !== -1) {

            const liveGame = games.value[liveGameIx];
            const score = liveGame.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
            // If you're the ref, return a different ui.
            if (liveGame.ref === this.props.user.uid) {
              return (
                <div>
                  {score}
                  <Incrementer liveGameIndex={games.ids[liveGameIx]} shots={liveGame.shots} score={score} />
                </div>
              );
            }

            return (
              <GameDisplay game={liveGame} time={this.state.timeLeft} />
            )
          }

          // Else show the last game's stats and the last 5 games before that.
          const [lastGame] = games.value.sort(v => v.endTime);

          // return (
          //   <GameDisplay game={lastGame} time={lastGame.endTime - lastGame.startTime} />
          // )
          return (
            <div>
              <div>
                Last games:
              </div>
              {games.value.map((g, gIx) => {
                // If score is 32, end time is not the end time, it's the time of the last shot.
                let endTime = g.endTime;
                const score = g.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
                if (score >= 32) {
                  endTime = g.shots[g.shots.length - 1].timestamp;
                }
                const time = endTime - g.startTime;
                return <GameDisplay key={games.ids[gIx]} game={g} time={time} />
              })}
            </div>
          )
        }}
      </FirestoreCollection>
    );
  }
}

Game.propTypes = {};

const enhance = compose();

export default enhance(Game);
