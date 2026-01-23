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
    [Authorize]
    public class FarmerController : ControllerBase
    {
        private readonly IMachineryService _machineryService;
        private readonly IWorkerService _workerService;
        private readonly IBookingService _bookingService;

        public FarmerController(IMachineryService machineryService, IWorkerService workerService, IBookingService bookingService)
        {
            _machineryService = machineryService;
            _workerService = workerService;
            _bookingService = bookingService;
        }

        [HttpGet("machinery/search")]
        public async Task<IActionResult> SearchMachinery(string? category, decimal? maxRate)
        {
            return Ok(await _machineryService.GetAll(category, maxRate));
        }

        [HttpGet("workers/search")]
        public async Task<IActionResult> SearchWorkers(string? skill, decimal? maxRate)
        {
            return Ok(await _workerService.GetAll(skill, maxRate));
        }

        [HttpPost("bookings/create")]
        public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
        {
            var farmerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _bookingService.CreateBooking(farmerId, dto);
            if (result == null) return BadRequest("Could not create booking.");
            return Ok(result);
        }

        [HttpGet("bookings/history")]
        public async Task<IActionResult> GetBookingHistory()
        {
            var farmerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _bookingService.GetFarmerBookings(farmerId));
        }

        [HttpPost("bookings/{id}/pay")]
        public async Task<IActionResult> PayNow(int id)
        {
            var result = await _bookingService.ProcessPayment(id);
            if (!result) return BadRequest("Payment failed.");
            return Ok("Payment successful.");
        }
    }
}
