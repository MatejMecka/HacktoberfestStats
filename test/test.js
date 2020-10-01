const expect = require('chai').expect
const { getHacktoberfestStats } = require('../main.js')

it('Check if Hacktoberfeststats (callback) work', function(done) {
  getHacktoberfestStats('MatejMecka', '2017', stats => {
    expect(stats.current).to.equal(14)
    done()
  })
})

it('Check if Hacktoberfeststats (promise) work', function(done) {
  getHacktoberfestStats('MatejMecka', '2017').then(stats => {
    expect(stats.current).to.equal(14)
    done()
  })
})

it('Check if Hacktoberfeststats throws an error', function(done) {
  expect(getHacktoberfestStats.bind(getHacktoberfestStats, 'MatejMecka', '3000')).to.throw()
  done()
})
