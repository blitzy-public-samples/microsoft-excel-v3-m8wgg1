using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/excel")]
[Authorize]
public class ExcelRestAPI : ControllerBase
{
    private readonly WorkbookService workbookService;
    private readonly AuthService authService;
    private readonly CalculationService calculationService;
    private readonly VisualizationService visualizationService;

    public ExcelRestAPI(WorkbookService workbookService, AuthService authService, CalculationService calculationService, VisualizationService visualizationService)
    {
        this.workbookService = workbookService;
        this.authService = authService;
        this.calculationService = calculationService;
        this.visualizationService = visualizationService;
    }

    [HttpGet("workbooks")]
    public async Task<ActionResult<IEnumerable<IWorkbook>>> GetWorkbooks()
    {
        var user = await authService.GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized();
        }

        var workbooks = await workbookService.GetWorkbooksForUserAsync(user.Id);
        return Ok(workbooks);
    }

    [HttpGet("workbooks/{id}")]
    public async Task<ActionResult<IWorkbook>> GetWorkbook(string id)
    {
        var user = await authService.GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized();
        }

        var workbook = await workbookService.GetWorkbookAsync(id);
        if (workbook == null)
        {
            return NotFound();
        }

        if (!await workbookService.UserHasAccessToWorkbookAsync(user.Id, id))
        {
            return Forbid();
        }

        return Ok(workbook);
    }

    [HttpGet("workbooks/{workbookId}/worksheets")]
    public async Task<ActionResult<IEnumerable<IWorksheet>>> GetWorksheets(string workbookId)
    {
        var user = await authService.GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized();
        }

        if (!await workbookService.UserHasAccessToWorkbookAsync(user.Id, workbookId))
        {
            return Forbid();
        }

        var worksheets = await workbookService.GetWorksheetsAsync(workbookId);
        return Ok(worksheets);
    }

    [HttpGet("workbooks/{workbookId}/worksheets/{worksheetId}/cells/{cellAddress}")]
    public async Task<ActionResult<CellValue>> GetCellValue(string workbookId, string worksheetId, string cellAddress)
    {
        var user = await authService.GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized();
        }

        if (!await workbookService.UserHasAccessToWorkbookAsync(user.Id, workbookId))
        {
            return Forbid();
        }

        var cellValue = await workbookService.GetCellValueAsync(workbookId, worksheetId, cellAddress);
        return Ok(cellValue);
    }

    [HttpPut("workbooks/{workbookId}/worksheets/{worksheetId}/cells/{cellAddress}")]
    public async Task<IActionResult> SetCellValue(string workbookId, string worksheetId, string cellAddress, [FromBody] CellValue value)
    {
        var user = await authService.GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized();
        }

        if (!await workbookService.UserHasAccessToWorkbookAsync(user.Id, workbookId))
        {
            return Forbid();
        }

        await workbookService.SetCellValueAsync(workbookId, worksheetId, cellAddress, value);
        await calculationService.RecalculateWorkbookAsync(workbookId);
        
        return Ok();
    }

    [HttpPost("workbooks/{workbookId}/worksheets/{worksheetId}/charts")]
    public async Task<IActionResult> CreateChart(string workbookId, string worksheetId, [FromBody] ChartCreationRequest request)
    {
        var user = await authService.GetCurrentUserAsync();
        if (user == null)
        {
            return Unauthorized();
        }

        if (!await workbookService.UserHasAccessToWorkbookAsync(user.Id, workbookId))
        {
            return Forbid();
        }

        var chart = await visualizationService.CreateChartAsync(workbookId, worksheetId, request.Type, request.DataRange);
        return Ok(chart);
    }
}

public class ChartCreationRequest
{
    public ChartType Type { get; set; }
    public CellRange DataRange { get; set; }
}