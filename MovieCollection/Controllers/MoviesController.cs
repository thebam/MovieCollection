using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using MovieCollection.Models;
using System;

namespace MovieCollection.Controllers
{
    public class MoviesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Movies
        public IHttpActionResult GetMovies(string sortColumn = "", string sortDirection = "asc", int pageNumber = 0, int pageSize = 10)
        {
            Func<Movie, Object> orderByFunc = null;
            switch(sortColumn){
                case "title":
                    orderByFunc = item => item.Title;
                    break;
                case "genre":
                    orderByFunc = item => item.Genre.Title;
                    break;
                case "director":
                    orderByFunc = item => item.Director.Name;
                    break;
                case "length":
                    orderByFunc = item => item.Length;
                    break;
                default:
                    orderByFunc = item => item.MovieId;
                    break;
            }

            List<Movie> MovieList = new List<Movie>();
            if (sortDirection == "asc")
            {
                MovieList = db.Movies.OrderBy(orderByFunc).Skip(pageNumber * pageSize).Take(pageSize).ToList();
            }
            else
            {
                MovieList = db.Movies.OrderByDescending(orderByFunc).Skip(pageNumber * pageSize).Take(pageSize).ToList();
            }

            var MovieListDetails = MovieList.Select(
                    m => new MovieViewModel
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        Director = m.Director,
                        Description = m.Description,
                        DateReleased = m.DateReleased,
                        Genre = m.Genre,
                        Length = m.Length,
                        PosterUrl = m.PosterUrl,
                        SubGenres = m.MovieSubGenres
                        .Join(db.SubGenres, ms => ms.SubGenreId, s => s.SubGenreId, (ms, s) => new { ms, s })
                        .Select(ss => new SubGenreName
                        {
                            Title = ss.s.Title,
                            SubGenreId = ss.s.SubGenreId
                        }).ToList()
                    }).ToList();

            var result = new
            {
                PageNumber = pageNumber,
                TotalPages = Math.Ceiling(db.Movies.Count() / Convert.ToDecimal(pageSize)),
                Movies = MovieListDetails
            };
            
            return Ok(result);
        }

        [HttpGet]
        public List<Genre> GetGenres() {
            return db.Genres.ToList();
        }
        [HttpGet]
        public List<SubGenre> GetSubGenres()
        {
            List<SubGenre> temp = db.SubGenres.ToList();
            return temp;
        }

        [HttpGet]
        public List<Director> SearchDirectorByName(string keyword)
        {
            return db.Directors.Where(d=>d.Name.Contains(keyword)).OrderBy(d=>d.Name).ToList();
        }

        // GET: api/Movies/5
        [ResponseType(typeof(Movie))]
        public IHttpActionResult GetMovie(int id)
        {
            Movie movie = db.Movies.Find(id);
            if (movie == null)
            {
                return NotFound();
            }

            return Ok(movie);
        }

        // PUT: api/Movies/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutMovie(int id, Movie movie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != movie.MovieId)
            {
                return BadRequest();
            }
            
            

            Director director = db.Directors.FirstOrDefault(d => d.Name == movie.Director.Name.Trim());
            if (director != null)
            {
                movie.Director = director;
                movie.DirectorId = director.DirectorId;
            }
            else {
                director = new Director() {
                    Name = movie.Director.Name
                };
                db.Directors.Add(director);
            }

            List<MovieSubGenre> oldMovieSubGenres = db.MovieSubGenres.Where(ms => ms.MovieId == movie.MovieId).ToList();
            foreach (MovieSubGenre movieSubGenre in oldMovieSubGenres)
            {
                db.MovieSubGenres.Remove(movieSubGenre);
            }
            foreach (MovieSubGenre movieSubGenre in movie.MovieSubGenres)
            {
                if (movieSubGenre.SubGenreId > 0)
                {
                    MovieSubGenre newMovieSubGenre = new MovieSubGenre() { MovieId = movie.MovieId, SubGenreId = movieSubGenre.SubGenreId };
                    db.MovieSubGenres.Add(newMovieSubGenre);
                    movieSubGenre.MovieSubGenreId = newMovieSubGenre.MovieSubGenreId;
                }
            }
            movie.MovieSubGenres = null;

            
            db.Entry(movie).State = EntityState.Modified;
            
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Movies
        [ResponseType(typeof(Movie))]
        public IHttpActionResult PostMovie(Movie movie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else {
                Director director = db.Directors.FirstOrDefault(d => d.Name == movie.Director.Name.Trim());
                if (director != null) {
                    movie.Director = director;
                }
            }

            db.Movies.Add(movie);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.OK);
        }

        // DELETE: api/Movies/5
        [ResponseType(typeof(Movie))]
        public IHttpActionResult DeleteMovie(int id)
        {
            Movie movie = db.Movies.Find(id);
            if (movie == null)
            {
                return NotFound();
            }

            db.Movies.Remove(movie);
            db.SaveChanges();

            return Ok(movie);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MovieExists(int id)
        {
            return db.Movies.Count(e => e.MovieId == id) > 0;
        }
    }
}