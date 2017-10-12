# HacktoberfestStats
*THIS MODULE IS STILL NOT PUBLISHED ON NPM*

This is a Module that scrapes Hacktoberfest's site and returns information on how you are doing. 

### Dependencies:
* Cheerio
* Request

### Installation:
`npm install hacktoberfestStats`

### Usage:
```js
var Hacktoberfest = require('./main.js')

Hacktoberfest("MatejMecka", function(hacktoberfestStats,error){

	if (error) {

		console.log(error.message)

	}
	
	else {
		console.log(statsInfo)
	}

})

```

### Options:

* Name: The Person’s first name or Username
* Completed: Is it Completed or Not
* Completed Message: Returns the full message
* Progress: How many commits a user has made: ex: `11/4`
* Contributions: All the Contributions a user did

