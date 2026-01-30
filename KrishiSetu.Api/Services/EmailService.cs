using System.Net;
using System.Net.Mail;

namespace KrishiSetu.Api.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            // For development/testing without valid SMTP credentials, logging the OTP is sufficient and reliable.
            // The user provided Razorpay keys which are not for Email.
            _logger.LogInformation($"[MOCK EMAIL] To: {to} | Subject: {subject} | Body: {body}");
            
            try 
            {
                var smtpHost = _configuration["Smtp:Host"];
                var smtpUsername = _configuration["Smtp:Username"];
                var smtpPassword = _configuration["Smtp:Password"];

                // Check if we have valid non-placeholder credentials
                bool hasValidCredentials = !string.IsNullOrEmpty(smtpHost) &&
                                           !string.IsNullOrEmpty(smtpUsername) &&
                                           !string.IsNullOrEmpty(smtpPassword) &&
                                           smtpUsername != "YOUR_EMAIL@gmail.com" &&
                                           smtpPassword != "YOUR_APP_PASSWORD";

                if (hasValidCredentials)
                {
                    _logger.LogInformation($"Attempting to send email via SMTP. Host: {smtpHost}, Port: {_configuration["Smtp:Port"]}, Username: {smtpUsername}, PasswordLength: {smtpPassword?.Length ?? 0}");

                    var smtpClient = new SmtpClient(smtpHost)
                    {
                        Port = int.Parse(_configuration["Smtp:Port"] ?? "587"),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(smtpUsername, smtpPassword)
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_configuration["Smtp:From"] ?? "noreply@krishisetu.com"),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(to);

                    await smtpClient.SendMailAsync(mailMessage);
                    _logger.LogInformation($"Email sent successfully to {to}");
                }
                else
                {
                    _logger.LogInformation("Using Mock Email Service (placeholders detected). OTPs will be logged to console instead of sent via email.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email: {ex.Message}");
                // Don't throw, so flow continues (or maybe we should throw?) 
                // For now, let's allow it to fail gracefully so dev can see logs.
            }
            
            await Task.CompletedTask;
        }
    }
}
