using KrishiSetu.Api.Data;
using KrishiSetu.Api.DTOs;
using KrishiSetu.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace KrishiSetu.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> Register(RegisterDto registerDto);
        Task<AuthResponseDto?> Login(LoginDto loginDto);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto?> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return null;

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == registerDto.Role);
            if (role == null) return null;

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password),
                FullName = registerDto.FullName,
                PhoneNumber = registerDto.PhoneNumber,
                RoleId = role.Id,
                IsApproved = registerDto.Role == "Admin" // Auto-approve admin
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create worker profile if role is FarmWorker
            if (registerDto.Role == "FarmWorker")
            {
                var profile = new WorkerProfile { WorkerId = user.Id };
                _context.WorkerProfiles.Add(profile);
                await _context.SaveChangesAsync();
            }

            return new AuthResponseDto
            {
                Token = user.IsApproved ? GenerateJwtToken(user, role.Name) : string.Empty,
                Username = user.Username,
                Role = role.Name,
                IsApproved = user.IsApproved
            };
        }

        public async Task<AuthResponseDto?> Login(LoginDto loginDto)
        {
            Console.WriteLine($"Login attempt for: {loginDto.Email}");
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                Console.WriteLine($"Login failed: User {loginDto.Email} not found.");
                return null;
            }

            var enteredHash = HashPassword(loginDto.Password);
            if (user.PasswordHash != enteredHash)
            {
                Console.WriteLine($"Login failed: Invalid password for {loginDto.Email}.");
                Console.WriteLine($"Entered hash: {enteredHash}");
                Console.WriteLine($"Stored hash:  {user.PasswordHash}");
                return null;
            }

            Console.WriteLine($"Login successful for: {user.Email} (Role: {user.Role.Name}, Approved: {user.IsApproved})");
            return new AuthResponseDto
            {
                Token = user.IsApproved ? GenerateJwtToken(user, user.Role.Name) : string.Empty,
                Username = user.Username,
                Role = user.Role.Name,
                IsApproved = user.IsApproved
            };
        }

        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }

        public bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }

        private string GenerateJwtToken(User user, string roleName)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, roleName)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
