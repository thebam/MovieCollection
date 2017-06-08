movieApp.service('MovieService', function ($http) {
    this.getMovies = function (sortCol,sortDirect,pageNum,pageSize) {
        return $http.get("api/Movies/GetMovies?sortColumn=" + sortCol + "&sortDirection=" + sortDirect + "&pageNumber=" + pageNum + "&pageSize=" + pageSize);
    }
    this.getGenres = function ($scope) {
        $http.get("api/Movies/GetGenres").then(function (response) {
            $scope.genres = response.data;
        },function (error) {
            $scope.errorDialog = true;
            $scope.errorMessage = "Network error. Please try again.";
            $scope.processingRequest = true;
        });
    }
    this.getSubGenres = function ($scope) {
        $http.get("api/Movies/GetSubGenres").then(function (response) {
            $scope.subgenres = response.data;
        }, function (error) {
            $scope.errorDialog = true;
            $scope.errorMessage = "Network error. Please try again.";
            $scope.processingRequest = true;
        });
    }
    this.getMovie = function (id) {
        return $http.get("api/Movies/GetMovie/"+id);
    }
    this.searchDirectors = function ($scope) {
        $http.get("api/Movies/SearchDirectorByName?keyword=" + $scope.movie.Director.Name).then(function (response) {
            $scope.directors = response.data;
        });
    }
    this.putMovie = function (data, movieId) {
        return $http.put("api/Movies/PutMovie/" + movieId, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    }
    //TODO : delete as angularjs service
    //TODO : post as angularjs service
});

movieApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});