public class KipreLogin
{
    public string Email { get; set; }
    public string Password { get; set; } // Plain text password for user input

    public string PasswordHash { get; set; } // The hashed password
    public string PasswordSalt { get; set; } // The salt for the password hash
}
