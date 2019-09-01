/**
 * Created by Arvids on 2019.08.31..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FirestoreDocument } from '@react-firebase/firestore';

import styles from './game.module.scss';
import moment from 'moment';

export default function GameDisplay({ game, time }) {

  const score = game.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
  const timeString = `${Math.floor(time / 1000 / 60)}:${Math.floor(time / 1000 % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}`
  const penalties = game.shots.filter(sh => sh.change === -1).length;
  const shots = game.shots.length;
  const hitRate = (score / shots * 100).toFixed(0);


  const scoreContent = (
    <div>
      <div>{timeString}</div>
      <div>{`Score: ${score}`}</div>
      <div>{`Penalties: ${penalties}`}</div>
      <div>{`Shots: ${shots}`}</div>
      <div>{`Hit rate: ${hitRate}%`}</div>
    </div>
  );

  const playerData = (
    <FirestoreDocument path={`users/${game.player}`}>
      {user => (user.value &&
        <div>
          <img src={user.value.photo} height={25} style={{ borderRadius: '50%' }} />
          {user.value.name}
        </div>
      )}
    </FirestoreDocument>
  );

  return (
    <div className={styles.gameDisplayContainer}>
      <div className={styles.gameDisplayRow}>
        Time: {moment(game.startTime).format('lll')} Player: {playerData}
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

GameDisplay.propTypes = {};
