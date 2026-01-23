using System;
using System.ComponentModel.DataAnnotations;


namespace KrishiSetu.Api.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }
        
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        
        public int Rating { get; set; } // 1-5
        public string Comment { get; set; } = string.Empty;
        
        public int ReviewerId { get; set; }
        public User Reviewer { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
