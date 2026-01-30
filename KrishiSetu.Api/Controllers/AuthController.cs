using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Services;
using KrishiSetu.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace KrishiSetu.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var result = await _authService.Register(registerDto);
            if (result == null)
                return BadRequest("Email already exists.");

            return Ok(result);
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto verifyOtpDto)
        {
            var result = await _authService.VerifyOtp(verifyOtpDto.Email, verifyOtpDto.Otp);
            if (result == null)
                return BadRequest("Invalid or expired OTP.");

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);
            if (result == null)
                return Unauthorized("Invalid credentials.");

            if (!result.IsApproved)
                return StatusCode(403, "Your account is pending admin approval.");

            return Ok(result);
        }
    }
}
