namespace KrishiSetu.Api.DTOs
{
    public class WorkerProfileDto
    {
        public int Id { get; set; }
        public int WorkerId { get; set; }
        public string WorkerName { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public decimal HourlyRate { get; set; }
        public string AvailabilityStatus { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public DateTime? AvailableDate { get; set; }
        public bool IsApproved { get; set; }
    }

    public class UpdateWorkerProfileDto
    {
        public string Skills { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public decimal HourlyRate { get; set; }
        public string Bio { get; set; } = string.Empty;
        public DateTime? AvailableDate { get; set; }
    }
}
