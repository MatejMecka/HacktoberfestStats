'use strict'
var request = require('request')
var _ = require('underscore')

const gitHubAPIURLs = {
  getUser: 'https://api.github.com/users/%username%',
  getPullRequests: 'https://api.github.com/search/issues?per_page=1000&q=-label:invalid+created:%year%-09-30T00:00:00-12:00..%year%-10-31T23:59:59-12:00+type:pr+is:public+author:%username%'
}

const getMinPullRequests = year => {
  switch (year) {
  case 2018: return 5
  default: return 4
  }
}

const _getSimpleQuery = url => new Promise((resolve, reject) => {
  request.get({
    url,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (!err && res.statusCode == 200) resolve(data)
    reject(err)
  })
})

const _query = url => new Promise((resolve, reject) => {
  request.get({
    url: url,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (!err && res.statusCode == 200) resolve(data)
    reject(err)
  })
})

const jsonPipe = body => JSON.parse(body)

/**
 * Returns user information
 * @param {string} username
 * @param {function} callback
 * If the callback is omitted, we'll return a Promise
 */
const getUserInfo = (username, callback) => {
  const url = gitHubAPIURLs.getUser.replace('%username%', username)
  if (callback) {
    _query(url)
      .then(jsonPipe)
      .then(result => callback(result))
      .catch(err => {throw new Error(
        'There was a problem retrieving the information about that account. Error Message: ' + (err ? err.message : '')
      )})
  } else {
    return _query(url).then(jsonPipe)
  }
}

function hacktoberfestStats(username, year, callback) {
  var statsInfo = {}
  // First API call to get GitHub user informations.
  request.get(
    {
      url: gitHubAPIURLs.getPullRequests.replace('%username%', username),
      json: true,
      headers: { 'User-Agent': 'request' }
    },
    (err, res, data) => {
      if (!err && res.statusCode == 200) {
        statsInfo.raw = data
        // Second API call to get Hacktoberfest user informations.
        request.get(
          {
            url: gitHubAPIURLs[1].replace('%username%', username).replace(new RegExp('%year%', 'g'), year),
            json: true,
            headers: { 'User-Agent': 'request' }
          },
          (err, res, data) => {
            const minPullRequest = getMinPullRequests(year)
            if (!err && res.statusCode == 200) {
              statsInfo.raw = _.extend(statsInfo.raw, data)
              statsInfo.mainStats = {
                Name: statsInfo.raw.name,
                Completed: !!(statsInfo.raw.total_count === minPullRequest),
                Progress: statsInfo.raw.total_count + '/' + minPullRequest,
                Contributions: []
              }
              statsInfo.raw.items.forEach(function(repository) {
                if (repository.hasOwnProperty('repository_url')) {
                  statsInfo.mainStats.Contributions.push(repository.repository_url)
                }
              })
              callback(statsInfo)
            } else {
              throw new Error(
                'There was a problem retriving the information about that account. Error Message: ' + err.message
              )
            }
          }
        )
      } else {
        // throw new Error(
        //   'There was a problem retriving the information about that account. Error Message: ' + err.message
        // )
      }
    }
  )
}

// exports.getHacktoberfestStats = getHacktoberfestStats
exports.getUserInfo = getUserInfo