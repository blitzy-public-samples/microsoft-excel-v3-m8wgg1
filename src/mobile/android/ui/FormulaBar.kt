import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

@Composable
fun FormulaBar(
    workbookService: WorkbookService,
    calculationService: CalculationService,
    currentWorksheet: MutableState<IWorksheet?>,
    selectedCell: MutableState<CellAddress?>
) {
    val formulaText = remember { mutableStateOf("") }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(selectedCell.value) {
        updateFormulaBar(currentWorksheet.value, selectedCell.value, formulaText)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp)
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "fx",
            modifier = Modifier.padding(end = 8.dp),
            style = MaterialTheme.typography.body1
        )
        TextField(
            value = formulaText.value,
            onValueChange = { handleFormulaChange(it, formulaText) },
            modifier = Modifier.weight(1f),
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
            keyboardActions = KeyboardActions(onDone = {
                coroutineScope.launch {
                    handleFormulaSubmit(
                        formulaText.value,
                        currentWorksheet.value,
                        selectedCell.value,
                        workbookService,
                        calculationService
                    )
                }
            })
        )
    }
}

private fun updateFormulaBar(
    currentWorksheet: IWorksheet?,
    selectedCell: CellAddress?,
    formulaText: MutableState<String>
) {
    if (currentWorksheet != null && selectedCell != null) {
        val cellValue = currentWorksheet.getCellValue(selectedCell)
        formulaText.value = when {
            cellValue is String && cellValue.startsWith("=") -> cellValue
            else -> cellValue?.toString() ?: ""
        }
    } else {
        formulaText.value = ""
    }
}

private fun handleFormulaChange(newValue: String, formulaText: MutableState<String>) {
    formulaText.value = newValue
}

private suspend fun handleFormulaSubmit(
    formula: String,
    currentWorksheet: IWorksheet?,
    selectedCell: CellAddress?,
    workbookService: WorkbookService,
    calculationService: CalculationService
) {
    if (currentWorksheet != null && selectedCell != null) {
        val newValue = if (formula.startsWith("=")) {
            formula
        } else {
            formula.toDoubleOrNull() ?: formula
        }
        workbookService.updateCellValue(currentWorksheet, selectedCell, newValue)
        calculationService.recalculateWorksheet(currentWorksheet)
    }
}