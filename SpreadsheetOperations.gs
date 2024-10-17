/**
 * Appends extracted invoice data to the result sheet.
 * @param {Object} invoiceData - The extracted invoice data.
 * @param {string} fileName - The name of the processed file.
 */
function appendToResultSheet(invoiceData, fileName) {
  const config = loadConfig();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(config.resultSheetName);
  
  // If the result sheet doesn't exist, create it and add headers
  if (!sheet) {
    sheet = ss.insertSheet(config.resultSheetName);
    const headers = ['Date', 'File Name', 'Link', ...Object.keys(invoiceData)];
    sheet.appendRow(headers);
  }
  
  // Prepare the row data
  const rowData = [
    new Date(),
    fileName,
    `https://drive.google.com/file/d/${DriveApp.getFilesByName(fileName).next().getId()}/view`,
    ...Object.values(invoiceData)
  ];
  
  // Append the row to the sheet
  sheet.appendRow(rowData);
}

/**
 * Logs the processing result to the log sheet.
 * @param {string} fileName - The name of the processed file.
 * @param {string} status - The processing status (e.g., "Success" or "Error").
 * @param {string} [errorMessage] - The error message if processing failed.
 */
function logToSheet(fileName, status, errorMessage) {
  const config = loadConfig();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(config.logSheetName);
  
  // If the log sheet doesn't exist, create it and add headers
  if (!sheet) {
    sheet = ss.insertSheet(config.logSheetName);
    sheet.appendRow(['Timestamp', 'File Name', 'Status', 'Error Message']);
  }
  
  // Prepare the log entry
  const logEntry = [
    new Date(),  // Timestamp
    fileName,
    status,
    errorMessage || ''  // Use an empty string if no error message
  ];
  
  // Append the log entry to the sheet
  sheet.appendRow(logEntry);
}

/**
 * Updates both the results and log sheets with the processing results.
 * @param {Array<Object>} results - An array of processing results.
 * @param {Object} config - The configuration object.
 */
function updateSpreadsheet(results, config) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  updateResultsSheet(ss, results, config);
  updateLogSheet(ss, results, config);
}

/**
 * Updates the results sheet with the processing results.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - The active spreadsheet.
 * @param {Array<Object>} results - An array of processing results.
 * @param {Object} config - The configuration object.
 */
function updateResultsSheet(ss, results, config) {
  let sheet = ss.getSheetByName(config.resultSheetName);
  if (!sheet) {
    sheet = ss.insertSheet(config.resultSheetName);
    // Add headers only if it's a new sheet
    const headers = ['Date', 'File Name', 'Link', ...getAllKeys(results)];
    sheet.appendRow(headers);
  }
  
  // Find the last row with content
  const lastRow = sheet.getLastRow();
  
  // Add new data
  results.forEach(result => {
    if (result.success) {
      const row = [
        result.date,
        result.fileName,
        result.fileLink,
        ...getAllKeys(results).map(key => result.data[key] || '')
      ];
      sheet.appendRow(row);
    }
  });
}

/**
 * Updates the log sheet with the processing results.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - The active spreadsheet.
 * @param {Array<Object>} results - An array of processing results.
 * @param {Object} config - The configuration object.
 */
function updateLogSheet(ss, results, config) {
  let sheet = ss.getSheetByName(config.logSheetName);
  if (!sheet) {
    sheet = ss.insertSheet(config.logSheetName);
    sheet.appendRow(['Date', 'File Name', 'Status', 'Link']);
  }
  
  results.forEach(result => {
    sheet.appendRow([
      result.date,
      result.fileName,
      result.success ? 'Success' : 'Error',
      result.success ? result.fileLink : result.error
    ]);
  });
}

/**
 * Gets all unique keys from the results data.
 * @param {Array<Object>} results - An array of processing results.
 * @returns {Array<string>} An array of unique keys.
 */
function getAllKeys(results) {
  return results.reduce((keys, result) => {
    if (result.success) {
      Object.keys(result.data).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    }
    return keys;
  }, []);
}
