using Dapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using DapperApp.Models; // Ensure this matches the actual namespace
using System.Data;      // Namespace for IDbConnection

namespace DapperApp.Repository // Confirm this matches the namespace in your controller
{
    public class WaiterLocationRepository
    {
        private readonly DapperContext _context;

        // Constructor accepts DapperContext for creating SQL connections
        public WaiterLocationRepository(DapperContext context)
        {
            _context = context;
        }

        // Fetches all waiter locations
        public async Task<IEnumerable<WaiterLocation>> GetAllWaiterLocationsAsync()
        {
            var query = "SELECT * FROM Kiore_WaiterLocation";

            using (var connection = _context.CreateConnection())
            {
                var waiterLocations = await connection.QueryAsync<WaiterLocation>(query);
                return waiterLocations;
            }
        }

        // Fetches a specific waiter location by ID
        public async Task<WaiterLocation> GetWaiterLocationByIdAsync(int id)
        {
            var query = "SELECT * FROM Kiore_WaiterLocation WHERE WaiterLocationId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var waiterLocation = await connection.QuerySingleOrDefaultAsync<WaiterLocation>(query, new { Id = id });
                return waiterLocation;
            }
        }

        // Adds a new waiter location to the database
        public async Task<WaiterLocation> AddWaiterLocationAsync(WaiterLocation waiterLocation)
        {
            var query = "INSERT INTO Kiore_WaiterLocation (OrderId, WaiterLatitude, WaiterLongitude, Accuracy) VALUES (@OrderId, @WaiterLatitude, @WaiterLongitude, @Accuracy); SELECT CAST(SCOPE_IDENTITY() as int);";

            using (var connection = _context.CreateConnection())
            {
                var waiterLocationId = await connection.QuerySingleAsync<int>(query, waiterLocation);
                waiterLocation.WaiterLocationId = waiterLocationId;
                return waiterLocation;
            }
        }

        // Updates an existing waiter location
        public async Task<bool> UpdateWaiterLocationAsync(WaiterLocation waiterLocation)
        {
            var query = "UPDATE Kiore_WaiterLocation SET OrderId = @OrderId, WaiterLatitude = @WaiterLatitude, WaiterLongitude = @WaiterLongitude, Accuracy = @Accuracy WHERE WaiterLocationId = @WaiterLocationId";

            using (var connection = _context.CreateConnection())
            {
                var rowsAffected = await connection.ExecuteAsync(query, waiterLocation);
                return rowsAffected > 0; // Returns true if update was successful
            }
        }

        // Deletes a waiter location by ID
        public async Task<bool> DeleteWaiterLocationAsync(int id)
        {
            var query = "DELETE FROM Kiore_WaiterLocation WHERE WaiterLocationId = @Id";

            using (var connection = _context.CreateConnection())
            {
                var rowsAffected = await connection.ExecuteAsync(query, new { Id = id });
                return rowsAffected > 0; // Returns true if deletion was successful
            }
        }
    }
}
