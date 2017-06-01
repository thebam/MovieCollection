using System.ComponentModel.DataAnnotations;

namespace MovieCollection.Models
{
    public class MovieSubGenre
    {
        public int MovieSubGenreId { get; set; }
        public int MovieId { get; set; }
        public int SubGenreId { get; set; }
    }
}