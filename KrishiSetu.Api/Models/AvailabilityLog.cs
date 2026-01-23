using System.ComponentModel.DataAnnotations;

namespace KrishiSetu.Api.Models
{
    public class AvailabilityLog
    {
        [Key]
        public int Id { get; set; }
        
        public string ResourceType { get; set; } = string.Empty; // Machinery, Worker
        public int ResourceId { get; set; }
        
        public DateTime BlockedDate { get; set; }
    }
}
