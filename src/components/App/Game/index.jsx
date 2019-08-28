/**
 * Created by Arvids on 2019.08.26..
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { FirestoreCollection, FirestoreDocument } from '@react-firebase/firestore';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import Incrementer from './Incrementer';
import { Button } from 'primereact/button';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: Date.now(),
      active: false,
    };
    this.serverTimeOffset = 0;

    fetch('/api/servertime')
      .then(response => response.json())
      .then(json => this.serverTimeOffset = Date.now() - json.timestamp)
  }

  startTimer() {
    if (!this.state.active) {
      this.timer = setInterval(() => this.setState({
        currentTime: Date.now() + (this.serverTimeOffset),
        active: true,
      }), 1000);
    }
  }

  stopTimer () {
    if (this.state.active) {
      clearInterval(this.timer);
      this.setState({ active: false });
    }
  }

  render() {
    if (!this.props.user) return 'Please sign in!';

    return (
      <FirestoreCollection path="/games/">
        {games => {
          if (games.isLoading) {
            return 'Loading games...';
          }
          const currentTime = Date.now() + this.serverTimeOffset;
          // TODO: this can probably mess up when you find more than one game, if one ended early.
          // To be fair, in reality this will rarely be a problem.
          let liveGameIx = games.value.findIndex(g => g.startTime < currentTime && g.endTime > currentTime);
          if (liveGameIx !== -1) {
            const liveGame = games.value[liveGameIx];
            // Game is live!
            let timeLeft = liveGame.endTime - currentTime;
            this.startTimer();

            const timeString = `${Math.floor(timeLeft / 1000 / 60)}:${Math.floor(timeLeft / 1000 % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}`
            let score = liveGame.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
            if (score >= 32) {
              this.stopTimer();
              return 'Game has finished!';
            }

            const scoreContent = (
              <div>
                <div>{timeString}</div>
                <div>{`Score: ${score}`}</div>
                <div>{`Penalties: ${liveGame.shots.filter(sh => sh.change === -1).length}`}</div>
                <div>{`Shots: ${liveGame.shots.length}`}</div>
                <div>{`Hit rate: ${(score / liveGame.shots.length * 100).toFixed(0)}%`}</div>
              </div>
            );

            // If you're the ref, return a different ui.
            if (liveGame.ref === this.props.user.uid) {
              return (
                <div>
                  {scoreContent}
                  <Incrementer liveGameIndex={games.ids[liveGameIx]} shots={liveGame.shots} score={score} />
                </div>
              );
            }

            return (
              <div>
                A game is live!
                {scoreContent}
                <FirestoreDocument path={`users/${liveGame.player}`}>
                  {user => (user.value &&
                    <div>
                      <img src={user.value.photo} height={75} style={{ borderRadius: '50%' }} />
                      {user.value.name}
                    </div>
                  )}
                </FirestoreDocument>
                <div style={{ fontSize: 100 }}>
                  {timeString}
                </div>
              </div>
            )
          }

          this.stopTimer();
          // Else show a list of games or something
          return (
            <div>
              <p>No game is currently live.</p>
            </div>
          );
        }}
      </FirestoreCollection>
    );
  }
}

Game.propTypes = {};

const enhance = compose();

export default enhance(Game);
