import { expect } from 'chai';
import { getHacktoberfestStats } from '../built/main.js';

it('Check if Hacktoberfeststats (callback) work', function (done) {
  getHacktoberfestStats('MatejMecka', 2017, (stats) => {
    expect(stats.current).to.equal(14);
    done();
  });
});

it('Check if Hacktoberfeststats (promise) work', function (done) {
  getHacktoberfestStats('MatejMecka', 2017).then((stats) => {
    expect(stats.current).to.equal(14);
    done();
  });
});

it('Check if Hacktoberfeststats throws an error', function (done) {
  expect(getHacktoberfestStats.bind(getHacktoberfestStats, 'MatejMecka', 3000)).to.throw();
  done();
});

it('Check if Hacktoberfeststats (using await) work', async function () {
  const stats = await getHacktoberfestStats('MatejMecka', 2017);
  expect(stats.current).to.equal(14);
});

it('Check if Hacktoberfeststats (using await) work throws an error', async function () {
  expect(await getHacktoberfestStats.bind(getHacktoberfestStats, 'MatejMecka', 3000)).to.throw();
});

