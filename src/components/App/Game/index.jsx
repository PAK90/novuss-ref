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
import GameSummary from './GameSummary';
import getEndTime from '../../../helpers/getEndTime';
import stampToString from '../../../helpers/stampToString';

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
            if (this.props.user && liveGame.ref === this.props.user.uid) {
              return (
                <div>
                  <p>{`Score: ${score}`}</p>
                  <p>{`Shots: ${liveGame.shots.length}`}</p>
                  <p>{stampToString(this.state.timeLeft)}</p>
                  <Incrementer liveGameIndex={games.ids[liveGameIx]} shots={liveGame.shots} score={score} />
                </div>
              );
            }

            return (
              <GameSummary game={liveGame} time={this.state.timeLeft} />
            )
          }

          // Else show the last game's stats and the last N games before that.
          const gameIdCombo = games.value.map((g, gIx) => ({ ...g, gameId: games.ids[gIx] }));
          console.log(gameIdCombo.map(g => g.startTime));
          const [lastGame, ...otherGames] = gameIdCombo.sort(v => v.endTime);

          return (
            <div>
              <div>
                <p>Last game:</p>
                <GameSummary game={lastGame} gameId={lastGame.gameId} time={getEndTime(lastGame) - lastGame.startTime} />
              </div>
              <p>Previous games:</p>
              {otherGames.map((g, gIx) => {
                const time = getEndTime(g) - g.startTime;
                return <GameSummary small key={g.gameId} gameId={g.gameId} game={g} time={time} />
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
