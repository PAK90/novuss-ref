/**
 * Created by Arvids on 2019.09.01..
 */

export default function stampToString(stamp) {
  return `${Math.floor(stamp / 1000 / 60)}:${Math.floor(stamp / 1000 % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}`
}