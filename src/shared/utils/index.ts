import { MAX_COLUMNS } from '../constants';

/**
 * Converts a zero-based column index to an Excel-style column letter
 * @param columnIndex The zero-based column index
 * @returns The Excel-style column letter
 */
export function convertColumnIndexToLetter(columnIndex: number): string {
  // Validate the input columnIndex
  if (columnIndex < 0 || columnIndex >= MAX_COLUMNS) {
    throw new Error(`Column index out of range. Must be between 0 and ${MAX_COLUMNS - 1}.`);
  }

  // Convert the zero-based index to a one-based index
  const oneBased = columnIndex + 1;

  let columnLetter = '';
  let remaining = oneBased;

  // Generate the column letter using a loop and character code manipulation
  while (remaining > 0) {
    remaining--;
    const charCode = (remaining % 26) + 65; // 65 is the ASCII code for 'A'
    columnLetter = String.fromCharCode(charCode) + columnLetter;
    remaining = Math.floor(remaining / 26);
  }

  // Return the resulting column letter
  return columnLetter;
}