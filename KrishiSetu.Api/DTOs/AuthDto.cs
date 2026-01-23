using System.ComponentModel.DataAnnotations;

namespace KrishiSetu.Api.DTOs
{
    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; } = string.Empty;
        
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$", ErrorMessage = "Password must be at least 8 characters and include a letter, number, and special character.")]
        public string Password { get; set; } = string.Empty;
        
        public string FullName { get; set; } = string.Empty;
        
        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Please enter a valid 10-digit Indian mobile number.")]
        public string PhoneNumber { get; set; } = string.Empty;
        
        public string Role { get; set; } = string.Empty; // Farmer, MachineryOwner, FarmWorker
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
    }
}
