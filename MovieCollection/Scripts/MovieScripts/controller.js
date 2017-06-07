movieApp.controller('mainController', function ($scope, $http,MovieService) {
    $scope.pageSize = 10;
    $scope.sortDirect = "asc";
    $scope.sortCol = "title";

    $scope.changeSortCol = function changeSortCol(sortCol) {
        if ($scope.sortCol == sortCol) {
            if ($scope.sortDirect == "asc") {
                $scope.sortDirect = "desc";
            } else {
                $scope.sortDirect = "asc";
            }
        } else {
            $scope.sortCol = sortCol;
            $scope.sortDirect = "asc";
        }
        $scope.getAll(sortCol, 0);
    }

    $scope.changePageNum = function changePageNum(pageNum) {
        $scope.getAll($scope.sortCol, 0);
    }
    $scope.showSortCol = function showSortCol(col, direction) {
        if ($scope.sortCol == col && $scope.sortDirect == direction) {
            return true;
        } else {
            return false;
        } 
    }

    $scope.viewMovieDetails = function viewMovieDetails(index) {
        $scope.selectedMovie = $scope.movies[index];
        $('#movieDetailsModal').modal('show');
    };

    $scope.getAll = function getAll(sortCol, pageNum) {
        var allMovieService = MovieService.getMovies(sortCol, $scope.sortDirect, pageNum, $scope.pageSize);
        allMovieService.then(function (d) {
            $scope.movies = d.data.Movies;
            $scope.totalPages = d.data.TotalPages;


            console.log(JSON.stringify(d.data.Movies));
        }, function (error) {
            console.log(error);
        });
    }


    $scope.deleteMovie = function deleteMovie(movieId) {
        if (confirm("Are you sure you want to delete this movie?") == true) {
            $http.delete(
            'api/Movies/DeleteMovie/'+movieId,
            { headers: { 'Content-Type': 'application/json' } }
            ).then(function (data) {
                $scope.getAll($scope.sortCol, 0);
            }, function (data) {
                alert(data);
            });
        } 
    }

    $scope.getAll($scope.sortCol, 0);
});

movieApp.controller('addController', function ($scope, $http, $location, MovieService) {
    $scope.processingRequest = false;
    var servCall = MovieService.getGenres();
    servCall.then(function (d) {
        $scope.genres = d.data;
        console.log(JSON.stringify(d.data));
    }, function (error) {
        console.log(error);
    });
    

    var servCall2 = MovieService.getSubGenres();
    servCall2.then(function (d) {
        $scope.subgenres = d.data;
        console.log(JSON.stringify(d.data));
    }, function (error) {
        console.log(error);
    });

    $scope.findDirector = function () {
        var servCall3 = MovieService.searchDirectors($scope.director.name);
        servCall3.then(function (d) {
            $scope.directors = d.data;
            console.log(JSON.stringify(d.data));
        }, function (error) {
            console.log(error);
        });
    };
    $scope.setDirector = function (directorName) {
        $scope.director.name = directorName;
        $scope.directors.length = 0;
    }
    $scope.processingRequest = true;
    
    $scope.myFunc = function () {
        $scope.processingRequest = false;
        var selectedSubGenres = [];
        angular.forEach($scope.subgenre.Id, function (value, key) {
            this.push({ "SubGenreId": value });
        }, selectedSubGenres);
        var data = { "Title": $scope.title, "GenreId": $scope.genre.Id.GenreId, "Director": { "DirectorId": 0, "Name": $scope.director.name }, "DateReleased": $scope.released, "Length": $scope.length, "PosterUrl": $scope.posterUrl, "Description": $scope.description, "SubGenres": selectedSubGenres };
        $http.post(
            'api/Movies',
            JSON.stringify(data),
            { headers: {'Content-Type':'application/json'}}
            ).then(function (response) {
                $scope.addFailed = false;
                $scope.addSuccess = true;
                $scope.failMessage = "";
            }, function (response) {
                $scope.addFailed = true;
                $scope.addSuccess = false;
                if (response.data.ModelState.ErrorMessage[0]) {
                    $scope.failMessage = response.data.ModelState.ErrorMessage[0];
                } else {
                    $scope.failMessage = "Unspecified error.";
                }
            });
    }
});

movieApp.controller('editController', function ($scope, $http, $location, MovieService) {
    $scope.movieId = 0;
    $scope.processingRequest = false;
    $scope.loadDropDownValues = function() {
        var serviceGenres = MovieService.getGenres();
        serviceGenres.then(function (response) {
            $scope.genres = response.data;
        }, function (error) {
            $scope.errorDialog = true;
            $scope.errorMessage = "Network error. Please try again.";
        });
        
        var serviceSubGenres = MovieService.getSubGenres();
        serviceSubGenres.then(function (response) {
            $scope.subgenres = response.data;
        }, function (error) {
            $scope.errorDialog = true;
            $scope.errorMessage = "Network error. Please try again.";
        });
    }

    $scope.loadMovieDetails = function () {
        var serviceLoadMovie = MovieService.getMovie($scope.movieId);
        serviceLoadMovie.then(function (response) {
            $scope.movie = response.data;
            $scope.movie.DateReleased = new Date($scope.movie.DateReleased);
            var initialSubGenres = [];
            angular.forEach($scope.movie.SubGenres, function (value, key) {
                this.push(value.SubGenreId);
            }, initialSubGenres);
            $scope.movie.SubGenres.SubGenreId = initialSubGenres;
        }, function (error) {
            $scope.errorDialog = true;
            $scope.errorMessage = "Network error. Please try again.";
        });
    }

    if ($location.search().hasOwnProperty('id')) {
        $scope.movieId = $location.search()['id'];
        $scope.loadDropDownValues();
        if (!$scope.errorDialog) {
            $scope.loadMovieDetails();
        }
    } else {
        $scope.errorDialog = true;
        $scope.errorMessage = "Movie not found.";
    }
    
    $scope.findDirector = function () {
        var serviceFindDirector = MovieService.searchDirectors($scope.director.name);
        serviceFindDirector.then(function (response) {
            $scope.directors = response.data;
        });
    };
    $scope.setDirector = function (directorName) {
        $scope.director.name = directorName;
        $scope.directors.length = 0;
    }
    $scope.submitEdits = function () {
        $scope.processingRequest = true;
        var selectedSubGenres = [];
        angular.forEach($scope.movie.SubGenres.SubGenreId, function (value, key) {
            this.push({ "MovieId": $scope.movieId, "SubGenreId": value });
        }, selectedSubGenres);
        var data = { "MovieId": $scope.movieId, "Title": $scope.movie.Title, "GenreId": $scope.movie.Genre.GenreId, "Director": { "DirectorId": 0, "Name": $scope.movie.Director.Name }, "DateReleased": $scope.movie.DateReleased, "Length": $scope.movie.Length, "Description": $scope.movie.Description, "SubGenres": selectedSubGenres, "PosterUrl":$scope.movie.PosterUrl };
        $http.put(
            'api/Movies/PutMovie/' + $scope.movieId,
            JSON.stringify(data),
            { headers: { 'Content-Type': 'application/json' } }
            ).then(function (data) {
                $scope.addSuccess = true;
                $scope.errorDialog = false;
                $scope.errorMessage = "";
            }, function (data) {
                $scope.addSuccess = false;
                $scope.errorDialog = true;
                if (response.data.ModelState.ErrorMessage[0]) {
                    $scope.errorMessage = response.data.ModelState.ErrorMessage[0];
                } else {
                    $scope.errorMessage = "Unspecified error.";
                }
            });
    }
});