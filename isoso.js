#!/usr/bin/env node

'use strict';

const { DateTime: dt } = require('luxon');
const [di, ...a] = process.argv.slice(2);

const mm = {
  '-': 'minus',
  '+': 'plus',
};

const um = {
  '-': {
    y: 'years',
    m: 'months',
    d: 'days',
    H: 'hours',
    M: 'minutes',
    S: 'seconds',
  },
  '=': {
    y: 'year',
    m: 'month',
    d: 'day',
    H: 'hour',
    M: 'minute',
    S: 'second',
  },
};

um['+'] = um['-'];

let d =
  di.match(/^(n|now|l|loc|local)$/) ? dt.local() :
  di == 'utc' || di == 'u' ? dt.utc() :
  dt.fromISO(di);

if (!d.isValid) process.exit(1);

const p = (m, o, n, u) => ({ [um[o][u]]: +n });

for (let o of a) {
  let m = o.match(/^([-+=])(\d*\.?\d+)([ymdHMS])$/);
  if (!m) process.exit(2);
  d = m[1] == '=' ? d.set(p(...m)) : d[mm[m[1]]](p(...m));
}

if (!d.isValid) process.exit(3);

console.log(d.toISO());
