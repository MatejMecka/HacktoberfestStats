# HacktoberfestStats [![npm version](https://badge.fury.io/js/hacktoberfeststats.svg)](https://badge.fury.io/js/hacktoberfeststats)   [ ![License:MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This Module can be used to retrieve all information about a given GitHub user within Hacktoberfest's event.

### Dependencies:
* Request
* Underscore

### Installation:
`npm install hacktoberfestStats`

### Usage:
```js
var Hacktoberfest = require('hacktoberfeststats')

Hacktoberfest("MatejMecka", "2017", function(hacktoberfestStats,error){
	if (error) {
		console.log(error.message)
	} else {
		console.log(hacktoberfestStats.mainStat)
	}
})
```

### Options:

The callback function receives an object that contains two properties:

*mainStats*:
* Name: The person’s first name or username
* Completed: Is it Completed or Not. Returns a boolean
* Progress: How many commits a user has made: ex: `11/4`
* Contributions: Repositories where the user did pull requests

*raw*: an object with all information about GitHub user and his/her activities made in October.
