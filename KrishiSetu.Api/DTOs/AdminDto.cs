namespace KrishiSetu.Api.DTOs
{
    public class AdminStatsDto
    {
        public int TotalFarmers { get; set; }
        public int TotalMachineryOwners { get; set; }
        public int TotalWorkers { get; set; }
        public int TotalMachineryListings { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalEarnings { get; set; }
    }

    public class UserApprovalDto
    {
        public int UserId { get; set; }
        public bool IsApproved { get; set; }
    }
}
