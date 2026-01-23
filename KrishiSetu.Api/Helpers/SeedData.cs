using KrishiSetu.Api.Data;
using KrishiSetu.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KrishiSetu.Api.Helpers
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            Console.WriteLine("--- Seeding Roles ---");
            if (!await context.Roles.AnyAsync())
            {
                context.Roles.AddRange(
                    new Role { Name = "Admin" },
                    new Role { Name = "Farmer" },
                    new Role { Name = "MachineryOwner" },
                    new Role { Name = "FarmWorker" }
                );
                await context.SaveChangesAsync();
                Console.WriteLine("Roles seeded successfully.");
            }
            else { Console.WriteLine("Roles already exist."); }

            Console.WriteLine("--- Seeding Categories ---");
             if (!await context.MachineryCategories.AnyAsync())
            {
                context.MachineryCategories.AddRange(
                    new MachineryCategory { Name = "Tractor" },
                    new MachineryCategory { Name = "Harvester" },
                    new MachineryCategory { Name = "Plow" },
                    new MachineryCategory { Name = "Seeder" },
                    new MachineryCategory { Name = "Sprayer" }
                );
                await context.SaveChangesAsync();
                Console.WriteLine("Categories seeded successfully.");
            }
            else { Console.WriteLine("Categories already exist."); }

            Console.WriteLine("--- Seeding Admin ---");
            var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@krishisetu.com");
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");

            if (adminRole == null)
            {
                Console.WriteLine("Error: Admin role not found!");
            }
            else if (adminUser == null)
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    Email = "admin@krishisetu.com",
                    PasswordHash = "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7", // Correct hash for Admin@123
                    FullName = "System Admin",
                    PhoneNumber = "9999999999",
                    RoleId = adminRole.Id,
                    IsApproved = true
                });
                await context.SaveChangesAsync();
                Console.WriteLine("Admin user created: admin@krishisetu.com / Admin@123");
            }
            else
            {
                // Force reset password to Admin@123
                adminUser.PasswordHash = "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7";
                adminUser.IsApproved = true;
                await context.SaveChangesAsync();
                Console.WriteLine("Admin user password reset to Admin@123");
            }

            var userCount = await context.Users.CountAsync();
            Console.WriteLine($"Total Users in DB: {userCount}");
            Console.WriteLine("--- Seeding Complete ---");
        }
    }
}
