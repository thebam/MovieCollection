movieApp.service('MovieService', function ($http) {
    this.getMovies = function (sortCol,sortDirect,pageNum,pageSize) {
        return $http.get("api/Movies/GetMovies?sortColumn=" + sortCol + "&sortDirection=" + sortDirect + "&pageNumber=" + pageNum + "&pageSize=" + pageSize);
    }
    this.getGenres = function () {
        return $http.get("api/Movies/GetGenres");
    }
    this.getSubGenres = function () {
        return $http.get("api/Movies/GetSubGenres");
    }
    this.getMovie = function (id) {
        return $http.get("api/Movies/GetMovie/"+id);
    }
    this.searchDirectors = function (keyword) {
        return $http.get("api/Movies/SearchDirectorByName?keyword=" + keyword);
    }
    this.putMovie = function (data, movieId) {
        return $http.put("api/Movies/PutMovie/" + movieId, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
        //return $http.put(
        //    'api/Movies/PutMovie/' + movieId,
        //    JSON.stringify(data),
        //    { headers: { 'Content-Type': 'application/json' } }
        //    ).then(function (response) {
        //        return "success";
        //    }, function (response) {
        //        if (response.data.ModelState.ErrorMessage[0]) {
        //             return response.data.ModelState.ErrorMessage[0];
        //        } else {
        //            return "Unspecified error.";
        //        }
        //    });
    }
});

movieApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});