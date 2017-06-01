namespace MovieCollection.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<MovieCollection.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "MovieCollection.Models.ApplicationDbContext";
        }

        protected override void Seed(MovieCollection.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.Directors.AddOrUpdate(
                d=>d.Name,
                new Director()
                {
                    Name = "Alfred Hitchcock"
                }, new Director()
                {
                    Name = "Stanley Kubrick"
                }, new Director()
                {
                    Name = "Mel Brooks"
                }, new Director()
                {
                    Name = "Orson Welles"
                }, new Director()
                {
                    Name = "Steven Spielberg"
                }
                );

            context.Genres.AddOrUpdate(
                g=>g.Title,
                new Genre()
                {
                    Title = "Action"
                }, new Genre()
                {
                    Title = "Adventure"
                }, new Genre()
                {
                    Title = "Comedy"
                }, new Genre()
                {
                    Title = "Crime & Gangster"
                }, new Genre()
                {
                    Title = "Drama"
                }, new Genre()
                {
                    Title = "Epics/Historical"
                }, new Genre()
                {
                    Title = "Horror"
                }, new Genre()
                {
                    Title = "Musicals/Dance"
                }, new Genre()
                {
                    Title = "Science Fiction"
                }, new Genre()
                {
                    Title = "War"
                }, new Genre()
                {
                    Title = "Westerns"
                }
                );
            context.SubGenres.AddOrUpdate(
                g => g.Title,
                new SubGenre()
                {
                    Title = "Biopic"
                }, new SubGenre()
                {
                    Title = "Chick Flick"
                }, new SubGenre()
                {
                    Title = "Courtroom Drama"
                }, new SubGenre()
                {
                    Title = "Detective & Mystery"
                }, new SubGenre()
                {
                    Title = "Disaster"
                }, new SubGenre()
                {
                    Title = "Fantasy"
                }, new SubGenre()
                {
                    Title = "Film Noir"
                }, new SubGenre()
                {
                    Title = "Guy Films"
                }, new SubGenre()
                {
                    Title = "Melodramas/Weepers"
                }, new SubGenre()
                {
                    Title = "Road Films"
                }, new SubGenre()
                {
                    Title = "Romance"
                }, new SubGenre()
                {
                    Title = "Sports"
                }, new SubGenre()
                {
                    Title = "Super-Heroes"
                }, new SubGenre()
                {
                    Title = "Super-Natural"
                }, new SubGenre()
                {
                    Title = "Thriller/Suspense"
                }, new SubGenre()
                {
                    Title = "Zombie Films"
                }
                );
        }
    }
}
