import { getHacktoberfestStats } from './main'

getHacktoberfestStats('MatejMecka', 2017, function (hacktoberfestStats) {
  console.log(hacktoberfestStats)
})

getHacktoberfestStats('MatejMecka', function (hacktoberfestStats) {
  console.log(hacktoberfestStats)
})
