# HacktoberfestStats [![npm version](https://badge.fury.io/js/hacktoberfeststats.svg)](https://badge.fury.io/js/hacktoberfeststats)

This is a Module that scrapes Hacktoberfest's site and returns information on how you are doing. 

### Dependencies:
* Request

### Installation:
`npm install hacktoberfestStats`

### Usage:
```js
var Hacktoberfest = require('hacktoberfeststats')

Hacktoberfest("MatejMecka", "2017", function(hacktoberfestStats,error){
	if (error) {
		console.log(error.message)
	} else {
		console.log(statsInfo)
	}

})

```

### Options:

* Name: The Person’s first name or Username
* Completed: Is it Completed or Not. Returns a boolean
* Progress: How many commits a user has made: ex: `11/4`
* Contributions: Repositories where the user did pull requests

