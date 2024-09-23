using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class WorkbookController : ControllerBase
{
    private readonly WorkbookService _workbookService;
    private readonly AuthService _authService;

    public WorkbookController(WorkbookService workbookService, AuthService authService)
    {
        _workbookService = workbookService;
        _authService = authService;
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<WorkbookDTO>> GetWorkbook(string id)
    {
        var currentUser = await _authService.GetCurrentUserAsync();
        var workbook = await _workbookService.GetWorkbookAsync(id);

        if (workbook == null)
        {
            return NotFound();
        }

        if (!await _workbookService.UserHasPermissionAsync(currentUser, workbook, "Read"))
        {
            return Forbid();
        }

        var workbookDto = MapToWorkbookDTO(workbook);
        return Ok(workbookDto);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<WorkbookDTO>> CreateWorkbook(WorkbookDTO workbookDto)
    {
        var currentUser = await _authService.GetCurrentUserAsync();
        var workbook = MapToIWorkbook(workbookDto);

        var createdWorkbook = await _workbookService.CreateWorkbookAsync(workbook, currentUser);
        var createdWorkbookDto = MapToWorkbookDTO(createdWorkbook);

        return CreatedAtAction(nameof(GetWorkbook), new { id = createdWorkbookDto.Id }, createdWorkbookDto);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateWorkbook(string id, WorkbookDTO workbookDto)
    {
        var currentUser = await _authService.GetCurrentUserAsync();
        var existingWorkbook = await _workbookService.GetWorkbookAsync(id);

        if (existingWorkbook == null)
        {
            return NotFound();
        }

        if (!await _workbookService.UserHasPermissionAsync(currentUser, existingWorkbook, "Write"))
        {
            return Forbid();
        }

        var updatedWorkbook = MapToIWorkbook(workbookDto);
        await _workbookService.UpdateWorkbookAsync(id, updatedWorkbook);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteWorkbook(string id)
    {
        var currentUser = await _authService.GetCurrentUserAsync();
        var workbook = await _workbookService.GetWorkbookAsync(id);

        if (workbook == null)
        {
            return NotFound();
        }

        if (!await _workbookService.UserHasPermissionAsync(currentUser, workbook, "Delete"))
        {
            return Forbid();
        }

        await _workbookService.DeleteWorkbookAsync(id);
        return NoContent();
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<WorkbookDTO>>> ListWorkbooks()
    {
        var currentUser = await _authService.GetCurrentUserAsync();
        var workbooks = await _workbookService.ListWorkbooksAsync(currentUser);

        var workbookDtos = workbooks.Select(MapToWorkbookDTO);
        return Ok(workbookDtos);
    }

    private WorkbookDTO MapToWorkbookDTO(IWorkbook workbook)
    {
        // Implement mapping logic
        throw new NotImplementedException();
    }

    private IWorkbook MapToIWorkbook(WorkbookDTO workbookDto)
    {
        // Implement mapping logic
        throw new NotImplementedException();
    }
}