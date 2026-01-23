using KrishiSetu.Api.Data;
using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace KrishiSetu.Api.Services
{
    public interface IWorkerService
    {
        Task<IEnumerable<WorkerProfileDto>> GetAll(string? skill, decimal? maxRate);
        Task<WorkerProfileDto?> GetByWorkerId(int workerId);
        Task<bool> UpdateProfile(int workerId, UpdateWorkerProfileDto dto);
        Task<IEnumerable<WorkerProfileDto>> GetPendingApprovals();
    }

    public class WorkerService : IWorkerService
    {
        private readonly ApplicationDbContext _context;

        public WorkerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkerProfileDto>> GetAll(string? skill, decimal? maxRate)
        {
            var query = (IQueryable<WorkerProfile>)_context.WorkerProfiles
                .Include(wp => wp.Worker)
                .Where(wp => wp.AvailabilityStatus == "Available") // Only show available workers
                .AsQueryable();

            if (!string.IsNullOrEmpty(skill))
                query = query.Where(wp => wp.Skills.Contains(skill));

            if (maxRate.HasValue)
                query = query.Where(wp => wp.HourlyRate <= maxRate.Value);

            return await query.Select(wp => new WorkerProfileDto
            {
                Id = wp.Id,
                WorkerId = wp.WorkerId,
                WorkerName = wp.Worker.FullName,
                Skills = wp.Skills,
                ExperienceYears = wp.ExperienceYears,
                HourlyRate = wp.HourlyRate,
                AvailabilityStatus = wp.AvailabilityStatus,
                Bio = wp.Bio,
                AvailableDate = wp.AvailableDate,
                IsApproved = wp.IsApproved
            }).ToListAsync();
        }

        public async Task<WorkerProfileDto?> GetByWorkerId(int workerId)
        {
            var wp = await _context.WorkerProfiles
                .Include(wp => wp.Worker)
                .FirstOrDefaultAsync(w => w.WorkerId == workerId);

            if (wp == null) return null;

            return new WorkerProfileDto
            {
                Id = wp.Id,
                WorkerId = wp.WorkerId,
                WorkerName = wp.Worker.FullName,
                Skills = wp.Skills,
                ExperienceYears = wp.ExperienceYears,
                HourlyRate = wp.HourlyRate,
                AvailabilityStatus = wp.AvailabilityStatus,
                Bio = wp.Bio,
                AvailableDate = wp.AvailableDate,
                IsApproved = wp.IsApproved
            };
        }


        public async Task<bool> UpdateProfile(int workerId, UpdateWorkerProfileDto dto)
        {
            var profile = await _context.WorkerProfiles.FirstOrDefaultAsync(wp => wp.WorkerId == workerId);
            if (profile == null) return false;

            // Check if availability date is changing
            bool dateChanged = profile.AvailableDate != dto.AvailableDate;

            profile.Skills = dto.Skills;
            profile.ExperienceYears = dto.ExperienceYears;
            profile.HourlyRate = dto.HourlyRate;
            profile.Bio = dto.Bio;
            profile.AvailableDate = dto.AvailableDate;

            // Auto-unlock: If date changed, make worker available again
            if (dateChanged && dto.AvailableDate.HasValue)
            {
                profile.AvailabilityStatus = "Available";
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<WorkerProfileDto>> GetPendingApprovals()
        {
             return await _context.WorkerProfiles
                .Include(wp => wp.Worker)
                .Where(wp => !wp.IsApproved)
                .Select(wp => new WorkerProfileDto
                {
                    Id = wp.Id,
                    WorkerId = wp.WorkerId,
                    WorkerName = wp.Worker.FullName,
                    Skills = wp.Skills,
                    ExperienceYears = wp.ExperienceYears,
                    HourlyRate = wp.HourlyRate,
                    AvailabilityStatus = wp.AvailabilityStatus,
                    Bio = wp.Bio,
                    AvailableDate = wp.AvailableDate,
                    IsApproved = wp.IsApproved
                }).ToListAsync();
        }
    }
}
