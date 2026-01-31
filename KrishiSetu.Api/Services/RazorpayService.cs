using Razorpay.Api;

namespace KrishiSetu.Api.Services
{
    public interface IRazorpayService
    {
        string CreateOrder(decimal amount, string receiptId);
        bool VerifySignature(string paymentId, string orderId, string signature);
        string GetKeyId();
    }

    public class RazorpayService : IRazorpayService
    {
        private readonly IConfiguration _configuration;
        private readonly string _keyId;
        private readonly string _keySecret;

        public RazorpayService(IConfiguration configuration)
        {
            _configuration = configuration;
            _keyId = _configuration["Razorpay:KeyId"] ?? "";
            _keySecret = _configuration["Razorpay:KeySecret"] ?? "";
        }

        public string CreateOrder(decimal amount, string receiptId)
        {
            if (string.IsNullOrEmpty(_keyId) || string.IsNullOrEmpty(_keySecret))
            {
                throw new Exception("Razorpay credentials are not configured.");
            }

            RazorpayClient client = new RazorpayClient(_keyId, _keySecret);

            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount", (int)(amount * 100)); // Amount in paise
            options.Add("currency", "INR");
            options.Add("receipt", receiptId);

            Order order = client.Order.Create(options);
            return order["id"].ToString();
        }

        public bool VerifySignature(string paymentId, string orderId, string signature)
        {
            try
            {
                Dictionary<string, string> attributes = new Dictionary<string, string>();
                attributes.Add("razorpay_payment_id", paymentId);
                attributes.Add("razorpay_order_id", orderId);
                attributes.Add("razorpay_signature", signature);

                Utils.verifyPaymentSignature(attributes);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public string GetKeyId() => _keyId;
    }
}
