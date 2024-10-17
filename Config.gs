/**
 * Loads the configuration from Apps Script Properties.
 * @returns {Object} An object containing the configuration settings.
 */
function loadConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  return {
    sourceFolderId: scriptProperties.getProperty('SOURCE_FOLDER_ID'),
    parsedFolderId: scriptProperties.getProperty('PARSED_FOLDER_ID'),
    errorFolderId: scriptProperties.getProperty('ERROR_FOLDER_ID'),
    schemaFileId: scriptProperties.getProperty('SCHEMA_FILE_ID'),
    resultSheetName: scriptProperties.getProperty('RESULT_SHEET_NAME') || 'Parsed Invoices',
    logSheetName: scriptProperties.getProperty('LOG_SHEET_NAME') || 'Parse Log',
    geminiApiKey: scriptProperties.getProperty('GEMINI_API_KEY'),
    testMode: scriptProperties.getProperty('TEST_MODE') === 'true' // New test mode option
  };
}

/**
 * Sets a configuration value in Apps Script Properties.
 * @param {string} key - The key of the configuration setting.
 * @param {string} value - The value to set for the configuration setting.
 */
function setConfig(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

/**
 * Sets the test mode configuration.
 * @param {boolean} isTestMode - Whether to enable test mode.
 */
function setTestMode(isTestMode) {
  setConfig('TEST_MODE', isTestMode.toString());
}
