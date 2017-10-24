var expect = require('chai').expect
var Hacktoberfest = require('../main.js')

it('Check if Hacktoberfeststats work', function(done) {
  Hacktoberfest('MatejMecka', '2017', function(hacktoberfestStats, error) {
    expect(hacktoberfestStats.mainStats.Name).to.equal('MatejMecka')
    done()
  })
})
