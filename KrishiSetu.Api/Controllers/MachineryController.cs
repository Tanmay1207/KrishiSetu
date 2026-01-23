using KrishiSetu.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace KrishiSetu.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MachineryController : ControllerBase
    {
        private readonly IMachineryService _machineryService;

        public MachineryController(IMachineryService machineryService)
        {
            _machineryService = machineryService;
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            return Ok(await _machineryService.GetCategories());
        }
    }
}
