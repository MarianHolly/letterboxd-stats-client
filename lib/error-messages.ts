/**
 * Error categorization and user-friendly messaging system
 * Provides contextual guidance for different types of upload errors
 */

export type ErrorCategory =
  | 'invalid_filename'
  | 'unknown_csv_type'
  | 'missing_columns'
  | 'file_read_error'
  | 'parse_error'
  | 'invalid_data'
  | 'empty_file'
  | 'encoding_error';

export interface CategorizedError {
  category: ErrorCategory;
  userMessage: string;
  technicalMessage: string;
  guidance: string;
  severity: 'error' | 'warning';
}

/**
 * Categorizes and enriches error messages with user-friendly guidance
 */
export function categorizeError(
  originalMessage: string,
  fileName: string,
  detectedType?: string
): CategorizedError {
  const lower = originalMessage.toLowerCase();

  // Check for specific error patterns
  if (originalMessage.includes('Unknown file type')) {
    return {
      category: 'invalid_filename',
      userMessage: `"${fileName}" is not a valid Letterboxd export file`,
      technicalMessage: originalMessage,
      guidance: 'Expected file names: watched.csv, ratings.csv, diary.csv, films.csv, or watchlist.csv',
      severity: 'error',
    };
  }

  if (originalMessage.includes('Unknown CSV type') || originalMessage.includes('missing required columns')) {
    return {
      category: 'unknown_csv_type',
      userMessage: `"${fileName}" does not appear to be a Letterboxd CSV export`,
      technicalMessage: originalMessage,
      guidance: detectedType
        ? `File might be a ${detectedType} export, but headers don't match. Try re-exporting from Letterboxd.`
        : 'Make sure you exported the file directly from Letterboxd Settings → Import & Export',
      severity: 'error',
    };
  }

  if (originalMessage.includes('Missing required column')) {
    const columnMatch = originalMessage.match(/Missing required column: (.+)/);
    const column = columnMatch?.[1] || 'unknown';
    return {
      category: 'missing_columns',
      userMessage: `"${fileName}" is missing required column: "${column}"`,
      technicalMessage: originalMessage,
      guidance: 'This file may be corrupted or from a different source. Try re-exporting from Letterboxd.',
      severity: 'error',
    };
  }

  if (originalMessage.includes('CSV file is empty')) {
    return {
      category: 'empty_file',
      userMessage: `"${fileName}" is empty`,
      technicalMessage: originalMessage,
      guidance: 'Make sure you selected a file with movie data.',
      severity: 'error',
    };
  }

  if (originalMessage.includes('Failed to read file') || originalMessage.includes('File reading error')) {
    return {
      category: 'file_read_error',
      userMessage: `Could not read file "${fileName}"`,
      technicalMessage: originalMessage,
      guidance: 'Try uploading the file again. If the problem persists, the file may be corrupted.',
      severity: 'error',
    };
  }

  if (originalMessage.includes('invalid') || originalMessage.includes('Invalid')) {
    if (originalMessage.includes('date')) {
      return {
        category: 'invalid_data',
        userMessage: `"${fileName}" contains invalid dates`,
        technicalMessage: originalMessage,
        guidance: 'Dates should be in YYYY-MM-DD format. Re-export from Letterboxd to fix formatting.',
        severity: 'error',
      };
    }
    if (originalMessage.includes('rating')) {
      return {
        category: 'invalid_data',
        userMessage: `"${fileName}" contains invalid ratings`,
        technicalMessage: originalMessage,
        guidance: 'Ratings must be between 0.5 and 5.0. Check the source file and re-export.',
        severity: 'error',
      };
    }
    if (originalMessage.includes('year')) {
      return {
        category: 'invalid_data',
        userMessage: `"${fileName}" contains invalid year values`,
        technicalMessage: originalMessage,
        guidance: 'Years must be between 1890-2100. Re-export the file from Letterboxd.',
        severity: 'warning',
      };
    }
    if (originalMessage.includes('URI')) {
      return {
        category: 'invalid_data',
        userMessage: `"${fileName}" contains invalid Letterboxd URIs`,
        technicalMessage: originalMessage,
        guidance: 'This file may be corrupted or manually edited. Re-export from Letterboxd.',
        severity: 'error',
      };
    }
    return {
      category: 'invalid_data',
      userMessage: `"${fileName}" contains invalid data`,
      technicalMessage: originalMessage,
      guidance: 'Re-export the file from Letterboxd Settings → Import & Export',
      severity: 'error',
    };
  }

  if (originalMessage.includes('CSV parsing error')) {
    return {
      category: 'parse_error',
      userMessage: `"${fileName}" could not be parsed`,
      technicalMessage: originalMessage,
      guidance: 'The file may have formatting issues. Try opening it in a text editor and re-saving as CSV.',
      severity: 'error',
    };
  }

  if (originalMessage.includes('encoding') || originalMessage.includes('UTF')) {
    return {
      category: 'encoding_error',
      userMessage: `"${fileName}" has unsupported encoding`,
      technicalMessage: originalMessage,
      guidance: 'Re-export the file from Letterboxd. Make sure to use the standard export format.',
      severity: 'error',
    };
  }

  if (lower.includes('row') && (lower.includes('failed') || lower.includes('error'))) {
    const rowMatch = originalMessage.match(/(\d+)\s+row/);
    const count = rowMatch?.[1] || 'some';
    return {
      category: 'parse_error',
      userMessage: `"${fileName}" has ${count} rows with errors`,
      technicalMessage: originalMessage,
      guidance: 'Some entries may be malformed. Try re-exporting or check for manually edited entries.',
      severity: 'warning',
    };
  }

  // Default fallback
  return {
    category: 'parse_error',
    userMessage: `Error processing "${fileName}"`,
    technicalMessage: originalMessage,
    guidance: 'Try re-exporting the file from Letterboxd or uploading a different file.',
    severity: 'error',
  };
}

/**
 * Get helpful link based on error category
 */
export function getHelpLink(category: ErrorCategory): string | null {
  const baseUrl = 'https://letterboxd.com/settings/import/';

  switch (category) {
    case 'invalid_filename':
    case 'unknown_csv_type':
    case 'missing_columns':
      return baseUrl;
    default:
      return null;
  }
}

/**
 * Format error with user message and guidance for display
 */
export function formatErrorForDisplay(
  originalMessage: string,
  fileName: string,
  detectedType?: string
): { title: string; message: string; guidance: string } {
  const error = categorizeError(originalMessage, fileName, detectedType);

  return {
    title: error.userMessage,
    message: error.userMessage,
    guidance: error.guidance,
  };
}
