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

            var result = new
            {
                PageNumber = pageNumber,
                TotalPages = Math.Ceiling(db.Movies.Count() / Convert.ToDecimal(pageSize)),
                Movies = MovieList
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
                ModelState.AddModelError("ErrorMessage", "\"" + movie.Title.Trim().ToUpper() + "\" directed by \"" + movie.Director.Name.Trim().ToUpper() + "\" not found.");
                return BadRequest();
            }

            //Load the movie from the db by its id. We need to do this because we can't update the many-to-many relationship between movie and subgenres automatically.
            Movie updatedMovie = db.Movies.Find(id);
            
            //set the values of the updated movie from the passed in object
            updatedMovie.Title = movie.Title;
            updatedMovie.Director = UpdateDirector(movie.Director.Name);
            updatedMovie.Description = movie.Description;
            updatedMovie.DateReleased = movie.DateReleased;
            updatedMovie.Length = movie.Length;
            updatedMovie.PosterUrl = movie.PosterUrl;
            updatedMovie.GenreId = movie.GenreId;

            //Remove all previous subgenre entries. We will add or re-add all subgenre entries
            updatedMovie.SubGenres.Clear();
            updatedMovie.SubGenres = UpdateSubGenres(movie);

            db.Entry(updatedMovie).State = EntityState.Modified;

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

        //Look up the director. If the director is found, use that object from db. If director isn't found, a new entry will be created.
        private Director UpdateDirector(String directorName)
        {
            Director director = db.Directors.FirstOrDefault(d => d.Name == directorName.Trim());
            if (director == null)
            {
                director = new Director()
                {
                    Name = directorName.Trim()
                };
                db.Directors.Add(director);
            }
            return director;
        }

        //Since only the subgenreId's are being passed in Entity Framework will not create the new lookup table records properly. This method returns the associated subgenre objects in a list
        private List<SubGenre> UpdateSubGenres(Movie movie)
        {
            List<SubGenre> newSubGenres = new List<SubGenre>();
            foreach (SubGenre subGenre in movie.SubGenres)
            {
                newSubGenres.Add(db.SubGenres.FirstOrDefault(s => s.SubGenreId == subGenre.SubGenreId));
            }
            return newSubGenres;
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
                //Make sure movie is unique
                Movie dubMovie = db.Movies.FirstOrDefault(m => m.Title == movie.Title.Trim() && m.Director.Name == movie.Director.Name.Trim());
                if (dubMovie == null)
                {
                    movie.SubGenres = UpdateSubGenres(movie); ;
                    movie.Director = UpdateDirector(movie.Director.Name); ;
                    
                    db.Movies.Add(movie);
                    db.SaveChanges();

                    return StatusCode(HttpStatusCode.OK);
                }
                else {
                    ModelState.AddModelError("ErrorMessage", "\"" + movie.Title.Trim().ToUpper() + "\" directed by \"" + movie.Director.Name.Trim().ToUpper() + "\" already exists.");
                    return BadRequest(ModelState);
                }
            }

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