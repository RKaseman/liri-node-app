
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

function song(inputs) {
    var spotify = new npmSpotify(keys.spotify);
    var queryURL = "https://api.spotify.com/v1/search?q=" + inputs + "&type=track&market=US&offset=0&limit=1";
    spotify.request(queryURL, function(error, data) {
        console.log("queryURL : " + queryURL);
        console.log("--------");
        if(error) {
            return console.log(error);
        }
        if (!inputs) {
            inputs = "Honeychain";
            console.log("inputs : " + inputs);
            console.log("--------");
        }
        if (!error) {
            // console.log(data);
            // console.log("---- ^ data ^ ----");
            // console.log(data.tracks);
            // console.log("---- ^ data.tracks ^ ----");
            console.log(data.tracks.items[0]);
            console.log("---- ^ data.tracks.items[0] ^ ----");
            console.log(data.tracks.items[0].artists[0].name);
            console.log("---- ^ data.tracks.items[0].artists[0].name ^ ----");
            console.log(data.tracks.items[0].name);
            console.log("---- ^ data.tracks.items[0].name ^ ----");
            console.log(data.tracks.items[0].album.name);
            console.log("---- ^ data.tracks.items[0].album.name ^ ----");
        }
    });
};

// 

// still have to enter movie in quotes
function movie(inputs) {
    var queryURL = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function(error, response, body) {
        if (error) {
            return console.log(error);
        }
		if (!inputs) {
        	inputs = "Manos+The+Hands+of+Fate";
            console.log("inputs : " + inputs);
            console.log("{FIX} queryURL : " + queryURL);
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

