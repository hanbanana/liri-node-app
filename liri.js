var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var keys = require("./keys");

var request = require("request");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var getArtistNames = function (artist) {
    return artist.name;
};

var getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;
            var data = [];
            for (var i = 0; i < songs.length; i++) {
                console.log("Artist: " + songs[i].artists[0].name);
                console.log("Song Name: " + songs[i].name);
                console.log("Spotify Preview Link: " + songs[i].external_urls.spotify);
                console.log("Album: " + songs[i].album.name);
                fs.appendFile('log.txt', "\n" + "Artist: " + songs[i].artists[0].name + "\n" + "Song Name: " + songs[i].name + "\n" + "Spotify Preview Link: " + songs[i].external_urls.spotify + "\n" + "Album: " + songs[i].album.name  + "\n" + "=================================================================");
            };

        });
    };


var getMyTweets = function () {
    var client = new Twitter(keys.twitterKeys);

    var params = { screen_name: 'hansunglee4', count: 10 };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {
            var data = []; 
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text + " Created on: " + tweets[i].created_at);
                fs.appendFile('log.txt', "\n" + tweets[i].text + " Created on: " + tweets[i].created_at + "\n");
            }
            fs.appendFile('log.txt', "=================================================================");
        };

    });
};


var getMeMovie = function (movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(urlHit, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieData = JSON.parse(body);
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
            console.log("Rotten Tomatoes Rating: " + movieData.tomatoUserRating);
            console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
            fs.appendFile('log.txt', "\n" + "Title: " + movieData.Title + "\n" + "Year: " 
            + movieData.Year + "\n" + "IMDB Rating: " + movieData.imdbRating + "\n" + "Country: " 
            + movieData.Country + "\n" + "Language: " + movieData.Language + "\n" + "Plot: " 
            + movieData.Plot + "\n" + "Actors: " + movieData.Actors + "\n" + "Rotten Tomatoes Rating: " 
            + movieData.tomatoUserRating + "\n" + "Rotten Tomatoes URL: " + movieData.tomatoURL + "\n" 
            + "=================================================================");
       }
       else {
            console.log(error);
       }
  });
}

var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        }
        else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

var pick = function (caseData, functionData) {
    switch (caseData) {
        case "my-tweets":
            getMyTweets();
            break;
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMeMovie(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI doesn't know that");
    }
};


var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
