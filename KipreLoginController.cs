using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

[Route("api/[controller]")]
[ApiController]
public class KipreLoginController : ControllerBase
{
    private readonly KipreLoginRepository _kipreLoginRepository;
    private readonly IConfiguration _configuration;

    public KipreLoginController(KipreLoginRepository kipreLoginRepository, IConfiguration configuration)
    {
        _kipreLoginRepository = kipreLoginRepository;
        _configuration = configuration; // Add configuration to use JWT token (if needed)
    }

    // GET: api/KipreLogin
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var kipreLogins = await _kipreLoginRepository.GetAllAsync();
        return Ok(kipreLogins);
    }

    // GET: api/KipreLogin/email
    [HttpGet("{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var kipreLogin = await _kipreLoginRepository.GetByEmailAsync(email);
        if (kipreLogin == null)
        {
            return NotFound();
        }
        return Ok(kipreLogin);
    }

    // POST: api/KipreLogin
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] KipreLogin kipreLogin)
    {
        if (kipreLogin == null)
        {
            return BadRequest();
        }

        var result = await _kipreLoginRepository.AddAsync(kipreLogin);
        if (result > 0)
        {
            return CreatedAtAction(nameof(GetByEmail), new { email = kipreLogin.Email }, kipreLogin);
        }

        return StatusCode(500, "An error occurred while creating the record.");
    }

    // PUT: api/KipreLogin/email
    [HttpPut("{email}")]
    public async Task<IActionResult> Update(string email, [FromBody] KipreLogin kipreLogin)
    {
        if (email != kipreLogin.Email)
        {
            return BadRequest();
        }

        var existingLogin = await _kipreLoginRepository.GetByEmailAsync(email);
        if (existingLogin == null)
        {
            return NotFound();
        }

        var result = await _kipreLoginRepository.UpdateAsync(kipreLogin);
        if (result > 0)
        {
            return NoContent();
        }

        return StatusCode(500, "An error occurred while updating the record.");
    }

    // DELETE: api/KipreLogin/email
    [HttpDelete("{email}")]
    public async Task<IActionResult> Delete(string email)
    {
        var existingLogin = await _kipreLoginRepository.GetByEmailAsync(email);
        if (existingLogin == null)
        {
            return NotFound();
        }

        var result = await _kipreLoginRepository.DeleteAsync(email);
        if (result > 0)
        {
            return NoContent();
        }

        return StatusCode(500, "An error occurred while deleting the record.");
    }

    // POST: api/KipreLogin/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] KipreLogin loginRequest)
    {
        // Step 1: Get the user by email
        var existingLogin = await _kipreLoginRepository.GetByEmailAsync(loginRequest.Email);
        if (existingLogin == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        // Step 2: Verify the password (you should hash/compare the password securely)
        bool isPasswordValid = PasswordHelper.VerifyPassword(loginRequest.Password, existingLogin.PasswordHash, existingLogin.PasswordSalt);
        if (!isPasswordValid)
        {
            return Unauthorized("Invalid email or password.");
        }

        // Step 3: Generate JWT token (Optional, but recommended)
        var token = GenerateJwtToken(existingLogin);

        // Step 4: Return the response with the token
        return Ok(new { accessToken = token });
    }

    private string GenerateJwtToken(KipreLogin user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Email),
            // Add other claims as needed (e.g., roles, userId, etc.)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"])); // Add your secret key in the appsettings.json
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
