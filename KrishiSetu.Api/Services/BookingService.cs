using KrishiSetu.Api.Data;
using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KrishiSetu.Api.Services
{
    public interface IBookingService
    {
        Task<BookingDto?> CreateBooking(int farmerId, CreateBookingDto dto);
        Task<IEnumerable<BookingDto>> GetFarmerBookings(int farmerId);
        Task<IEnumerable<BookingDto>> GetOwnerBookings(int ownerId);
        Task<IEnumerable<BookingDto>> GetWorkerBookings(int workerId);
        Task<bool> ProcessPayment(int bookingId);
        Task<bool> UpdateBookingStatus(int bookingId, string status);
    }

    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BookingDto?> CreateBooking(int farmerId, CreateBookingDto dto)
        {
            decimal totalAmount = 0;
            DateTime startDate = dto.StartDate;
            DateTime endDate = dto.EndDate;

            Machinery? machinery = null;
            WorkerProfile? worker = null;

            if (dto.MachineryId.HasValue)
            {
                machinery = await _context.Machineries.FindAsync(dto.MachineryId.Value);
                if (machinery == null) return null;
                
                // Prioritize AvailableDate if set (New Logic)
                if (machinery.AvailableDate.HasValue)
                {
                    startDate = machinery.AvailableDate.Value;
                    endDate = machinery.AvailableDate.Value;
                    totalAmount += machinery.RatePerDay;
                }
                else
                {
                    // Fallback to old Date Range logic
                    var days = (dto.EndDate - dto.StartDate).Days + 1;
                    if (days <= 0) days = 1;
                    totalAmount += machinery.RatePerDay * days;
                }
            }

            if (dto.WorkerId.HasValue)
            {
                worker = await _context.WorkerProfiles.FindAsync(dto.WorkerId.Value);
                if (worker == null) return null;

                // For workers, we use their AvailableDate
                if (worker.AvailableDate.HasValue)
                {
                    startDate = worker.AvailableDate.Value;
                    endDate = worker.AvailableDate.Value; // Single day booking
                }
                
                // Calculate amount based on hours if provided, otherwise default to 8 hours logic (fallback)
                int hours = dto.Hours ?? 8;
                totalAmount = worker.HourlyRate * hours;
            }

            var booking = new Booking
            {
                FarmerId = farmerId,
                MachineryId = dto.MachineryId,
                WorkerId = dto.WorkerId,
                StartDate = startDate,
                EndDate = endDate,
                TotalAmount = totalAmount,
                Status = "Pending",
                PaymentStatus = "Pending"
            };

            _context.Bookings.Add(booking);

            // Lock resources by updating their availability status
            if (machinery != null)
            {
                machinery.AvailabilityStatus = "Booked";
            }

            if (worker != null)
            {
                worker.AvailabilityStatus = "Booked";
            }

            await _context.SaveChangesAsync();

            return await GetBookingDto(booking.Id);
        }

        public async Task<IEnumerable<BookingDto>> GetFarmerBookings(int farmerId)
        {
            return await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .Include(b => b.Worker).ThenInclude(w => w!.Worker)
                .Where(b => b.FarmerId == farmerId)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task<IEnumerable<BookingDto>> GetOwnerBookings(int ownerId)
        {
            return await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .Where(b => b.Machinery != null && b.Machinery.OwnerId == ownerId)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task<IEnumerable<BookingDto>> GetWorkerBookings(int workerId)
        {
            return await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Worker).ThenInclude(w => w.Worker)
                .Where(b => b.Worker != null && b.Worker.WorkerId == workerId)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task<bool> ProcessPayment(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Machinery)
                .Include(b => b.Worker)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null) return false;

            booking.PaymentStatus = "Paid";
            booking.Status = "Completed";

            // Add payment record
            var payment = new Payment
            {
                BookingId = bookingId,
                Amount = booking.TotalAmount,
                Status = "Paid"
            };
            _context.Payments.Add(payment);

            // Add earnings for owner
            if (booking.MachineryId.HasValue)
            {
                var earning = new Earning
                {
                    UserId = booking.Machinery!.OwnerId,
                    BookingId = bookingId,
                    Amount = booking.Machinery.RatePerDay * ((booking.EndDate - booking.StartDate).Days + 1)
                };
                _context.Earnings.Add(earning);
            }

            // Add earnings for worker
            if (booking.WorkerId.HasValue)
            {
                var earning = new Earning
                {
                    UserId = booking.Worker!.WorkerId,
                    BookingId = bookingId,
                    Amount = booking.TotalAmount // Use the calculated amount from booking
                };
                _context.Earnings.Add(earning);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBookingStatus(int bookingId, string status)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;
            booking.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<BookingDto?> GetBookingDto(int id)
        {
            return await _context.Bookings
                .Include(b => b.Farmer)
                .Include(b => b.Machinery)
                .Include(b => b.Worker).ThenInclude(w => w!.Worker)
                .Where(b => b.Id == id)
                .Select(b => MapToDto(b))
                .FirstOrDefaultAsync();
        }

        private static BookingDto MapToDto(Booking b)
        {
            return new BookingDto
            {
                Id = b.Id,
                FarmerId = b.FarmerId,
                FarmerName = b.Farmer.FullName,
                MachineryId = b.MachineryId,
                MachineryName = b.Machinery?.Name,
                WorkerId = b.WorkerId,
                WorkerName = b.Worker?.Worker.FullName,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                TotalAmount = b.TotalAmount,
                Status = b.Status,
                PaymentStatus = b.PaymentStatus
            };
        }
    }
}
