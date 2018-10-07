'use strict'
var request = require('request')

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

const _checkForValidYear = (year) => {
  let currentYear = new Date().getFullYear()
  if (year > currentYear) {
    throw new Error('Invalid year provided. The year must be less than or equal to the current year')
  }
  if(year < 2013){
    throw new Error('Hacktoberfest started in 2013. Year must be equal to or above 2013!')
  }
}

const _query = url => new Promise((resolve, reject) => {
  request.get({
    url: url,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (!err && res.statusCode == 200) resolve(data)
    reject(err)
  })
})

const _processResult = (url, callback, transform) => {
  if (callback) {
    _query(url)
      .then(jsonPipe)
      .then(data => transform ? transform(data) : data)
      .then(result => callback(result))
      .catch(err => {throw new Error(
        'There was a problem retrieving information for this account. Error Message: ' + (err ? err.message : '')
      )})
  } else {
    return _query(url).then(jsonPipe).then(data => transform ? transform(data) : data)
  }
}

const jsonPipe = body => JSON.parse(body)

/**
 * Returns user information
 * @param {string} username
 * @param {function} callback
 * If the callback is omitted, we'll return a Promise
 */
const getUserInfo = (username, callback) => {
  const url = gitHubAPIURLs.getUser.replace('%username%', username)
  return _processResult(url, callback)
}

const _transformHacktoberfestResult = minPullRequest => statsInfo => ({
  completed: !!(statsInfo.total_count >= minPullRequest),
  current: statsInfo.total_count,
  required: minPullRequest,
  progress: statsInfo.total_count + '/' + minPullRequest,
  contributions: statsInfo.items.map(repo => repo.repository_url)
})

/**
 * Returns user information
 * @param {string} username
 * @param {year} year Defaults to the current year if omitted
 * @param {function} callback
 * If the callback is omitted, we'll return a Promise
 */
const getHacktoberfestStats = (username, year, callback) => {
  // we don't use default parameter here because callback might be defined while year is not
  if (typeof year == 'function') {
    // supporting the use of getHacktoberfestStats('username', callbackFn) => year defaults to the current year
    callback = year
    year = undefined
  }

  if (year) {
    // check for valid year
    _checkForValidYear(year)
  } else {
    year = new Date().getFullYear()
  }

  const url = gitHubAPIURLs.getPullRequests.replace('%username%', username).replace(new RegExp('%year%', 'g'), year)
  const minPullRequest = getMinPullRequests(year)
  return _processResult(url, callback, _transformHacktoberfestResult(minPullRequest))
}

exports.getHacktoberfestStats = getHacktoberfestStats
exports.getUserInfo = getUserInfo
