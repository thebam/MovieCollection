var movieApp = angular.module('moviesApp', ['ngRoute']);
movieApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'content/pages/home.html',
        controller: 'mainController'
    })
    .when('/add', {
        templateUrl: 'content/pages/movieForm.html',
        controller: 'addController'
    })
    .when('/edit', {
        templateUrl: 'content/pages/movieForm.html',
        controller: 'editController'
    });
});