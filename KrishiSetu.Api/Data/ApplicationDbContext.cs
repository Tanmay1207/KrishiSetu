using Microsoft.EntityFrameworkCore;
using KrishiSetu.Api.Models;

namespace KrishiSetu.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<MachineryCategory> MachineryCategories { get; set; }

        public DbSet<Machinery> Machineries { get; set; }
        public DbSet<WorkerProfile> WorkerProfiles { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Earning> Earnings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<AvailabilityLog> AvailabilityLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - Role (Many-to-One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - Machinery (One-to-Many)

            modelBuilder.Entity<Machinery>()
                .HasOne(m => m.Owner)
                .WithMany(u => u.Machineries)
                .HasForeignKey(m => m.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - WorkerProfile (One-to-One)
            modelBuilder.Entity<WorkerProfile>()
                .HasOne(wp => wp.Worker)
                .WithOne(u => u.WorkerProfile)
                .HasForeignKey<WorkerProfile>(wp => wp.WorkerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Booking relations
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Farmer)
                .WithMany(u => u.FarmerBookings)
                .HasForeignKey(b => b.FarmerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Machinery)
                .WithMany(m => m.Bookings)
                .HasForeignKey(b => b.MachineryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Worker)
                .WithMany(w => w.Bookings)
                .HasForeignKey(b => b.WorkerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Review relations
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Booking)
                .WithOne(b => b.Review)
                .HasForeignKey<Review>(r => r.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Reviewer)
                .WithMany()
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Earning relations
            modelBuilder.Entity<Earning>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Earning>()
                .HasOne(e => e.Booking)
                .WithMany(b => b.Earnings)
                .HasForeignKey(e => e.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
