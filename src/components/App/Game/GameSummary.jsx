/**
 * Created by Arvids on 2019.08.31..
 */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { FirestoreDocument } from '@react-firebase/firestore';
import { compose, withHandlers } from 'recompose';

import styles from './game.module.scss';
import stampToString from '../../../helpers/stampToString';

function GameSummary({ game, time, small, handleClick }) {
  const score = game.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
  const timeString = stampToString(time);
  const penalties = game.shots.filter(sh => sh.change === -1).length;
  const shots = game.shots.length;
  const hitRate = (score / shots * 100).toFixed(0);

  const playerData = (
    <FirestoreDocument path={`users/${game.player}`}>
      {user => (user.value &&
        <div className={styles.playerDiv}>
          <img src={user.value.photo} height={25} style={{ borderRadius: '50%' }} />
          <span className={styles.playerSpan}>{user.value.name}</span>
        </div>
      )}
    </FirestoreDocument>
  );

  if (small) {
    return (
      <div className={styles.gameDisplayContainer} onClick={handleClick}>
        <div className={styles.gameDisplayRow}>
          <div className={styles.col}>
            {moment(game.startTime).format('MMM Do h:mm')}
          </div>
          <div className={styles.col}>
            {playerData}
          </div>
          <div className={styles.col}>
            {timeString}
          </div>
          <div className={styles.col}>
            {score}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.gameDisplayContainer} onClick={handleClick}>
      <div className={styles.gameDisplayRow}>
        {playerData}<span style={{ marginLeft: '10px' }}>({moment(game.startTime).format('MMM Do h:mm')})</span>
      </div>
      <div className={styles.gameDisplayRow}>
        <div className={styles.col}>
          <div>Time taken:</div>
          <div className={styles.large}>{timeString}</div>
        </div>
        <div className={styles.col}>
          <div>Score:</div>
          <div className={styles.large}>{score}</div>
        </div>
      </div>
      <div className={styles.gameDisplayRow}>
        <div className={styles.col} style={penalties ? { color: '#ff3737' } : {}}>
          {`Penalties: ${penalties}`}
        </div>
        <div className={styles.col}>
          {`Shots taken: ${shots}`}
        </div>
        <div className={styles.col}>
          {`Shot conversion: ${hitRate}%`}
        </div>
      </div>
    </div>
  );
}

GameSummary.propTypes = {};

const enhance = compose(
  withRouter,
  withHandlers({
    handleClick: ({ history, gameId }) => () => {
      history.push(`/games/${gameId}`)
    }
  })
);

export default enhance(GameSummary);
