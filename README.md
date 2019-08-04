# LIRI Bot

### Overview

In this assignment, I created a script that works like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

The parameters are:

* `concert-this`

* `spotify-this-song`

* `movie-this`

* `do-what-it-says`

### What Each Command Does

1. `node liri.js concert-this <artist/band name here>`

* This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

* Name of the venue

* Venue location

* Date of the Event (use moment to format this as "MM/DD/YYYY")

2. `node liri.js spotify-this-song <song name here>`

* This will show the following information about the song in your terminal/bash window

* Artist(s)

* The song's name

* A preview link of the song from Spotify

* The album that the song is from

* If no song is provided then program will default to "Sign o' the Times" by Prince.

3. `node liri.js movie-this '<movie name here>'`

* This will output the following information to your terminal/bash window:

```
* Title of the movie.
* Year the movie came out.
* IMDB Rating of the movie.
* Rotten Tomatoes Rating of the movie.
* Country where the movie was produced.
* Language of the movie.
* Plot of the movie.
* Actors in the movie.
```

* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

4. `node liri.js do-what-it-says`

* Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

* It should run `spotify-this-song` for "Bohemian Rhapsody" as follows the text in `random.txt`.

* The text in random.txt can also be edited to run movie-this and concert-this as well.

### View following YouTube video link for demo

[![LIRI Node App Demo](https://img.youtube.com/vi/sYE5-vMXrJ0/hqdefault.jpg)](https://youtu.be/sYE5-vMXrJ0)
