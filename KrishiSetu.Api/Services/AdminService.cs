using KrishiSetu.Api.Data;
using KrishiSetu.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace KrishiSetu.Api.Services
{
    public interface IAdminService
    {
        Task<AdminStatsDto> GetStats();
        Task<bool> ApproveUser(int userId, bool approve);
        Task<bool> ApproveMachinery(int machineryId, bool approve);
        Task<bool> ApproveWorker(int workerId, bool approve);
        Task<IEnumerable<object>> GetAllUsers();
        Task<IEnumerable<object>> GetPendingMachinery();
        Task<IEnumerable<object>> GetPendingWorkers();
        Task<IEnumerable<object>> GetAllMachineryDebug();
    }

    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdminStatsDto> GetStats()
        {
            return new AdminStatsDto
            {
                TotalFarmers = await _context.Users.Include(u => u.Role).CountAsync(u => u.Role.Name == "Farmer"),
                TotalMachineryOwners = await _context.Users.Include(u => u.Role).CountAsync(u => u.Role.Name == "MachineryOwner"),
                TotalWorkers = await _context.Users.Include(u => u.Role).CountAsync(u => u.Role.Name == "FarmWorker"),
                TotalMachineryListings = await _context.Machineries.CountAsync(),
                TotalBookings = await _context.Bookings.CountAsync(),
                TotalEarnings = await _context.Payments.SumAsync(p => p.Amount)
            };
        }

        public async Task<bool> ApproveUser(int userId, bool approve)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;
            
            if (!approve)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return true;
            }

            user.IsApproved = true;
            
            // If user is a worker, also update their worker profile approval status
            if (user.Role.Name == "FarmWorker")
            {
                var workerProfile = await _context.WorkerProfiles.FirstOrDefaultAsync(wp => wp.WorkerId == userId);
                if (workerProfile != null)
                {
                    workerProfile.IsApproved = true;
                }
            }
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveMachinery(int machineryId, bool approve)
        {
            var machinery = await _context.Machineries.FindAsync(machineryId);
            if (machinery == null) return false;
            if (!approve)
            {
                _context.Machineries.Remove(machinery);
                await _context.SaveChangesAsync();
                return true;
            }

            machinery.IsApproved = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveWorker(int workerId, bool approve)
        {
            var worker = await _context.WorkerProfiles.FirstOrDefaultAsync(wp => wp.WorkerId == workerId);
            if (worker == null) return false;
            worker.IsApproved = approve;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<object>> GetAllUsers()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Select(u => new { u.Id, u.Username, u.Email, Role = u.Role.Name, u.IsApproved, u.CreatedAt })
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> GetPendingMachinery()
        {
            var pending = await _context.Machineries
                .Include(m => m.Owner)
                .Include(m => m.Category)
                .Where(m => !m.IsApproved)
                .ToListAsync();

            return pending.Select(m => new
            {
                m.Id,
                m.Name,
                m.Description,
                m.RatePerHour,
                m.RatePerDay,
                m.ImageUrl,
                Category = m.Category?.Name ?? "Uncategorized",
                Owner = m.Owner?.FullName ?? "Unknown",
                OwnerEmail = m.Owner?.Email ?? "No Email"
            });
        }

        public async Task<IEnumerable<object>> GetPendingWorkers()
        {
            var workers = await _context.WorkerProfiles
                .Include(wp => wp.Worker)
                .Where(wp => !wp.IsApproved)
                .ToListAsync();

            return workers.Select(wp => new
            {
                wp.Id,
                wp.WorkerId,
                FullName = wp.Worker?.FullName ?? "Unknown",
                Email = wp.Worker?.Email ?? "No Email",
                wp.Skills,
                wp.ExperienceYears,
                wp.HourlyRate,
                wp.Bio
            });
        }

        public async Task<IEnumerable<object>> GetAllMachineryDebug()
        {
            var all = await _context.Machineries
                .Include(m => m.Owner)
                .Include(m => m.Category)
                .ToListAsync();

            return all.Select(m => new
            {
                m.Id,
                m.Name,
                m.IsApproved,
                Category = m.Category?.Name ?? "NULL",
                Owner = m.Owner?.FullName ?? "NULL",
                OwnerId = m.OwnerId,
                CategoryId = m.CategoryId
            });
        }
    }
}
