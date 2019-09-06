/**
 * Created by Arvids on 2019.09.05..
 */
import React from 'react';
import PropTypes from 'prop-types';
import { VictoryContainer, VictoryChart, VictoryAxis, VictoryArea, VictoryTheme, VictoryPie, VictoryLabel } from 'victory';

export default function AverageRateChart({ game }) {
  // Can use slope to calculate per-shot 'expected value' (to hit 32 after 5 minutes)
  // Just multiply slope by the time of any shot and subtract that from the current score, to give the diff.
  const normalSlope = 32 / (game.endTime - game.startTime); // Usually 1 / 9375 or so.
  // This should be expanded to the 'global average' slope as well as that player's average slope.
  const scoreOverTime = game.shots.reduce((shotArray, shot, shIx) => (
    [
      ...shotArray,
      {
        x: shot.timestamp - game.startTime,
        y: shot.change + (shotArray[shIx - 1] ? shotArray[shIx - 1].y : 0),
      }
    ]
  ), []);
  const shotRelatives = scoreOverTime.map(shot => shot.y - (shot.x * normalSlope));

  return (
    <VictoryChart
      containerComponent={<VictoryContainer responsive={false}/>}
    >
      <VictoryArea
        style={{
          data: { stroke: 'rgb(67, 109, 240)', strokeWidth: 2, fill: 'none' },
          // labels: {
          //   fontSize: 7,
          //   fill: ({ datum, data, index }) => (
          //     (index !== '0' && datum.y === data[index - 1].y - 1) ? '#e84343' : '#333'
          //   )
          // }
        }}
        data={shotRelatives}
        // labels={({ datum, data, index }) => (index === '0' || (index !== '0' && datum.y !== data[index - 1].y)) ? datum.y : null}
      />
    </VictoryChart>
  );
}

AverageRateChart.propTypes = {};
