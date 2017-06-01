using System;
using System.Collections.Generic;

namespace MovieCollection.Models
{
    public class MovieViewModel
    {
        public int MovieId { get; set; }
        public string Title { get; set; }
        public Genre Genre { get; set; }
        public ICollection<SubGenreName> SubGenres { get; set; }
        public Director Director { get; set; }
        public DateTime DateReleased { get; set; }
        public int Length { get; set; }
        public string Description { get; set; }
        public string PosterUrl { get; set; }
    }


    public class SubGenreName {    
        public int SubGenreId { get; set; }
        public string Title { get; set; }
    }
}