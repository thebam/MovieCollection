using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MovieCollection.Models
{
    public class Movie
    {
        public int MovieId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public int GenreId { get; set; }
        public virtual Genre Genre { get; set; }
        public virtual ICollection<SubGenre> SubGenres { get; set; }
        public int DirectorId { get; set; }
        public virtual Director Director { get; set; }
        [Required]
        public DateTime DateReleased { get; set; }
        [Required]
        public int Length { get; set; }
        [Required]
        public string Description { get; set; }
        public string PosterUrl { get; set; }
    }
}