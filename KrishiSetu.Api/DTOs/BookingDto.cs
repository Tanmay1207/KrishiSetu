namespace KrishiSetu.Api.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int FarmerId { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public int? MachineryId { get; set; }
        public string? MachineryName { get; set; }
        public int? WorkerId { get; set; }
        public string? WorkerName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
    }

    public class CreateBookingDto
    {
        public int? MachineryId { get; set; }
        public int? WorkerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? Hours { get; set; }
    }
}
