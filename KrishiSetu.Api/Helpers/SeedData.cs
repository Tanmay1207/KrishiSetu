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
            else
            {
                var passwordHash = HashPassword("Admin@123");
                
                if (adminUser == null)
                {
                    context.Users.Add(new User
                    {
                        Username = "admin",
                        Email = "admin@krishisetu.com",
                        PasswordHash = passwordHash,
                        FullName = "System Admin",
                        PhoneNumber = "9999999999",
                        RoleId = adminRole.Id,
                        IsApproved = true,
                        EmailVerified = true
                    });
                    Console.WriteLine("Admin user created: admin@krishisetu.com / Admin@123");
                }
                else
                {
                    // Force reset password to Admin@123
                    adminUser.PasswordHash = passwordHash;
                    adminUser.IsApproved = true;
                    adminUser.EmailVerified = true;
                    Console.WriteLine("Admin user password reset to Admin@123");
                }
                await context.SaveChangesAsync();
            }
            
            var userCount = await context.Users.CountAsync();
            Console.WriteLine($"Total Users in DB: {userCount}");
            Console.WriteLine("--- Seeding Complete ---");
        }

        private static string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}
