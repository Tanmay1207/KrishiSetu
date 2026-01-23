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
    [Authorize(Roles = "MachineryOwner")]
    public class OwnerController : ControllerBase
    {
        private readonly IMachineryService _machineryService;
        private readonly IBookingService _bookingService;

        public OwnerController(IMachineryService machineryService, IBookingService bookingService)
        {
            _machineryService = machineryService;
            _bookingService = bookingService;
        }

        [HttpPost("machinery/list")]
        public async Task<IActionResult> ListMachinery(CreateMachineryDto dto)
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _machineryService.Create(ownerId, dto);
            return Ok(result);
        }

        [HttpPut("machinery/{id}")]
        public async Task<IActionResult> UpdateMachinery(int id, UpdateMachineryDto dto)
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _machineryService.UpdateMachinery(id, ownerId, dto);
            if (!result) return NotFound("Machinery not found or you don't have permission to update it.");
            return Ok("Machinery updated successfully.");
        }

        [HttpGet("machinery/mine")]
        public async Task<IActionResult> GetMyMachinery()
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _machineryService.GetByOwner(ownerId));
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _bookingService.GetOwnerBookings(ownerId));
        }
    }
}
