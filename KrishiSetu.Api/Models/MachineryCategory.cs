using System.ComponentModel.DataAnnotations;

namespace KrishiSetu.Api.Models
{
    public class MachineryCategory
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;

        public ICollection<Machinery> Machineries { get; set; } = new List<Machinery>();
    }
}
