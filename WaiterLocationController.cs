using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using DapperApp.Models; // Ensure this matches your actual namespace
using DapperApp.Repository; // Ensure this matches your actual namespace

[Route("api/[controller]")]
[ApiController]
public class WaiterLocationController : ControllerBase
{
    private readonly WaiterLocationRepository _waiterLocationRepository;

    public WaiterLocationController(WaiterLocationRepository waiterLocationRepository)
    {
        _waiterLocationRepository = waiterLocationRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WaiterLocation>>> GetAllWaiterLocations()
    {
        var waiterLocations = await _waiterLocationRepository.GetAllWaiterLocationsAsync();
        return Ok(waiterLocations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WaiterLocation>> GetWaiterLocationById(int id)
    {
        var waiterLocation = await _waiterLocationRepository.GetWaiterLocationByIdAsync(id);
        if (waiterLocation == null)
        {
            return NotFound();
        }
        return Ok(waiterLocation);
    }

    [HttpPost]
    public async Task<ActionResult<WaiterLocation>> AddWaiterLocation(WaiterLocation waiterLocation)
    {
        var addedWaiterLocation = await _waiterLocationRepository.AddWaiterLocationAsync(waiterLocation);
        return CreatedAtAction(nameof(GetWaiterLocationById), new { id = addedWaiterLocation.WaiterLocationId }, addedWaiterLocation);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateWaiterLocation(int id, WaiterLocation waiterLocation)
    {
        if (id != waiterLocation.WaiterLocationId)
        {
            return BadRequest();
        }

        var updated = await _waiterLocationRepository.UpdateWaiterLocationAsync(waiterLocation);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWaiterLocation(int id)
    {
        var deleted = await _waiterLocationRepository.DeleteWaiterLocationAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
