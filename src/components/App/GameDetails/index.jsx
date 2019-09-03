/**
 * Created by Arvids on 2019.09.01..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { FirestoreDocument } from '@react-firebase/firestore';
import { VictoryContainer, VictoryChart, VictoryAxis, VictoryArea, VictoryTheme, VictoryPie, VictoryLabel } from 'victory';
import { XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeries } from 'react-vis';
import stampToString from '../../../helpers/stampToString';
import getEndTime from '../../../helpers/getEndTime';


function GameDetails(props) {
  const {
    match,
  } = props;

  return (
    <div>
      <svg height={0}>
        <defs>
          <linearGradient id="grad"
                          x1="0%" y1="0%" x2="0%" y2="100%"
          >
            <stop offset="0%"   stopColor="#4774FF"/>
            <stop offset="100%" stopColor="white"/>
          </linearGradient>
        </defs>
      </svg>
      <FirestoreDocument path={`/games/${match.params.gameId}`}>
        {game => {
          if (!game.value) return 'Loading...';

          const scoreOverTime = game.value.shots.reduce((shotArray, shot, shIx) => (
            [
              ...shotArray,
              {
                x: shot.timestamp - game.value.startTime,
                y: shot.change + (shotArray[shIx - 1] ? shotArray[shIx - 1].y : 0),
              }
            ]
          ), []);
          const rvis = (
            <XYPlot height={300} width={300}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title="Time" />
              <YAxis title="Score" tickValues={[4,8,12,16,20,24,28,32]}  />
              <LineSeries style={{ fill: 'none' }}
                data={scoreOverTime}
              />
            </XYPlot>
          );

          const vChart = (
            <VictoryChart
              animate={{ duration: 1000 }}
              // theme={VictoryTheme.material}
              containerComponent={<VictoryContainer responsive={false}/>}
            >
              <VictoryArea
                style={{
                  data: { fill: 'url(#grad)', stroke: 'rgb(67, 109, 240)', strokeWidth: 2 },
                  labels: {
                    fontSize: 7,
                    fill: ({ datum, data, index }) => (
                      (index !== '0' && datum.y === data[index - 1].y - 1) ? '#e84343' : '#333'
                    )
                  }
                }}
                data={scoreOverTime}
                labels={({ datum, data, index }) => (index === '0' || (index !== '0' && datum.y !== data[index - 1].y)) ? datum.y : null}
              />
              <VictoryAxis
                label="Score"
                domain={[0, 32]}
                dependentAxis
                tickValues={[4, 8, 12, 16, 20, 24, 28, 32]}
              />
              <VictoryAxis
                label="Time"
                tickFormat={
                  (stamp) => (stampToString(stamp))
                }
                domain={[0, 300000]}
                tickValues={[75000, 150000, 225000, 300000]}
              />
            </VictoryChart>
          );

          const shotsByScore = game.value.shots.reduce((shotCategories, shot) => {
            const newCategories = shotCategories;
            newCategories[shot.change + 1] = { ...shotCategories[shot.change + 1], y: shotCategories[shot.change + 1].y + 1};
            return newCategories;
          }, [
            { x: '-1', y: 0 },
            { x: '0', y: 0 },
            { x: '1', y: 0 },
            { x: '2', y: 0 },
            { x: '3', y: 0 },
          ]);

          console.log(shotsByScore);

          // Use <svg viewBox="0 0 300 300"> for responsive instead.
          const pieChart = (
            <div style={{ width: '300px', height: '300px' }}>
              <svg width={300} height={300}>
                <VictoryPie
                  standalone={false}
                  innerRadius={60}
                  labelRadius={75}
                  height={300} width={300}
                  animate={{ duration: 1000 }}
                  labels={({ datum }) => datum.y ? datum.y : null}
                  data={shotsByScore}
                  colorScale={['#e84343', '#f2bb61', '#88cd88', '#59bb59', '#31a231' ]}
                />
                <VictoryLabel
                  textAnchor="middle"
                  style={{ fontSize: 20 }}
                  x={150} y={150}
                  text={`Point\nfrequency`}
                />
              </svg>
            </div>
          );

          const streak = game.value.shots.reduce(
            (sc, shot) => shot.change > 0 ? { c: sc.c + 1, t: sc.t } : { c: 0, t: Math.max(sc.t, sc.c) },
          { c: 0, t: 0 });

          const gameEndTime = getEndTime(game.value);
          const secPerShot = (gameEndTime - game.value.startTime) / 1000 / game.value.shots.length;
          const score = game.value.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
          const secPerPoint = (gameEndTime - game.value.startTime) / 1000 / score;
          const pointPerMin = 60 / secPerPoint;
          const pointsPerShot = score / game.value.shots.length;

          return (
            <>
              <div style={{ display: 'flex' }}>
                {vChart}
                {pieChart}
              </div>
              <p>Longest streak: {streak.t}</p>
              <p>Seconds per shot: {secPerShot.toFixed(2)}</p>
              <p>Seconds per point: {secPerPoint.toFixed(2)}</p>
              <p>Points per minute: {pointPerMin.toFixed(2)}</p>
              <p>Average points per shot: {pointsPerShot.toFixed(2)}</p>
            </>
          );
        }}
      </FirestoreDocument>
    </div>
  );
}

GameDetails.propTypes = {};

const enhance = compose();

export default enhance(GameDetails);
