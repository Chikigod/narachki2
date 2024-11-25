using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

public class DapperContext
{
    private readonly IConfiguration _configuration;
    private readonly string? _connectionString; // Marked as nullable

    // Constructor to initialize the DapperContext with IConfiguration
    public DapperContext(IConfiguration configuration)
    {
        _configuration = configuration;

        // Get the connection string from configuration
        _connectionString = _configuration.GetConnectionString("DefaultConnection");

        // If the connection string is not set or empty, throw an exception
        if (string.IsNullOrEmpty(_connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }
    }

    // Method to create a new database connection using the connection string
    public IDbConnection CreateConnection()
        => new SqlConnection(_connectionString ?? throw new InvalidOperationException("Connection string is null"));
}
