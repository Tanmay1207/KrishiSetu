using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Services;
using KrishiSetu.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KrishiSetu.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "FarmWorker")]
    public class WorkerController : ControllerBase
    {
        private readonly IWorkerService _workerService;
        private readonly IBookingService _bookingService;

        public WorkerController(IWorkerService workerService, IBookingService bookingService)
        {
            _workerService = workerService;
            _bookingService = bookingService;
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateWorkerProfileDto dto)
        {
            var workerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _workerService.UpdateProfile(workerId, dto);
            if (!result) return BadRequest("Profile not found.");
            return Ok("Profile updated and pending for approval.");
        }

        [HttpGet("profile/mine")]
        public async Task<IActionResult> GetMyProfile()
        {
            var workerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _workerService.GetByWorkerId(workerId));
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            var workerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _bookingService.GetWorkerBookings(workerId));
        }
    }
}
