'use strict';
var request = require('request');
var cheerio = require('cheerio');


/**
 * Gives Hacktoberfest Statistics information
 * @param {string} username
 * @param {function} callback
 */


 function hacktoberfestStats(username, callback){
 	request("https://hacktoberfest.digitalocean.com/stats/" + username, function(err,  resp, html) {
        if (!err && resp.statusCode == 200){
        	var $ = cheerio.load(html);
                var name = $('span').eq(0).text();
                var completed = $('span').eq(2).text();
                if(completed.split(" ")[1] !== completed){
                        completed = "Not Completed."
                }
                var fullCompleted = $('span').eq(2).text();
                var progress = $('.u-textBold').eq(0).text();
                var contributions = [];
                var count = 2;
                while($('p').eq(count).text() !== "CHALLENGE COMPLETIONS TO-DATE"){
                        contributions.push($('p').eq(count).text()); 
                        count++;
                }


		
             

        	var statsInfo = {
        		Name: name, 
        		Completed: completed, 
        		CompletedMessage: fullCompleted, 
                        Progress: progress,
        		Contributions: contributions 
        	}

        	callback(statsInfo)

	       	

        }

        else {	


		throw new Error("There was a problem retriving the information about that account. Error Message: " + err.message)		


                }	


	 });

}

 module.exports = hacktoberfestStats;

