import { getHacktoberfestStats } from './main';

getHacktoberfestStats('MatejMecka', 2017, (hacktoberfestStats) => {
  console.log(hacktoberfestStats);
});

getHacktoberfestStats('MatejMecka', (hacktoberfestStats) => {
  console.log(hacktoberfestStats);
});
