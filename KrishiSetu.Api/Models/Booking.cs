using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace KrishiSetu.Api.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }
        
        public int FarmerId { get; set; }
        public User Farmer { get; set; } = null!;
        
        public int? MachineryId { get; set; }
        public Machinery? Machinery { get; set; }
        
        public int? WorkerId { get; set; }
        public WorkerProfile? Worker { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
        
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Earning> Earnings { get; set; } = new List<Earning>();
        public Review? Review { get; set; }
    }
}
