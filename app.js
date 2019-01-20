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

    .when('/favorites',{
        templateUrl : 'favorites.html',
        controller : 'FavoritesController'
    })

    .otherwise({redirectTo: 'gameRecaps.html'});
});


app.controller('RecapController', function($scope){
    $scope.message = "Hello from RecapController";
});

app.controller('CondensedController', function($scope){
    $scope.message = "Hello from CondensedController";
});

app.controller('FavoritesController', function($scope){
    $scope.message = "Hello from FavoritesController";
});