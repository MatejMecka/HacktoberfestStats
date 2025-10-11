import fetch from 'node-fetch';
const gitHubAPIURLs = {
    getUser: 'https://api.github.com/users/%username%',
    getPullRequests: 'https://api.github.com/search/issues?per_page=1000&q=-label:invalid+created:%year%-09-30T00:00:00-12:00..%year%-10-31T23:59:59-12:00+type:pr+is:public+author:%username%'
};
/**
 * Returns the minimum number of pull requests required for Hacktoberfest completion for a given year
 * @param year - The year to check requirements for
 * @returns The minimum number of pull requests required (5 for 2018, 6 for 2025, 4 for all other years)
 */
const getMinPullRequests = (year) => {
    switch (year) {
        case 2018:
            return 5;
        case 2025:
            return 6;
        default:
            return 4;
    }
};
/**
 * Validates that the provided year is within acceptable bounds for Hacktoberfest
 * @param year - The year to validate
 * @throws If year is greater than the current year
 * @throws If year is less than 2013 (when Hacktoberfest started)
 */
const _checkForValidYear = (year) => {
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
        throw new Error('Invalid year provided. The year must be less than or equal to the current year');
    }
    if (year < 2013) {
        throw new Error('Hacktoberfest started in 2013. Year must be equal to or above 2013!');
    }
};
/**
 * Makes an HTTP request to the specified URL
 * @param url - The URL to fetch
 * @returns A promise that resolves to the response text
 * @throws If the HTTP request fails
 */
const _query = async (url) => {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'request' }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
};
/**
 * Processes the result of a GitHub API query
 * @param url - The URL to query
 * @param callback - Optional callback function to handle the result
 * @param transform - Optional transformation function to apply to the parsed data
 * @returns Returns a promise if no callback is provided, otherwise undefined
 * @throws If there's a problem retrieving information from the API
 */
const _processResult = (url, callback, transform) => {
    if (callback) {
        _query(url)
            .then((body) => jsonPipe(body))
            .then((data) => (transform ? transform(data) : data))
            .then((result) => callback(result))
            .catch((err) => {
            throw new Error('There was a problem retrieving information for this account. Error Message: ' + (err ? err.message : ''));
        });
    }
    else {
        return _query(url)
            .then((body) => jsonPipe(body))
            .then((data) => (transform ? transform(data) : data));
    }
};
/**
 * Parses a JSON string into an object
 * @param body - The JSON string to parse
 * @returns The parsed JSON object
 */
const jsonPipe = (body) => JSON.parse(body);
function getUserInfo(username, callback) {
    const url = gitHubAPIURLs.getUser.replace('%username%', username);
    return _processResult(url, callback);
}
/**
 * Transforms GitHub API pull request data into Hacktoberfest statistics
 * @param minPullRequest - The minimum number of pull requests required
 * @returns A transformation function that takes GitHub API stats and returns formatted Hacktoberfest stats
 */
const _transformHacktoberfestResult = (minPullRequest) => (statsInfo) => ({
    completed: !!(statsInfo.total_count >= minPullRequest),
    current: statsInfo.total_count,
    required: minPullRequest,
    progress: statsInfo.total_count + '/' + minPullRequest,
    contributions: statsInfo.items.map((repo) => repo.repository_url)
});
function getHacktoberfestStats(username, yearOrCallback, callback) {
    let year;
    // Handle overloaded parameters
    if (typeof yearOrCallback === 'function') {
        callback = yearOrCallback;
        year = undefined;
    }
    else {
        year = yearOrCallback;
    }
    if (year !== undefined) {
        _checkForValidYear(year);
    }
    else {
        year = new Date().getFullYear();
    }
    const url = gitHubAPIURLs.getPullRequests
        .replace('%username%', username)
        .replace(new RegExp('%year%', 'g'), year.toString());
    const minPullRequest = getMinPullRequests(year);
    return _processResult(url, callback, _transformHacktoberfestResult(minPullRequest));
}
export { getUserInfo, getHacktoberfestStats };
