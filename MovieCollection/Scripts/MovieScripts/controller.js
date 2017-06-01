movieApp.controller('mainController', function ($scope, $http,MovieService) {
    $scope.pageSize = 10;
    $scope.sortDirect = "asc";
    $scope.sortCol = "title";
    $scope.changeSortCol = function changeSortCol(sortCol) {
        if ($scope.sortCol == sortCol) {
            if ($scope.sortDirect == "asc") {
                $scope.sortDirect = "desc"
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
        $('#myModal').modal('show');
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
    
    $scope.myFunc = function () {
        var selectedSubGenres = [];
        angular.forEach($scope.subgenre.Id, function (value, key) {
            this.push({ "SubGenreId": value });
        }, selectedSubGenres);
        var data = { "Title": $scope.title, "GenreId": $scope.genre.Id.GenreId, "Director": { "DirectorId": 0, "Name": $scope.director.name }, "DateReleased": $scope.released, "Length": $scope.length, "Description": $scope.description, "MovieSubGenres": selectedSubGenres };
        $http.post(
            'api/Movies',
            JSON.stringify(data),
            { headers: {'Content-Type':'application/json'}}
            ).then(function (data) {
                $location.path('/');
            }, function (data) {
                alert(data);
            });
    }
});

movieApp.controller('editController', function ($scope, $http, $location, MovieService) {
    $scope.movieId = 0;
    if ( $location.search().hasOwnProperty( 'id' ) ) {
        $scope.movieId = $location.search()['id'];
    }
     

    var servCall = MovieService.getGenres();
    servCall.then(function (d) {
        $scope.genres = d.data;
        console.log(JSON.stringify(d.data));
    }, function (error) {
        console.log(error);
    });

    var servCall1 = MovieService.getMovie($scope.movieId);
    servCall1.then(function (d) {
        $scope.movie = d.data;
        $scope.movie.DateReleased = new Date($scope.movie.DateReleased);

        

        
        var initialSubGenres = [];
        angular.forEach($scope.movie.MovieSubGenres, function (value, key) {
            this.push(value.SubGenreId);
        }, initialSubGenres);

        $scope.movie.MovieSubGenres.SubGenreId = initialSubGenres;

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
    $scope.myFunc = function () {

        var selectedSubGenres = [];
        angular.forEach($scope.movie.MovieSubGenres.SubGenreId, function (value, key) {
            this.push({ "MovieId": $scope.movieId, "SubGenreId": value });
        }, selectedSubGenres);
        var data = { "MovieId": $scope.movieId, "Title": $scope.movie.Title, "GenreId": $scope.movie.Genre.GenreId, "Director": { "DirectorId": 0, "Name": $scope.movie.Director.Name }, "DateReleased": $scope.movie.DateReleased, "Length": $scope.movie.Length, "Description": $scope.movie.Description, "MovieSubGenres": selectedSubGenres };
        $http.put(
            'api/Movies/PutMovie/' + $scope.movieId,
            JSON.stringify(data),
            { headers: { 'Content-Type': 'application/json' } }
            ).then(function (data) {
                $location.path('/');
            }, function (data) {
                alert(JSON.stringify(data));
            });
    }
});