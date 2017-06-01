using System.ComponentModel.DataAnnotations;

namespace MovieCollection.Models
{
    public class Genre
    {
        public int GenreId { get; set; }
        [Required]
        public string Title { get; set; }
    }
}