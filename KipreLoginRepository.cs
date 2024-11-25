using System.Data;
using Dapper;
using System.Threading.Tasks;
using System.Collections.Generic;

public class KipreLoginRepository
{
    private readonly IDbConnection _dbConnection;

    public KipreLoginRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // Get all login entries (for example, admin purposes)
    public async Task<IEnumerable<KipreLogin>> GetAllAsync()
    {
        string query = "SELECT * FROM Kipre_Login";
        return await _dbConnection.QueryAsync<KipreLogin>(query);
    }

    // Get a login entry by email
    public async Task<KipreLogin> GetByEmailAsync(string email)
    {
        string query = "SELECT * FROM Kipre_Login WHERE Email = @Email";
        return await _dbConnection.QueryFirstOrDefaultAsync<KipreLogin>(query, new { Email = email });
    }

    // Add a new login entry
    public async Task<int> AddAsync(KipreLogin kipreLogin)
    {
        string query = @"
            INSERT INTO Kipre_Login (Email, Password)
            VALUES (@Email, @Password)";
        return await _dbConnection.ExecuteAsync(query, kipreLogin);
    }

    // Update an existing login entry
    public async Task<int> UpdateAsync(KipreLogin kipreLogin)
    {
        string query = @"
            UPDATE Kipre_Login 
            SET Email = @Email, Password = @Password
            WHERE Email = @Email";
        return await _dbConnection.ExecuteAsync(query, kipreLogin);
    }

    // Delete a login entry by email
    public async Task<int> DeleteAsync(string email)
    {
        string query = "DELETE FROM Kipre_Login WHERE Email = @Email";
        return await _dbConnection.ExecuteAsync(query, new { Email = email });
    }
}
