'use strict'
import fetch from 'node-fetch'

const gitHubAPIURLs = {
  getUser: 'https://api.github.com/users/%username%',
  getPullRequests:
    'https://api.github.com/search/issues?per_page=1000&q=-label:invalid+created:%year%-09-30T00:00:00-12:00..%year%-10-31T23:59:59-12:00+type:pr+is:public+author:%username%'
}

/**
 * Returns the minimum number of pull requests required for Hacktoberfest completion for a given year
 * @param {number} year - The year to check requirements for
 * @returns {number} The minimum number of pull requests required (5 for 2018, 6 for 2025, 4 for all other years)
 */
const getMinPullRequests = (year) => {
  switch (year) {
  case 2018:
    return 5
  case 2025:
    return 6
  default:
    return 4
  }
}

/**
 * Validates that the provided year is within acceptable bounds for Hacktoberfest
 * @private
 * @param {number} year - The year to validate
 * @throws {Error} If year is greater than the current year
 * @throws {Error} If year is less than 2013 (when Hacktoberfest started)
 */
const _checkForValidYear = (year) => {
  let currentYear = new Date().getFullYear()
  if (year > currentYear) {
    throw new Error('Invalid year provided. The year must be less than or equal to the current year')
  }
  if (year < 2013) {
    throw new Error('Hacktoberfest started in 2013. Year must be equal to or above 2013!')
  }
}

/**
 * Makes an HTTP request to the specified URL
 * @private
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} A promise that resolves to the response text
 * @throws {Error} If the HTTP request fails
 */
const _query = async (url) => {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'request' }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.text()
}

/**
 * Processes the result of a GitHub API query
 * @private
 * @param {string} url - The URL to query
 * @param {function} [callback] - Optional callback function to handle the result
 * @param {function} [transform] - Optional transformation function to apply to the parsed data
 * @returns {Promise|undefined} Returns a promise if no callback is provided, otherwise undefined
 * @throws {Error} If there's a problem retrieving information from the API
 */
const _processResult = (url, callback, transform) => {
  if (callback) {
    _query(url)
      .then(jsonPipe)
      .then((data) => (transform ? transform(data) : data))
      .then((result) => callback(result))
      .catch((err) => {
        throw new Error(
          'There was a problem retrieving information for this account. Error Message: ' + (err ? err.message : '')
        )
      })
  } else {
    return _query(url)
      .then(jsonPipe)
      .then((data) => (transform ? transform(data) : data))
  }
}

/**
 * Parses a JSON string into an object
 * @private
 * @param {string} body - The JSON string to parse
 * @returns {Object} The parsed JSON object
 */
const jsonPipe = (body) => JSON.parse(body)


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

/**
 * Transforms GitHub API pull request data into Hacktoberfest statistics
 * @private
 * @param {number} minPullRequest - The minimum number of pull requests required
 * @returns {function} A transformation function that takes GitHub API stats and returns formatted Hacktoberfest stats
 * @returns {Object} The transformed stats object
 * @returns {boolean} returns.completed - Whether the user has completed Hacktoberfest requirements
 * @returns {number} returns.current - The current number of pull requests
 * @returns {number} returns.required - The required number of pull requests
 * @returns {string} returns.progress - Progress as a formatted string (e.g., "4/4")
 * @returns {string[]} returns.contributions - Array of repository URLs where contributions were made
 */
const _transformHacktoberfestResult = (minPullRequest) => (statsInfo) => ({
  completed: !!(statsInfo.total_count >= minPullRequest),
  current: statsInfo.total_count,
  required: minPullRequest,
  progress: statsInfo.total_count + '/' + minPullRequest,
  contributions: statsInfo.items.map((repo) => repo.repository_url)
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

export { getUserInfo, getHacktoberfestStats }
