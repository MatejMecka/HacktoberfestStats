const expect = require('chai').expect
const { getHacktoberfestStats } = require('../main.js')

it('Check if Hacktoberfeststats (callback) work', function(done) {
  getHacktoberfestStats('MatejMecka', '2017', stats => {
    expect(stats.current).to.equal(15)
    done()
  })
})

it('Check if Hacktoberfeststats (promise) work', function(done) {
  getHacktoberfestStats('MatejMecka', '2017')
    .then(stats => {
      expect(stats.current).to.equal(15)
      done()
    })
})