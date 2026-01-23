using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Services;
using KrishiSetu.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KrishiSetu.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            return Ok(await _adminService.GetStats());
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _adminService.GetAllUsers());
        }

        [HttpPost("users/{id}/approve")]
        public async Task<IActionResult> ApproveUser(int id, [FromQuery] bool approve)
        {
            var result = await _adminService.ApproveUser(id, approve);
            if (!result) return NotFound();
            return Ok("User approval status updated.");
        }

        [HttpPost("machinery/{id}/approve")]
        public async Task<IActionResult> ApproveMachinery(int id, [FromQuery] bool approve)
        {
            var result = await _adminService.ApproveMachinery(id, approve);
            if (!result) return NotFound();
            return Ok("Machinery approval status updated.");
        }

        [HttpGet("machinery/pending")]
        public async Task<IActionResult> GetPendingMachinery()
        {
            return Ok(await _adminService.GetPendingMachinery());
        }

        [HttpGet("machinery/debug")]
        public async Task<IActionResult> GetAllMachineryDebug()
        {
            return Ok(await _adminService.GetAllMachineryDebug());
        }
    }
}
