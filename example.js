import {getHacktoberfestStats} from './main.js';

// Get a specific year
getHacktoberfestStats('MatejMecka', '2017', function (hacktoberfestStats, callback, error) {
  console.log(hacktoberfestStats)
})

// Get the actual year
getHacktoberfestStats('MatejMecka', null, function (hacktoberfestStats, callback, error) {
  console.log(hacktoberfestStats)
})
