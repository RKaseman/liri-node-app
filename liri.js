
require("dotenv").config();
var keysFile = require("./keys.js");
// var keysSpotify = new Spotify(keys.spotify);

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
// needs date range search
function concert(inputs) {
    var queryURL = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";
    request(queryURL, function(error, response, body) {
        if (error) {
            return console.log(error);
        }
        if (!inputs) {
            inputs = "Bloc Party";
            console.log("inputs : " + inputs);
            console.log("{FIX} queryURL : " + queryURL);
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
        }
    });
};

// 

// still have to enter movie in quotes
function movie(inputs) {
    var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
        if (error) {
            return console.log(error);
        }
		if (!inputs) {
        	inputs = "Manos+The+Hands+of+Fate";
            console.log("inputs : " + inputs);
            console.log("{FIX} queryUrl : " + queryUrl);
    	}
		if (!error && response.statusCode === 200) {
            collectInfo = JSON.parse(body);
		    console.log("Title: " + collectInfo.Title);
		    console.log("Year: " + collectInfo.Year);
		    console.log("IMDB Rating: " + collectInfo.imdbRating);
		    console.log("Rotten Tomatoes Rating: " + collectInfo.Ratings[1].Value);
		    console.log("Country: " + collectInfo.Country);
		    console.log("Language: " + collectInfo.Language);
		    console.log("Plot: " + collectInfo.Plot);
		    console.log("Actors: " + collectInfo.Actors);
		}
	});
};

// 

function dwis() {
	fs.readFile("random.txt", "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		}
		var dataArray = data.split(",");
		if (dataArray[0] === "spotify-this-song") {
			var randomSong = dataArray[1].slice(1, -1);
			spotify(randomSong);
		}
  	});
};

