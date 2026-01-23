using System.ComponentModel.DataAnnotations;

namespace KrishiSetu.Api.Models
{
    public class WorkerProfile
    {
        [Key]
        public int Id { get; set; }
        
        public int WorkerId { get; set; }
        public User Worker { get; set; } = null!;
        
        public string Skills { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public decimal HourlyRate { get; set; }
        
        public string AvailabilityStatus { get; set; } = "Available";
        
        public string Bio { get; set; } = string.Empty;
        
        public DateTime? AvailableDate { get; set; }
        
        public bool IsApproved { get; set; } = true;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
