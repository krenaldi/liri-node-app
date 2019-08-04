// Require dotenv package to set environment variables from .env file
require("dotenv").config();

// Import the key.js file
var keys = require("./keys.js");

// Require "node-spotify-api"
var Spotify = require("node-spotify-api");

// Import the Spotify API to access the key information
var spotify = new Spotify(keys.spotify);

// Include axios npm package
var axios = require("axios");
// Include file-system node
var fs = require("fs");
// Include moment npm package
var moment = require("moment");

// Variables for argv
var action = process.argv[2];

// Variable for dividers
var divider = "\n-----------------------------------------------------------------------------------------\n";
var logbreak = "\n=======================================END LOG===========================================\n";

// The switch-case to direct which function gets run.
switch (action) {
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doThis();
        break;
}

// Function to read random.txt and do what it says
function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Print the contents of data
        //console.log(data);

        // Then split it by commas (to make it more readable) and turn it to an array
        var dataArr = data.split(",");

        // Console array for testing
        //console.log(dataArr);

        if (dataArr[0] == "spotify-this-song") {
            var song = dataArr[1];
            spotify.search({ type: 'track', query: song }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                //console.log(data);
                var jsonData = data.tracks.items;
                var showData = [
                    "Artist: " + jsonData[0].album.artists[0].name,
                    "Song Title: " + jsonData[0].name,
                    "Albumn: " + jsonData[0].album.name,
                    "Preview Link of Song from Spotify: " + jsonData[0].album.external_urls.spotify
                ].join("\n");
                console.log(divider + showData + divider);
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + showData + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            });
        } else if (dataArr[0] == "movie-this") {
            var movieName = dataArr[1];
            // Then run a request with axios to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

            //console.log(queryUrl);

            axios.get(queryUrl).then(
                function (response) {
                    var jsonData = response.data;
                    var showData = [
                        "Title: " + jsonData.Title,
                        "Release Year: " + jsonData.Year,
                        "IMDB Rating: " + jsonData.imdbRating,
                        "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                        "Country Produced: " + jsonData.Country,
                        "Language: " + jsonData.Language,
                        "Plot: " + jsonData.Plot,
                        "Actors: " + jsonData.Actors
                    ].join("\n");
                    console.log(divider + showData + divider);
                    var datetime = new Date();
                    var logdate = moment(datetime).format("LL LTS");
                    //console.log(logdate);
                    var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + showData + divider + logbreak;
                    fs.appendFile("log.txt", data, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        //console.log("log.txt updated!")
                    });
                })
                .catch(function (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        var error = [
                            "---------------Data---------------",
                            error.response.data,
                            "---------------Status---------------",
                            error.response.status,
                            "---------------Headers---------------",
                            error.response.headers
                        ].join("\n");
                        var datetime = new Date();
                        var logdate = moment(datetime).format("LL LTS");
                        //console.log(logdate);
                        console.log(error);
                        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error + divider + logbreak;
                        fs.appendFile("log.txt", data, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            //console.log("log.txt updated!")
                        });
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an object that comes back with details pertaining to the error that occurred.
                        console.log(error.request);
                        var datetime = new Date();
                        var logdate = moment(datetime).format("LL LTS");
                        //console.log(logdate);
                        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "NO RESPONSE FROM SERVER: " + error.request + divider + logbreak;
                        fs.appendFile("log.txt", data, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            //console.log("log.txt updated!")
                        });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log("Error: " + error.message);
                        var datetime = new Date();
                        var logdate = moment(datetime).format("LL LTS");
                        //console.log(logdate);
                        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "Error: " + error.message + divider + logbreak;
                        fs.appendFile("log.txt", data, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            //console.log("log.txt updated!")
                        });
                    }
                    console.log(error.config);
                    var datetime = new Date();
                    var logdate = moment(datetime).format("LL LTS");
                    //console.log(logdate);
                    var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error.config + divider + logbreak;
                    fs.appendFile("log.txt", data, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        //console.log("log.txt updated!")
                    });
                });
        } else if (dataArr[0] == "concert-this") {
            var artist = dataArr[1];
            // Then run a request with axios to the BandsInTown API with the artist specified
            var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

            //console.log(queryUrl);

            axios.get(queryUrl).then(
                function (response) {
                    var jsonData = response.data;
                    var eventDate = jsonData[0].datetime;
                    var convertedDate = moment(eventDate).format("MM/DD/YYYY");
                    //console.log(convertedDate);
                    var showData = [
                        "Venue: " + jsonData[0].venue.name,
                        "Location: " + jsonData[0].venue.city + ", " + jsonData[0].venue.region + " " + jsonData[0].venue.country,
                        "Date of Event: " + convertedDate
                    ].join("\n")
                    console.log(divider + showData + divider);
                    var datetime = new Date();
                    var logdate = moment(datetime).format("LL LTS");
                    //console.log(logdate);
                    var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + showData + divider + logbreak;
                    fs.appendFile("log.txt", data, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        //console.log("log.txt updated!")
                    });
                })
                .catch(function (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        var error = [
                            "---------------Data---------------",
                            error.response.data,
                            "---------------Status---------------",
                            error.response.status,
                            "---------------Headers---------------",
                            error.response.headers
                        ].join("\n");
                        console.log(error);
                        var datetime = new Date();
                        var logdate = moment(datetime).format("LL LTS");
                        //console.log(logdate);
                        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error + divider + logbreak;
                        fs.appendFile("log.txt", data, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            //console.log("log.txt updated!")
                        });
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an object that comes back with details pertaining to the error that occurred.
                        console.log(error.request);
                        var datetime = new Date();
                        var logdate = moment(datetime).format("LL LTS");
                        //console.log(logdate);
                        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "NO RESPONSE FROM SERVER: " + error.request + divider + logbreak;
                        fs.appendFile("log.txt", data, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            //console.log("log.txt updated!")
                        });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log("Error: ", error.message);
                        var datetime = new Date();
                        var logdate = moment(datetime).format("LL LTS");
                        //console.log(logdate);
                        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "Error: " + error.message + divider + logbreak;
                        fs.appendFile("log.txt", data, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            //console.log("log.txt updated!")
                        });
                    }
                    console.log(error.config);
                    var datetime = new Date();
                    var logdate = moment(datetime).format("LL LTS");
                    //console.log(logdate);
                    var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error.config + divider + logbreak;
                    fs.appendFile("log.txt", data, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        //console.log("log.txt updated!")
                    });
                });
        }
    });
}

function spotifyThis() {

    // Condition statement to determine if process.argv[3] is filled out
    if (!process.argv[3]) {
        var song = "Sign o the Times";
    } else {
        // Variable for song
        var song = process.argv.slice(3).join(" ");
    }

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //console.log(data);
        var jsonData = data.tracks.items;
        var showData = [
            "Artist: " + jsonData[0].album.artists[0].name,
            "Song Title: " + jsonData[0].name,
            "Albumn: " + jsonData[0].album.name,
            "Preview Link of Song from Spotify: " + jsonData[0].album.external_urls.spotify
        ].join("\n");
        console.log(divider + showData + divider);
        var datetime = new Date();
        var logdate = moment(datetime).format("LL LTS");
        //console.log(logdate);
        var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + showData + divider + logbreak;
        fs.appendFile("log.txt", data, function (err) {
            if (err) {
                return console.log(err);
            }
            //console.log("log.txt updated!")
        });
    });
}

function movieThis() {
    // Condition statement to determine if process.argv[3] is filled out
    if (!process.argv[3]) {
        var movieName = "Mr+Nobody";
    } else {
        // Variable for holding the movie name in argv[3]
        var movieName = process.argv.slice(3).join("+");
    }

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    //console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {
            var jsonData = response.data;
            var showData = [
                "Title: " + jsonData.Title,
                "Release Year: " + jsonData.Year,
                "IMDB Rating: " + jsonData.imdbRating,
                "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                "Country Produced: " + jsonData.Country,
                "Language: " + jsonData.Language,
                "Plot: " + jsonData.Plot,
                "Actors: " + jsonData.Actors
            ].join("\n");
            console.log(divider + showData + divider);
            var datetime = new Date();
            var logdate = moment(datetime).format("LL LTS");
            //console.log(logdate);
            var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + showData + divider + logbreak;
            fs.appendFile("log.txt", data, function (err) {
                if (err) {
                    return console.log(err);
                }
                //console.log("log.txt updated!")
            });
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                var error = [
                    "---------------Data---------------",
                    error.response.data,
                    "---------------Status---------------",
                    error.response.status,
                    "---------------Headers---------------",
                    error.response.headers
                ].join("\n");
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                console.log(error);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "NO RESPONSE FROM SERVER: " + error.request + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error: ", error.message);
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "Error: " + error.message + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            }
            console.log(error.config);
            var datetime = new Date();
            var logdate = moment(datetime).format("LL LTS");
            //console.log(logdate);
            var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error.config + divider + logbreak;
            fs.appendFile("log.txt", data, function (err) {
                if (err) {
                    return console.log(err);
                }
                //console.log("log.txt updated!")
            });
        });
}

function concertThis() {
    // Variable for artist
    var artist = process.argv.slice(3).join("+");

    // Then run a request with axios to the BandsInTown API with the artist specified
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    //console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {
            var jsonData = response.data;
            var eventDate = jsonData[0].datetime;
            var convertedDate = moment(eventDate).format("MM/DD/YYYY");
            //console.log(convertedDate);
            var showData = [
                "Venue: " + jsonData[0].venue.name,
                "Location: " + jsonData[0].venue.city + ", " + jsonData[0].venue.region + " " + jsonData[0].venue.country,
                "Date of Event: " + convertedDate
            ].join("\n")
            console.log(divider + showData + divider);
            var datetime = new Date();
            var logdate = moment(datetime).format("LL LTS");
            //console.log(logdate);
            var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + showData + divider + logbreak;
            fs.appendFile("log.txt", data, function (err) {
                if (err) {
                    return console.log(err);
                }
                //console.log("log.txt updated!")
            });
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                var error = [
                    "---------------Data---------------",
                    error.response.data,
                    "---------------Status---------------",
                    error.response.status,
                    "---------------Headers---------------",
                    error.response.headers
                ].join("\n");
                console.log(error);
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "NO RESPONSE FROM SERVER: " + error.request + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error: ", error.message);
                var datetime = new Date();
                var logdate = moment(datetime).format("LL LTS");
                //console.log(logdate);
                var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + "Error: " + error.message + divider + logbreak;
                fs.appendFile("log.txt", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    //console.log("log.txt updated!")
                });
            }
            console.log(error.config);
            var datetime = new Date();
            var logdate = moment(datetime).format("LL LTS");
            //console.log(logdate);
            var data = logdate + " " + action + " " + process.argv.slice(3).join(" ") + "\r" + divider + error.config + divider + logbreak;
            fs.appendFile("log.txt", data, function (err) {
                if (err) {
                    return console.log(err);
                }
                //console.log("log.txt updated!")
            });
        });
}