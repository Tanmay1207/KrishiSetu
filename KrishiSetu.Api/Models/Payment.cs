using System;
using System.ComponentModel.DataAnnotations;


namespace KrishiSetu.Api.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        
        public decimal Amount { get; set; }
        
        public string PaymentMethod { get; set; } = "Mock";
        
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        
        public string Status { get; set; } = "Paid";
    }
}
