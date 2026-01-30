using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace KrishiSetu.Api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        
        public bool IsApproved { get; set; } = false;
        
        public bool EmailVerified { get; set; } = false;

        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Machinery> Machineries { get; set; } = new List<Machinery>();
        public WorkerProfile? WorkerProfile { get; set; }
        public ICollection<Booking> FarmerBookings { get; set; } = new List<Booking>();
    }
}
