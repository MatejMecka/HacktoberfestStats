#!/usr/bin/env node

'use strict'
var meow = require('meow')
var hacktoberFest = require('./main.js')

const cli = meow(`
  Usage:
    $ npx hacktoberfeststats <username from GitHub>

  Options
    --help, -h  Get this beautiful help panel
    --year, -y  Specify the year you want to get stats from. Useful if you want to retrieve historic data from previous hacktoberfest events.

  Examples
    $  npx hacktoberfeststats MatejMecka --year 2019

`,{
  flags: {
    year: {
      type: 'number',
      alias: 'y',
      default: 0,
    },
    help: {
      type: 'boolean',
      alias: 'h',
    },
  },
})

if (cli.flags.help) {
  cli.showHelp(0)
}

hacktoberFest
  .getHacktoberfestStats(cli.input[0], cli.flags.year)
  .then((stats) => {
    console.log(stats)
  })
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
