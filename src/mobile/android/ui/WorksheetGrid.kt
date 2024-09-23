import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.text.input.TextFieldValue
import kotlinx.coroutines.launch

@Composable
fun WorksheetGrid(
    workbookService: WorkbookService,
    calculationService: CalculationService
) {
    val currentWorksheet = remember { mutableStateOf<IWorksheet?>(null) }
    val rowCount = remember { mutableStateOf(100) } // Default row count
    val columnCount = remember { mutableStateOf(26) } // Default column count (A to Z)
    val cellWidth = remember { mutableStateOf(100f) }
    val cellHeight = remember { mutableStateOf(40f) }
    val selectedCell = remember { mutableStateOf<CellAddress?>(null) }
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            state = rememberLazyListState(),
            modifier = Modifier.fillMaxSize()
        ) {
            // Column headers
            item {
                LazyRow(state = rememberLazyListState()) {
                    items(columnCount.value + 1) { columnIndex ->
                        if (columnIndex == 0) {
                            // Empty cell for top-left corner
                            Box(
                                modifier = Modifier
                                    .width(cellWidth.value.dp)
                                    .height(cellHeight.value.dp)
                                    .border(1.dp, MaterialTheme.colors.onSurface.copy(alpha = 0.12f))
                            )
                        } else {
                            // Column header
                            Text(
                                text = getColumnLabel(columnIndex),
                                modifier = Modifier
                                    .width(cellWidth.value.dp)
                                    .height(cellHeight.value.dp)
                                    .border(1.dp, MaterialTheme.colors.onSurface.copy(alpha = 0.12f))
                                    .padding(4.dp)
                            )
                        }
                    }
                }
            }

            // Rows with cells
            items(rowCount.value) { rowIndex ->
                LazyRow(state = rememberLazyListState()) {
                    item {
                        // Row header
                        Text(
                            text = (rowIndex + 1).toString(),
                            modifier = Modifier
                                .width(cellWidth.value.dp)
                                .height(cellHeight.value.dp)
                                .border(1.dp, MaterialTheme.colors.onSurface.copy(alpha = 0.12f))
                                .padding(4.dp)
                        )
                    }

                    items(columnCount.value) { columnIndex ->
                        CellView(rowIndex, columnIndex)
                    }
                }
            }
        }
    }

    // Implement pinch-to-zoom
    val scale = remember { mutableStateOf(1f) }
    Box(modifier = Modifier.fillMaxSize()) {
        Scale(
            state = rememberScaleState(),
            onScale = { scaleFactor ->
                scale.value *= scaleFactor
                handlePinchToZoom(scale.value)
            }
        ) {
            // Content to be scaled
        }
    }
}

@Composable
fun CellView(row: Int, column: Int) {
    val cellAddress = CellAddress(row, column)
    val cellValue = remember { mutableStateOf(TextFieldValue("")) }

    BasicTextField(
        value = cellValue.value,
        onValueChange = { newValue ->
            cellValue.value = newValue
            updateCellValue(cellAddress, newValue.text)
        },
        modifier = Modifier
            .width(cellWidth.value.dp)
            .height(cellHeight.value.dp)
            .border(1.dp, MaterialTheme.colors.onSurface.copy(alpha = 0.12f))
            .padding(4.dp)
            .clickable { selectCell(cellAddress) }
    )
}

fun updateCellValue(cellAddress: CellAddress, newValue: CellValue) {
    // Implementation for updating cell value
}

fun selectCell(cellAddress: CellAddress) {
    // Implementation for cell selection
}

fun refreshGrid() {
    // Implementation for refreshing the grid
}

fun handlePinchToZoom(scale: Float) {
    // Implementation for handling pinch-to-zoom
}

fun getColumnLabel(columnIndex: Int): String {
    // Implementation to convert column index to letter (A, B, C, ...)
    return ('A' + columnIndex - 1).toString()
}