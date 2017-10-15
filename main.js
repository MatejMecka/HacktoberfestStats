'use strict';
 var request = require('request');

/**
 * Gives Hacktoberfest Statistics information
 * @param {string} username
 * @param {function} callback
 */

var gitHubAPIURLs = ["https://api.github.com/users/%username%",
                      "https://api.github.com/search/issues?per_page=1000&q=-label:invalid+created:%year%-09-30T00:00:00-12:00..%year%-10-31T23:59:59-12:00+type:pr+is:public+author:%username%"];
const costants = {
  minPullRequests: 4,
}


function hacktoberfestStats(username, year, callback) {
    var statsInfo = {};
    // First API call to get GitHub user informations.
    request.get({
        url: gitHubAPIURLs[0].replace("%username%", username),
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
        if (!err && res.statusCode == 200) {
          statsInfo.Name = data.name;
          // Second API call to get Hacktoberfest user informations.
          request.get({
              url: gitHubAPIURLs[1].replace("%username%", username).replace(new RegExp("%year%", 'g'), year),
              json: true,
              headers: {'User-Agent': 'request'}
            }, (err, res, data) => {
              if (!err && res.statusCode == 200) {
                statsInfo.Completed = (data.total_count > 3) ? true: false;
                statsInfo.Progress = data.total_count + "/" + costants.minPullRequests;
                statsInfo.Contributions = [];
                data.items.forEach(function(repository){
                  if (repository.hasOwnProperty("repository_url")) {
                    statsInfo.Contributions.push(repository.repository_url)
                  }
                });
                callback(statsInfo);
              } else {
                throw new Error("There was a problem retriving the information about that account. Error Message: " + err.message)
              }
          });
        } else {
          throw new Error("There was a problem retriving the information about that account. Error Message: " + err.message)
        }
    });
}

module.exports = hacktoberfestStats;
