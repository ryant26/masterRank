var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
const jsdom = require('jsdom');
const {JSDOM} = jsdom; 

function range(start, edge, step) {
  	// If only one number was passed in make it the edge and 0 the start.
	if (arguments.length == 1) {
		edge = start;
		start = 0;
	}

	// Validate the edge and step numbers.
	edge = edge || 0;
	step = step || 1;

	// Create the array of numbers, stopping before the edge.
	for (var ret = []; (edge - start) * step > 0; start += step) {
		ret.push(start);
	}
	return ret;
}

function getOverwatchNames(i) {
	var listOfGamerTags = 
		rp('https://overwatchtracker.com/leaderboards/pc/global/CompetitiveRank?page='+ i +'&mode=1')
			.then(function(body){	
					const dom = new JSDOM(body); 
					var allDataToolTips = dom.window.document.querySelectorAll('[data-tooltip]');
					var allData = []; 
					for (let i=0; i<allDataToolTips.length; i++) {
						allData.push(allDataToolTips[i].textContent); 
					} 
					//console.log(allData); 
					//console.log("number: " + i); 
					return allData; 
			})
			.catch(function (err) {
				console.log("crawl failed ...");
			});
	
	/* store promise results: */
	listOfGamerTags.then((allData) => {
		// console.log(allData);
		fs.writeFile("owNames" + i + ".csv",allData, function(err) {
			if (err) {
				return console.log(err); 
			}
			console.log("file saved: test#" + i);
		});
	});
}	

/** 
 * 100 usernames per page
 * I'd recommend crawling about 50 to 100 pages at a time
 * Range up to a lot - say 1300 pages?, some will fail because the website also fails to load and the nature of js
**/
// let allDataPromises = range(20).map((i) => getOverwatchNames(i));
let allDataPromises = range(1200,1300,1).map((i) => getOverwatchNames(i));
// Promise.all(allDataPromises).then((allData) => { storeToMongo(); }); 