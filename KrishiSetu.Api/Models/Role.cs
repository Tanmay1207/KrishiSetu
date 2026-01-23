using System.ComponentModel.DataAnnotations;

namespace KrishiSetu.Api.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty; // Admin, Farmer, MachineryOwner, FarmWorker

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
