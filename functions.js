function getGameContent(gameID, callback) {   

    console.log(gameID);
    $.getJSON('https://statsapi.web.nhl.com/api/v1/game/' + gameID + '/content').then(function(data){
        var videoURL = data.media.epg[3].items[0].playbacks[9].url;
        var pictureURL = data.media.epg[3].items[0].image.cuts['960x540'].src;

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

