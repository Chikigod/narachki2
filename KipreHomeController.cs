using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class KipreHomeController : ControllerBase
{
    private readonly KipreHomeRepository _kipreHomeRepository;

    public KipreHomeController(KipreHomeRepository kipreHomeRepository)
    {
        _kipreHomeRepository = kipreHomeRepository;
    }

    // GET: api/KipreHome
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var kipreHomes = await _kipreHomeRepository.GetAllAsync();
        return Ok(kipreHomes);
    }

    // GET: api/KipreHome/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var kipreHome = await _kipreHomeRepository.GetByIdAsync(id);
        if (kipreHome == null)
        {
            return NotFound();
        }
        return Ok(kipreHome);
    }

    // POST: api/KipreHome
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] KipreHome kipreHome)
    {
        if (kipreHome == null)
        {
            return BadRequest();
        }

        var result = await _kipreHomeRepository.AddAsync(kipreHome);
        if (result > 0)
        {
            return CreatedAtAction(nameof(GetById), new { id = kipreHome.Id }, kipreHome);
        }
        return StatusCode(500, "An error occurred while creating the record.");
    }

    // PUT: api/KipreHome/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] KipreHome kipreHome)
    {
        if (id != kipreHome.Id)
        {
            return BadRequest();
        }

        var existingRecord = await _kipreHomeRepository.GetByIdAsync(id);
        if (existingRecord == null)
        {
            return NotFound();
        }

        var result = await _kipreHomeRepository.UpdateAsync(kipreHome);
        if (result > 0)
        {
            return NoContent();
        }

        return StatusCode(500, "An error occurred while updating the record.");
    }

    // DELETE: api/KipreHome/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var kipreHome = await _kipreHomeRepository.GetByIdAsync(id);
        if (kipreHome == null)
        {
            return NotFound();
        }

        var result = await _kipreHomeRepository.DeleteAsync(id);
        if (result > 0)
        {
            return NoContent();
        }

        return StatusCode(500, "An error occurred while deleting the record.");
    }
}
