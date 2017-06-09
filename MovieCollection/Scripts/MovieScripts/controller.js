movieApp.controller('mainController', function ($scope, $http, MovieService) {
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
        allMovieService.then(function (response) {
            $scope.movies = response.data.Movies;
            $scope.totalPages = response.data.TotalPages;
        }, function (error) {
            $scope.errorDialog = true;
            $scope.errorMessage = "A network error has occurred. Please try again later."
        });
    }

    $scope.deleteMovie = function deleteMovie(movieId,movieTitle) {
        if (confirm("Are you sure you want to delete \"" + movieTitle + "\"? This movie will be permenantly deleted.") == true) {
            var deleteMovieService = MovieService.deleteMovie(movieId);
            deleteMovieService.then(function (response) {
                $scope.getAll($scope.sortCol, 0);
            }, function (response) {
                $scope.errorDialog = true;
                $scope.errorMessage = "A network error has occurred. Please try again later."
            });
        } 
    }

    $scope.getAll($scope.sortCol, 0);
});

movieApp.controller('addController', function ($scope, $http, $location, MovieService) {
    $scope.pageTitle = "Add New Movie";
    $scope.processingRequest = false;

    MovieService.getGenres($scope);
    MovieService.getSubGenres($scope);

    $scope.findDirector = function () {
        MovieService.searchDirectors($scope);
    };
    $scope.setDirector = function (directorName) {
        $scope.movie.Director.Name = directorName;
        $scope.directors.length = 0;
    }
    
    $scope.save = function () {
        $scope.processingRequest = true;
        var selectedSubGenres = [];
        angular.forEach($scope.movie.SubGenres.SubGenreId, function (value, key) {
            this.push({ "SubGenreId": value });
        }, selectedSubGenres);
        var data = { "Title": $scope.movie.Title, "GenreId": $scope.movie.Genre.GenreId, "Director": { "DirectorId": 0, "Name": $scope.movie.Director.Name }, "DateReleased": $scope.movie.DateReleased, "Length": $scope.movie.Length, "Description": $scope.movie.Description, "SubGenres": selectedSubGenres, "PosterUrl": $scope.movie.PosterUrl };
        
        MovieService.postMovie(data).then(function (response) {
                $scope.requestSuccess = true;
                $scope.successMessage = "Movie added successfully."
                $scope.errorDialog = false;
                $scope.errorMessage = "";
            }, function (response) {
                $scope.requestSuccess = false;
                $scope.successMessage = ""
                $scope.errorDialog = true;
                if (response.data.ModelState.ErrorMessage[0]) {
                    return response.data.ModelState.ErrorMessage[0];
                } else {
                    return "Unspecified error.";
                }
            });
    }
});

movieApp.controller('editController', function ($scope, $http, $location, MovieService) {
    $scope.pageTitle = "Edit Movie";
    $scope.movieId = 0;
    $scope.processingRequest = false;
    $scope.loadDropDownValues = function() {
        MovieService.getGenres($scope);
        MovieService.getSubGenres($scope);
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
        var serviceFindDirector = MovieService.searchDirectors($scope.movie.Director.Name);
        serviceFindDirector.then(function (response) {
            $scope.directors = response.data;
        });
    };
    $scope.setDirector = function (directorName) {
        $scope.movie.Director.Name = directorName;
        $scope.directors.length = 0;
    }
    $scope.save = function () {
        $scope.processingRequest = true;
        var selectedSubGenres = [];
        angular.forEach($scope.movie.SubGenres.SubGenreId, function (value, key) {
            this.push({ "MovieId": $scope.movieId, "SubGenreId": value });
        }, selectedSubGenres);
        var data = { "MovieId": $scope.movieId, "Title": $scope.movie.Title, "GenreId": $scope.movie.Genre.GenreId, "Director": { "DirectorId": 0, "Name": $scope.movie.Director.Name }, "DateReleased": $scope.movie.DateReleased, "Length": $scope.movie.Length, "Description": $scope.movie.Description, "SubGenres": selectedSubGenres, "PosterUrl":$scope.movie.PosterUrl };
        MovieService.putMovie(data, $scope.movieId).then(function (response) {
            $scope.requestSuccess = true;
            $scope.successMessage = "Movie updated successfully."
            $scope.errorDialog = false;
            $scope.errorMessage = "";
        }, function (response) {
            $scope.requestSuccess = false;
            $scope.successMessage = ""
            $scope.errorDialog = true;
            if (response.data.ModelState.ErrorMessage[0]) {
                return response.data.ModelState.ErrorMessage[0];
            } else {
                return "Unspecified error.";
            }
        });
    }
});