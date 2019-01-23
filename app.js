const electron = require('electron');
window.jQuery = window.$ = require('jquery'); //This takes the place of require for js. Electron handles importing differently.

var app = angular.module('NHLRecaps', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl : 'gameRecaps.html',
        controller : 'RecapController'
    })

    .when('/condensedGames',{
        templateUrl : 'condensedGames.html',
        controller : 'CondensedController'
    })

    .when('/standings',{
        templateUrl : 'standings.html',
        controller : 'StandingsController'
    })

    .otherwise({redirectTo: 'gameRecaps.html'});
});


app.controller('RecapController', function(){
    angular.element(document).ready(function(){
        getGames("recap");
    });
});

app.controller('CondensedController', function(){
    angular.element(document).ready(function(){
        getGames("condensed");
    });
});

app.controller('StandingsController', function(){
    console.log(getStandings());
});

////////////////////
/* MAIN FUNCTIONS */
////////////////////

function getGameContent(gameID, typeOfGame, callback) {   

    $.getJSON('https://statsapi.web.nhl.com/api/v1/game/' + gameID + '/content').then(function(data){
        if(typeOfGame == "recap"){
            var videoURL = data.media.epg[3].items[0].playbacks[9].url;
            var pictureURL = data.media.epg[3].items[0].image.cuts['960x540'].src;
        }
        else{
            var videoURL = data.media.epg[2].items[0].playbacks[9].url;
            var pictureURL = data.media.epg[2].items[0].image.cuts['960x540'].src;    
        }
        callback(videoURL, pictureURL);
    });
}

//returns list of game id's for the selected day
function getGamesAccordingToDate(date, callback){
    $.getJSON('https://statsapi.web.nhl.com/api/v1/schedule?date=' + date).then(function(data){
        var gameIds = [];
        var matchups = [];

        data.dates[0].games.forEach(function(e){
            gameIds.push(e.gamePk);
            matchups.push(e.teams.away.team.name + " vs " + e.teams.home.team.name);
            // console.log(data.dates[0].games);
        });
        callback(gameIds, matchups);

    });
}

function getTodaysDate(){
    var date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

//Used to get past dates. For instance, Yesterday would require an input variable of 1. Two days ago would have an input of 2. Etc..
function getOlderDate(numOfDays){
    var date = new Date();
    date.setDate(date.getDate() - numOfDays);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}

/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

function getGames(typeOfGame){
    getGamesAccordingToDate(getOlderDate(1), function(gamesForTheDay, matchups){
    var i = 0;
    var header = document.createElement("h1");
    header.textContent = getOlderDate(1);
    var videoWrapper = document.createElement("div");
    videoWrapper.className = "wrapper";
    videoWrapper.id = "videoWrapper1";
    document.getElementById("videos").appendChild(header);
    document.getElementById("videos").appendChild(videoWrapper);
    gamesForTheDay.forEach(function(e){
        getGameContent(e, typeOfGame, function(videoURL, pictureURL){
            var newDiv = document.createElement("div");
            newDiv.className = "box " + e;
            newDiv.id = "video" + e;
            document.getElementById('videoWrapper1').appendChild(newDiv);
            var newVideo = document.createElement("video");
            newVideo.width = "300";
            newVideo.height = "200";
            newVideo.src = videoURL;
            newVideo.poster = pictureURL;
            newVideo.controls = true;
            document.getElementById('video' + e).appendChild(newVideo);
            var gameMatchup = document.createElement("p");
            gameMatchup.textContent = matchups[i];
            gameMatchup.id = "gameMatchup";
            document.getElementById('video' + e).insertAdjacentElement("afterbegin", gameMatchup);
            i++;
            });
        });
    }); 
    getGamesAccordingToDate(getOlderDate(2), function(gamesForTheDay, matchups){
        var i = 0;
        var header = document.createElement("h1");
        header.textContent = getOlderDate(2);
        header.id = "videoHeader2";
        var videoWrapper = document.createElement("div");
        videoWrapper.className = "wrapper";
        videoWrapper.id = "videoWrapper2";
        header.appendAfter(document.getElementById("videoWrapper1"));
        videoWrapper.appendAfter(document.getElementById("videoHeader2"));
        gamesForTheDay.forEach(function(e){
            getGameContent(e, typeOfGame, function(videoURL, pictureURL){
                var newDiv = document.createElement("div");
                newDiv.className = "box " + e;
                newDiv.id = "video" + e;
                document.getElementById('videoWrapper2').appendChild(newDiv);
                var newVideo = document.createElement("video");
                newVideo.width = "300";
                newVideo.height = "200";
                newVideo.src = videoURL;
                newVideo.poster = pictureURL;
                newVideo.controls = true;
                document.getElementById('video' + e).appendChild(newVideo);
                var gameMatchup = document.createElement("p");
                gameMatchup.textContent = matchups[i];
                gameMatchup.id = "gameMatchup";
                document.getElementById('video' + e).insertAdjacentElement("afterbegin", gameMatchup);
                i++;
            });
        });
    });
}

function getStandings(){
    $.getJSON('https://statsapi.web.nhl.com/api/v1/standings').then(function(data){
        console.log(data.records);
        return data.records;
    });
}