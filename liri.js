
require("dotenv").config();
var keysFile = require("./keys.js");

// 

var fs = require("fs");
var request = require("request");
var moment = require("moment");
var spotify = require("node-spotify-api");

// 

var action = process.argv[2];
var inputs = process.argv[3];

// 

switch (action) {
    case "concert-this":
    concert(inputs);
    break;

	case "movie-this":
	movie(inputs);
	break;

	case "do-what-it-says":
	dwis();
	break;
};

// 

console.log("--------");

// 



// needs for loop
function concert(inputs) {
    var queryURL = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";
    request(queryURL, function(error, response, body) {
        if (!inputs) {
            inputs = "Bloc Party";
            console.log("No input given. Bloc Party was searched.");
        }
        if (!error && response.statusCode === 200) {
            collectInfo = JSON.parse(body)[0];
            console.log(JSON.parse(body));
            // moment formatted date
            concertDate = moment(collectInfo.datetime, "YYYY-MM-DD hh:mm:ss");
            console.log("--------");
            console.log("Venue: " + collectInfo.venue.name);
            console.log("Location: " + collectInfo.venue.city + collectInfo.venue.region + ", " + collectInfo.venue.country);
            console.log("Date & Time: " + moment(concertDate).format("MM/DD/YYYY, h:mma"));
            console.log("--------");
        }
    });
};

// 

// still have to enter movie in quotes
function movie(inputs) {
    var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = "Manos The Hands of Fate";
    	}
		if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            console.log("--------");
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

// 

function dwis() {
	fs.readFile("random.txt", "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		}
		var dataArr = data.split(",");
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		}
  	});
};

