/**
 * Creates a custom menu when the spreadsheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Invoice Parser')
    .addItem('Parse Invoices', 'parseInvoices')
    .addItem('Parse Invoices (Test Mode)', 'parseInvoicesTestMode')
    .addToUi();
}

/**
 * Parses invoices in normal mode.
 */
function parseInvoices() {
  parseInvoicesInternal(false);
}

/**
 * Parses invoices in test mode.
 */
function parseInvoicesTestMode() {
  parseInvoicesInternal(true);
}

/**
 * Internal function to parse invoices with a specified test mode.
 * @param {boolean} testMode - Whether to run in test mode.
 */
function parseInvoicesInternal(testMode) {
  const config = loadConfig();
  config.testMode = testMode; // Override the config with the current test mode
  const schema = loadSchema(config.schemaFileId);
  const pdfFiles = getPDFFiles(config.sourceFolderId);
  
  const results = [];
  while (pdfFiles.hasNext()) {
    const file = pdfFiles.next();
    results.push(processInvoice(file, schema, config));
  }
  
  updateSpreadsheet(results, config);
}

/**
 * Processes a single invoice file.
 * @param {GoogleAppsScript.Drive.File} file - The invoice file to process.
 * @param {Object} schema - The JSON schema for data extraction.
 * @param {Object} config - The configuration object.
 * @returns {Object} The processing result.
 */
function processInvoice(file, schema, config) {
  try {
    const extractedData = extractDataWithGemini(file, schema);
    const parsedFile = moveFile(file, config.parsedFolderId, config.testMode);
    logToSheet(file.getName(), 'Success', config.testMode ? 'Test Mode' : '');
    return {
      success: true,
      date: new Date(),
      fileName: file.getName(),
      fileLink: parsedFile.getUrl(),
      data: extractedData,
      testMode: config.testMode
    };
  } catch (error) {
    console.error(`Error processing file ${file.getName()}: ${error}`);
    moveFile(file, config.errorFolderId, config.testMode);
    logToSheet(file.getName(), 'Error', config.testMode ? `Test Mode: ${error.toString()}` : error.toString());
    return {
      success: false,
      date: new Date(),
      fileName: file.getName(),
      error: error.toString(),
      testMode: config.testMode
    };
  }
}
