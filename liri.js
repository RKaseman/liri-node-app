
require("dotenv").config();
var keys = require("./keys.js");

// 

var fs = require("fs");
var request = require("request");
var moment = require("moment");
var npmSpotify = require("node-spotify-api");

// 

var action = process.argv[2];
var inputs = process.argv[3];

// 

switch (action) {
    case "concert-this":
        concert(inputs);
        break;

    case "spotify-this-song":
        song(inputs);
        break;

	case "movie-this":
        movie(inputs);
        break;

	case "do-what-it-says":
        dwis();
        break;
};

// 


// 

// needs for loop
// add date range search ?
function concert(inputs) {
    if (!inputs) {
        inputs = "My Bloody Valentine";
        console.log("--------");
        console.log("No input was given. Here's the band My Bloody Valentine:");
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";
    request(queryURL, function(error, response, body) {
        if (error) {
            return console.log(error);
        }
        if (!error && response.statusCode === 200) {
            collectInfo = JSON.parse(body)[0];
            concertDate = moment(collectInfo.datetime, "YYYY-MM-DD hh:mm:ss");
            console.log("--------");
            console.log("Venue: " + collectInfo.venue.name);
            console.log("Location: " + collectInfo.venue.city + " " + collectInfo.venue.region + ", " + collectInfo.venue.country);
            console.log("Date & Time: " + moment(concertDate).format("MM/DD/YYYY, h:mma"));
        }
    });
};

// 

function song(inputs) {
    var spotify = new npmSpotify(keys.spotify);
    if (!inputs) {
        inputs = "Come in Alone";
        console.log("--------");
        console.log("No input was given. Here's a song by the band My Bloody Valentine.");
    }
    var queryURL = "https://api.spotify.com/v1/search?q=" + inputs + "&type=track&market=US&offset=0&limit=1";
    spotify.request(queryURL, function(error, data) {
        if(error) {
            return console.log(error);
        }
        if (!error) {
            console.log("--------");
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Track Title: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
        }
    });
};

// 

// still have to enter movie in quotes
function movie(inputs) {
		if (!inputs) {
        	inputs = "My Bloody Valentine";
            console.log("--------");
            console.log("No input was given. Here's the movie 'My Bloody Valentine'.");
    	}
    var queryURL = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function(error, response, body) {
        if (error) {
            return console.log(error);
        }
		if (!error && response.statusCode === 200) {
            collectInfo = JSON.parse(body);
            console.log("--------");
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
        // console.log("data: " + data);
		var dataString = data.split(",");
        // console.log("dataString: " + dataString);
		if (dataString[0] === "spotify-this-song") {
            inputs = dataString[1];
            // console.log("inputs: " + inputs);
            song(inputs);
		}
  	});
};

