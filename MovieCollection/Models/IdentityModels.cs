using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using System.Data.Entity;

namespace MovieCollection.Models
{

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {}
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public System.Data.Entity.DbSet<MovieCollection.Models.Movie> Movies { get; set; }

        public System.Data.Entity.DbSet<MovieCollection.Models.Director> Directors { get; set; }

        public System.Data.Entity.DbSet<MovieCollection.Models.Genre> Genres { get; set; }

        public System.Data.Entity.DbSet<MovieCollection.Models.SubGenre> SubGenres { get; set; }

    }
}