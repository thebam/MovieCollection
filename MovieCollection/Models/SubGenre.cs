using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MovieCollection.Models
{
    public class SubGenre
    {
        public int SubGenreId { get; set; }
        public string Title { get; set; }
        [Newtonsoft.Json.JsonIgnore] 
        public virtual ICollection<Movie> Movies { get; set; }
    }
}