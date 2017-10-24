'use strict'
var request = require('request')
var _ = require('underscore')
/**

 * Gives Hacktoberfest Statistics information
 * @param {string} username
 * @param {function} callback
 */

const costants = {
  minPullRequests: 4
}

function hacktoberfestStats(username, year, callback) {
	const GITHUB_API_USER = `https://api.github.com/users/${username}`
	const GITHUB_API_ISSUES = `https://api.github.com/search/issues?per_page=1000&q=-label:invalid+created:${year}-09-30T00:00:00-12:00..${year}-10-31T23:59:59-12:00+type:pr+is:public+author:${username}`
	var statsInfo = {}
	// First API call to get GitHub user informations.
	request.get({
		url: GITHUB_API_USER,
		json: true,
		headers: {'User-Agent': 'request'}
	}, (err, res, data) => {
		if (!err && res.statusCode == 200) {
			statsInfo.raw = data
			// Second API call to get Hacktoberfest user informations.
			request.get({
				url: GITHUB_API_ISSUES,
				json: true,
				headers: {'User-Agent': 'request'}
			}, (err, res, data) => {
				if (!err && res.statusCode == 200) {
					statsInfo.raw = _.extend(statsInfo.raw, data)
					statsInfo.mainStats = {
						Name: statsInfo.raw.login,
						Completed: (statsInfo.raw.total_count > 3) ? true: false,
						Progress: statsInfo.raw.total_count + '/' + costants.minPullRequests,
						Contributions: []
					}
					statsInfo.raw.items.forEach(function(repository){
						if (repository.hasOwnProperty('repository_url')) {
							statsInfo.mainStats.Contributions.push(repository.repository_url)
						}
					})
					callback(statsInfo)
				} else {
					throw new Error('There was a problem retriving the information about that account. Error Message: ' + err.message)
				}
			})
		} else {
			throw new Error('There was a problem retriving the information about that account. Error Message: ' + err.message)
		}
	})

  var statsInfo = {}
  // First API call to get GitHub user informations.
  request.get(
    {
      url: gitHubAPIURLs[0].replace('%username%', username),
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
            if (!err && res.statusCode == 200) {
              statsInfo.raw = _.extend(statsInfo.raw, data)
              statsInfo.mainStats = {
                Name: statsInfo.raw.login,
                Completed: statsInfo.raw.total_count > 3 ? true : false,
                Progress: statsInfo.raw.total_count + '/' + costants.minPullRequests,
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
        throw new Error(
          'There was a problem retriving the information about that account. Error Message: ' + err.message
        )
      }
    }
  )
}

module.exports = hacktoberfestStats
