using System.ComponentModel.DataAnnotations;

namespace MovieCollection.Models
{
    public class Director
    {
        public int DirectorId { get; set; }
        [Required]
        public string Name { get; set; }
    }
}