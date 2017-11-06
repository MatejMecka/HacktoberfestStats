# HacktoberfestStats [![npm version](https://badge.fury.io/js/hacktoberfeststats.svg)](https://badge.fury.io/js/hacktoberfeststats)   [ ![License:MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This Module can be used to retrive all informations about a given GitHub user within Hacktoberfest's event.

### Dependencies:
* Request
* Underscore

### Installation:
`npm install hacktoberfeststats`

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

The callback function receive an object that contain two properties:

*mainStats*:
* Name: The Person’s first name or Username
* Completed: Is it Completed or Not. Returns a boolean
* Progress: How many commits a user has made: ex: `11/4`
* Contributions: Repositories where the user did pull requests

*raw*: an object with all informations about GitHub user and the informations on his activities made in October.
