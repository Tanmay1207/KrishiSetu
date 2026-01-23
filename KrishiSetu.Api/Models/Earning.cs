using System;
using System.ComponentModel.DataAnnotations;


namespace KrishiSetu.Api.Models
{
    public class Earning
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        
        public decimal Amount { get; set; }
        
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
    }
}
