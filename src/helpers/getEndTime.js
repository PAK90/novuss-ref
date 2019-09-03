/**
 * Created by Arvids on 2019.09.01..
 */

export default function getEndTime(game) {
  // If score is 32, end time is not the end time, it's the time of the last shot.
  let endTime = game.endTime;
  const score = game.shots.reduce((totalScore, shot) => (totalScore += shot.change), 0);
  if (score >= 32) {
    endTime = game.shots[game.shots.length - 1].timestamp;
  }
  return endTime;
}