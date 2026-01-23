namespace KrishiSetu.Api.DTOs
{
    public class MachineryDto
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RatePerHour { get; set; }
        public decimal RatePerDay { get; set; }
        public string AvailabilityStatus { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime? AvailableDate { get; set; }
        public bool IsApproved { get; set; }
    }

    public class CreateMachineryDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RatePerHour { get; set; }
        public decimal RatePerDay { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? AvailableDate { get; set; }
    }

    public class UpdateMachineryDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal RatePerHour { get; set; }
        public decimal RatePerDay { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? AvailableDate { get; set; }
    }
}
