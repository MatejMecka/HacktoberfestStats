var Hacktoberfest = require('./main.js')

// Get a specific year
Hacktoberfest('MatejMecka', '2017', function(hacktoberfestStats, callback, error) {
  console.log(hacktoberfestStats.mainStats)
})

// Get the actual year
Hacktoberfest('MatejMecka', null, function(hacktoberfestStats, callback, error) {
  console.log(hacktoberfestStats.mainStats)
})
