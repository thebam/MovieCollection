using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MovieCollection.Models
{
    public class SubGenre
    {
        public int SubGenreId { get; set; }
        [Required]
        public string Title { get; set; }
        public virtual ICollection<MovieSubGenre> SubGenres { get; set; }
    }
}