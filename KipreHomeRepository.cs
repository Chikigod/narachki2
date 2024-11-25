using Dapper;  // Add Dapper namespace for extension methods
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;

public class KipreHomeRepository
{
    private readonly IDbConnection _dbConnection;

    public KipreHomeRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<KipreHome>> GetAllAsync()
    {
        string query = "SELECT * FROM Kipre_Home";
        return await _dbConnection.QueryAsync<KipreHome>(query);  // QueryAsync requires Dapper
    }

    public async Task<KipreHome> GetByIdAsync(int id)
    {
        string query = "SELECT * FROM Kipre_Home WHERE Id = @Id";
        return await _dbConnection.QueryFirstOrDefaultAsync<KipreHome>(query, new { Id = id });  // QueryFirstOrDefaultAsync also needs Dapper
    }

    public async Task<int> AddAsync(KipreHome kipreHome)
    {
        string query = @"
            INSERT INTO Kipre_Home 
            (Name, OrderTypeId, Latitude, Longitude, Browser, OS, AppVersion, WindowWidth, WindowHeight, 
             DeviceWidth, DeviceHeight, TimeZone, Accuracy, DistanceToCoffeeShop)
            VALUES 
            (@Name, @OrderTypeId, @Latitude, @Longitude, @Browser, @OS, @AppVersion, @WindowWidth, 
             @WindowHeight, @DeviceWidth, @DeviceHeight, @TimeZone, @Accuracy, @DistanceToCoffeeShop)";
        return await _dbConnection.ExecuteAsync(query, kipreHome);  // ExecuteAsync for non-query
    }

    public async Task<int> UpdateAsync(KipreHome kipreHome)
    {
        string query = @"
            UPDATE Kipre_Home 
            SET Name = @Name, OrderTypeId = @OrderTypeId, Latitude = @Latitude, Longitude = @Longitude,
                Browser = @Browser, OS = @OS, AppVersion = @AppVersion, WindowWidth = @WindowWidth,
                WindowHeight = @WindowHeight, DeviceWidth = @DeviceWidth, DeviceHeight = @DeviceHeight,
                TimeZone = @TimeZone, Accuracy = @Accuracy, DistanceToCoffeeShop = @DistanceToCoffeeShop
            WHERE Id = @Id";
        return await _dbConnection.ExecuteAsync(query, kipreHome);  // ExecuteAsync for non-query
    }

    public async Task<int> DeleteAsync(int id)
    {
        string query = "DELETE FROM Kipre_Home WHERE Id = @Id";
        return await _dbConnection.ExecuteAsync(query, new { Id = id });  // ExecuteAsync for non-query
    }
}
