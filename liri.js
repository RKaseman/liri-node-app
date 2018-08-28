
// variables and requires
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var npmSpotify = require("node-spotify-api");

// user input
var action = process.argv[2];
var inputs = process.argv[3];


// user input switch cases
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


// case "concert-this" + user input (artist)
function concert(inputs) {
    // if no user input, fetch My Bloody Valentine shows
    if (!inputs) {
        inputs = "My Bloody Valentine";
        console.log("--------");
        console.log("No input was given. Here's the band My Bloody Valentine...");
    } // end if !inputs
    fs.appendFile("log.txt", ">> " + inputs + ":\n\n", function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("--------");
            console.log("Logged results");
        }
    }); // end fs.appendFile (results)

    var queryURL = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";

    request(queryURL, function(error, response, body) {
        if (error) {
            return console.log(error);
        } // end if error
        if (!error && response.statusCode === 200) {
            collectInfo = JSON.parse(body);
            // loop through body results and list all
            for (var i = 0; i < collectInfo.length; i++) {
                concertDate = moment(collectInfo[i].datetime, "YYYY-MM-DD hh:mm:ss");
                console.log("--------");
                console.log("Venue: " + collectInfo[i].venue.name);
                console.log("Location: " + collectInfo[i].venue.city + " " + collectInfo[i].venue.region + ", " + collectInfo[i].venue.country);
                // moment formatted date and time
                console.log("Date & Time: " + moment(concertDate).format("MM/DD/YYYY, h:mma"));
                fs.appendFile("log.txt", "Venue: " + collectInfo[i].venue.name 
                    + "\n"
                    + "Location: " 
                    + collectInfo[i].venue.city 
                    + collectInfo[i].venue.region 
                    + ", " 
                    + collectInfo[i].venue.country 
                    + "\n"
                    + "Date & Time: " 
                    + moment(concertDate).format("MM/DD/YYYY, h:mma")
                    + "\n\n", function (error) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log("--------");
                        console.log("Logged results");
                    }
                }) // end if error on fs.appendFile
            } // end for i
        } // end if !error
    }) // end request
}; // end concert search function

// 

// case "spotify-this-song" + user input (song title)
function song(inputs) {
    var spotify = new npmSpotify(keys.spotify);
    // if no user input, fetch a My Bloody Valentine song
    if (!inputs) {
        inputs = "Come in Alone";
        console.log("--------");
        console.log("No input was given. Here's a song by the band My Bloody Valentine...");
    } // end if !inputs
    var queryURL = "https://api.spotify.com/v1/search?q=" + inputs + "&type=track&market=US&offset=0&limit=5";
    spotify.request(queryURL, function(error, data) {
        if (error) {
            return console.log(error);
        } // end if error
        if (!error) {
            console.log("--------");
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Track Title: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
        } // end if !error
    }); // end spotify.request
}; // end song title search function

// 

// still have to enter movie in quotes
// case "movie-this" + user input (movie title)
function movie(inputs) {
    // if no user input, fetch the 1981 version of "My Bloody Valentine"
    if (!inputs) {
        inputs = "My Bloody Valentine";
        console.log("--------");
        console.log("No input was given. Here's the (original) movie 'My Bloody Valentine'...");
        var queryURL = "http://www.omdbapi.com/?t=" + inputs + "&y=1981&plot=short&apikey=trilogy";
        request(queryURL, function (error, response, body) {
            if (error) {
                return console.log(error);
            } // end if error
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
                return;
            } // end if !error
        }); // end special query (has date inserted to get correct release)
    } // end if !inputs
    else {
        // user input (movie title)
        var queryURL = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
        request(queryURL, function(error, response, body) {
            if (error) {
                return console.log(error);
            } // end if error
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
            } // end if !error
        }); // end request
    }; // end else
}; // end movie title search function

// 

// case "do-what-it-says" (no user input) fetches the Seam song "Little Chang, Big City" from random.txt
function dwis() {
	fs.readFile("random.txt", "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		} // end if error
		var dataString = data.split(",");
		if (dataString[0] === "spotify-this-song") {
            inputs = dataString[1];
            song(inputs);
		} // end if var dataString array has a command & value-to-search
  	}); // end fs.readFile of random.txt
}; // end do-what-it-says function

