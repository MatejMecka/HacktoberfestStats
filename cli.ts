#!/usr/bin/env node

import meow from 'meow';
import { getHacktoberfestStats } from './main.js';

const cli = meow(
  `
  Usage:
    $ npx hacktoberfeststats <username from GitHub>

  Options
    --help, -h  Get this beautiful help panel
    --year, -y  Specify the year you want to get stats from. 
    Useful if you want to retrieve historic data from previous hacktoberfest events.

  Examples
    $ npx hacktoberfeststats MatejMecka --year 2019
`,
  {
    flags: {
      year: {
        type: 'number',
        shortFlag: 'y',
        default: 0,
      },
      help: {
        type: 'boolean',
        shortFlag: 'h',
      },
    },
    importMeta: import.meta,
  },
);

if (cli.flags.help) {
  cli.showHelp(0);
}

const username = cli.input[0];

if (!username) {
  console.error('Error: GitHub username is required');
  cli.showHelp(1);
}

// If year is 0 (default), omit it to get current year
const year = cli.flags.year === 0 ? undefined : cli.flags.year;

const statsPromise = year !== undefined ? getHacktoberfestStats(username, year) : getHacktoberfestStats(username);

statsPromise
  .then((stats) => {
    console.log(stats);
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
