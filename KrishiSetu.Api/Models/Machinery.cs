using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace KrishiSetu.Api.Models
{
    public class Machinery
    {
        [Key]
        public int Id { get; set; }
        
        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;
        
        public int CategoryId { get; set; }
        public MachineryCategory Category { get; set; } = null!;
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        public decimal RatePerHour { get; set; }
        public decimal RatePerDay { get; set; }
        
        public string AvailabilityStatus { get; set; } = "Available"; // Available, Booked, Maintenance
        
        public DateTime? AvailableDate { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public bool IsApproved { get; set; } = false;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
