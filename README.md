# HacktoberfestStats [![npm version](https://badge.fury.io/js/hacktoberfeststats.svg)](https://badge.fury.io/js/hacktoberfeststats)   [ ![License:MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This Module can be used to retrieve all information about a given GitHub user within Hacktoberfest's event.

### Dependencies:
* Request
* Underscore
* Meow

### Installation:
`npm install hacktoberfeststats`

### Usage:

#### CLI

```sh
npx hacktoberfeststats MatejMecka # current year
npx hacktoberfeststats MatejMecka -y 2018
npx hacktoberfeststats MatejMecka --year 2018
```

#### API

```js
const { getHacktoberfestStats } = require('../main.js')	

// Using Callbacks
getHacktoberfestStats("MatejMecka", "2018", function(hacktoberfestStats,error){
	if (error) {
		console.log(error.message)
	} else {
		console.log(hacktoberfestStats)
	}
})

// Using Promises
getHacktoberfestStats('MatejMecka', '2018').then(stats => {
    console.log(stats)
})
```

### Options:

The callback function receives an object that contains these properties:

*mainStats*:
* Name: The person’s first name or username
* Completed: Is it Completed or Not. Returns a boolean
* Current: Integer - Number of pull requests
* Progress: How many pull requests a user has made: ex: `11/4`
* Contributions: Repositories where the user did pull requests
* Required: The Number of required pull requests for that year. - Array with URL's linking to Pull Requests
