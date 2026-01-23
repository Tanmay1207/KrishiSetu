using KrishiSetu.Api.Data;
using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KrishiSetu.Api.Services
{
    public interface IMachineryService
    {
        Task<IEnumerable<MachineryDto>> GetAll(string? category, decimal? maxRate);
        Task<MachineryDto?> GetById(int id);
        Task<MachineryDto> Create(int ownerId, CreateMachineryDto dto);
        Task<bool> UpdateMachinery(int id, int ownerId, UpdateMachineryDto dto);
        Task<bool> UpdateStatus(int id, string status);
        Task<IEnumerable<MachineryDto>> GetByOwner(int ownerId);
        Task<IEnumerable<object>> GetCategories();
    }

    public class MachineryService : IMachineryService
    {
        private readonly ApplicationDbContext _context;

        public MachineryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MachineryDto>> GetAll(string? category, decimal? maxRate)
        {
            var query = _context.Machineries
                .Include(m => m.Owner)
                .Include(m => m.Category)
                .Where(m => m.IsApproved && m.AvailabilityStatus == "Available"); // Only show available machinery

            if (!string.IsNullOrEmpty(category))
                query = query.Where(m => m.Category.Name == category);

            if (maxRate.HasValue)
                query = query.Where(m => m.RatePerHour <= maxRate.Value);

            return await query.Select(m => new MachineryDto
            {
                Id = m.Id,
                OwnerId = m.OwnerId,
                OwnerName = m.Owner.FullName,
                CategoryId = m.CategoryId,
                CategoryName = m.Category.Name,
                Name = m.Name,
                Description = m.Description,
                RatePerHour = m.RatePerHour,
                RatePerDay = m.RatePerDay,
                AvailabilityStatus = m.AvailabilityStatus,
                ImageUrl = m.ImageUrl,
                AvailableDate = m.AvailableDate,
                IsApproved = m.IsApproved
            }).ToListAsync();
        }

        public async Task<MachineryDto?> GetById(int id)
        {
            var m = await _context.Machineries
                .Include(m => m.Owner)
                .Include(m => m.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (m == null) return null;

            return new MachineryDto
            {
                Id = m.Id,
                OwnerId = m.OwnerId,
                OwnerName = m.Owner.FullName,
                CategoryId = m.CategoryId,
                CategoryName = m.Category.Name,
                Name = m.Name,
                Description = m.Description,
                RatePerHour = m.RatePerHour,
                RatePerDay = m.RatePerDay,
                AvailabilityStatus = m.AvailabilityStatus,
                ImageUrl = m.ImageUrl,
                AvailableDate = m.AvailableDate,
                IsApproved = m.IsApproved
            };
        }

        public async Task<MachineryDto> Create(int ownerId, CreateMachineryDto dto)
        {
            try 
            {
                var machinery = new Machinery
                {
                    OwnerId = ownerId,
                    CategoryId = dto.CategoryId,
                    Name = dto.Name,
                    Description = dto.Description,
                    RatePerHour = dto.RatePerHour,
                    RatePerDay = dto.RatePerDay,
                    ImageUrl = dto.ImageUrl,
                    AvailableDate = dto.AvailableDate,
                    IsApproved = false // Requires Admin Approval
                };

                Console.WriteLine($"[MachineryService] Attempting to save: {machinery.Name} for Owner {ownerId}");
                _context.Machineries.Add(machinery);
                await _context.SaveChangesAsync();
                Console.WriteLine($"[MachineryService] Successfully saved with ID: {machinery.Id}");

                return await GetById(machinery.Id) ?? new MachineryDto { Name = machinery.Name };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[MachineryService ERROR] Failed to save machinery: {ex.Message}");
                if (ex.InnerException != null) 
                    Console.WriteLine($"[Inner Exception] {ex.InnerException.Message}");
                throw; // Re-throw to let controller handle it
            }
        }

        public async Task<bool> UpdateMachinery(int id, int ownerId, UpdateMachineryDto dto)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null || machinery.OwnerId != ownerId) return false;

            // Check if availability date is changing
            bool dateChanged = machinery.AvailableDate != dto.AvailableDate;

            machinery.CategoryId = dto.CategoryId;
            machinery.Name = dto.Name;
            machinery.Description = dto.Description;
            machinery.RatePerHour = dto.RatePerHour;
            machinery.RatePerDay = dto.RatePerDay;
            machinery.ImageUrl = dto.ImageUrl;
            machinery.AvailableDate = dto.AvailableDate;

            // Auto-unlock: If date changed, make machinery available again
            if (dateChanged && dto.AvailableDate.HasValue)
            {
                machinery.AvailabilityStatus = "Available";
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStatus(int id, string status)
        {
            var machinery = await _context.Machineries.FindAsync(id);
            if (machinery == null) return false;

            machinery.AvailabilityStatus = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<MachineryDto>> GetByOwner(int ownerId)
        {
             var list = await _context.Machineries
                .Include(m => m.Category)
                .Where(m => m.OwnerId == ownerId)
                .Select(m => new MachineryDto
                {
                    Id = m.Id,
                    OwnerId = m.OwnerId,
                    CategoryId = m.CategoryId,
                    CategoryName = m.Category.Name,
                    Name = m.Name,
                    Description = m.Description,
                    RatePerHour = m.RatePerHour,
                    RatePerDay = m.RatePerDay,
                    AvailabilityStatus = m.AvailabilityStatus,
                    ImageUrl = m.ImageUrl,
                    AvailableDate = m.AvailableDate,
                    IsApproved = m.IsApproved
                }).ToListAsync();
            
            Console.WriteLine($"[MachineryService] Found {list.Count} machines for Owner: {ownerId}");
            return list;
        }

        public async Task<IEnumerable<object>> GetCategories()
        {
            return await _context.MachineryCategories
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();
        }
    }
}
