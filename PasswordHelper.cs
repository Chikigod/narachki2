using System.Security.Cryptography;
using System.Text;

public static class PasswordHelper
{
    // Method to create a password hash with salt
    public static (string PasswordHash, string PasswordSalt) CreatePasswordHash(string password)
    {
        using (var hmac = new HMACSHA256())
        {
            byte[] salt = new byte[16];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }

            hmac.Key = salt;
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            string passwordHash = Convert.ToBase64String(hashBytes);
            string passwordSalt = Convert.ToBase64String(salt);

            return (passwordHash, passwordSalt);
        }
    }

    // Method to verify password by comparing hash and salt
    public static bool VerifyPassword(string password, string storedHash, string storedSalt)
    {
        using (var hmac = new HMACSHA256())
        {
            byte[] salt = Convert.FromBase64String(storedSalt);
            hmac.Key = salt;

            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            string computedHashString = Convert.ToBase64String(computedHash);

            return computedHashString == storedHash;
        }
    }
}
