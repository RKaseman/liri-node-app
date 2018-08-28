# liri-node-app

...is a node.js app that accepts 4 commands:

1. concert-this, to search for artist's upcoming shows
2. spotify-this-song, to search for a song title
3. movie-this, to search for a movie title
4. do-what-it-says, which fetches a song from an external .txt file

The theme for my version of liri is "My Bloody Valentine" because 
they're a great band and it's a crappy movie and so fits all 4 of 
the functionality requirements (although I chose to use a different 
band for the do-what-it-says option). When no input is given 
following the first 3 commands a "My Bloody Valentine" option is the 
default query return.

Search strings and the results are logged to the log.txt file.

The last hurdle of the assignment for me was figuring out how to 
allow user inputs without quotes.