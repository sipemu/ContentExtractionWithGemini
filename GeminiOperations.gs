/**
 * Extracts data from a file using Gemini API based on the provided schema.
 * @param {GoogleAppsScript.Drive.File} file - The file to extract data from.
 * @param {Object} schema - The JSON schema defining the structure of the data to extract.
 * @returns {Object} The extracted data in JSON format.
 */
function extractDataWithGemini(file, schema) {
  const fileId = file.getId();
  return extractPdfData(fileId, schema);
}

/**
 * Extracts data from a PDF file using Gemini API based on the provided JSON schema.
 * @param {string} fileId - The ID of the PDF file in Google Drive.
 * @param {Object} jsonSchema - The JSON schema defining the structure of the data to extract.
 * @returns {Object} The extracted data in JSON format.
 */
function extractPdfData(fileId, jsonSchema) {
  // Get the base64-encoded PDF data
  const pdfData = getPdfDataAsBase64(fileId);

  // Construct the API request body
  const requestBody = {
    "model": "gemini-pro",
    "prompt": {
      "text": `
        <Instructions>
        Extract the data from this PDF according to the provided JSON schema. 
        The PDF might contain images with text data. If so, extract the text from those images as well. 
        The extracted data should be in JSON format with the following structure: 
        ${JSON.stringify(jsonSchema, null, 2)} 
        </Instructions>`
    },
    "document": {
      "type": "inline_data",
      "content": pdfData,
      "mimeType": "application/pdf"
    },
    "parameters": {
      "schema": jsonSchema
    }
  };

  // Call the Gemini API
  const response = GenerativeLanguage.Documents.generateContent(requestBody);

  // Parse the API response and return the extracted data
  return JSON.parse(response.result);
}

/**
 * Converts a PDF file to base64-encoded string.
 * @param {string} fileId - The ID of the PDF file in Google Drive.
 * @returns {string} The base64-encoded content of the PDF file.
 */
function getPdfDataAsBase64(fileId) {
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  return Utilities.base64Encode(blob.getBytes());
}

/**
 * Converts a PDF file to text using OCR.
 * @param {string} fileId - The ID of the PDF file in Google Drive.
 * @returns {string} The extracted text content from the PDF.
 */
function convertPDFToText(fileId) {
    const pdfDocument = DriveApp.getFileById(fileId);

    // Use OCR to convert PDF to a temporary Google Document
    // Restrict the response to include file Id and Title fields only
    const { id, name } = Drive.Files.create(
      {
        name: pdfDocument.getName().replace(/\.pdf$/, ''),
        mimeType: MimeType.GOOGLE_DOCS,
      },
      pdfDocument.getBlob(),
      {
        ocrLanguage: language,
        fields: 'id,name',
      }
    );

    // Use the Document API to extract text from the Google Document
    const textContent = DocumentApp.openById(id).getBody().getText();

    // Delete the temporary Google Document since it is no longer needed
    DriveApp.getFileById(id).setTrashed(true);

    return textContent;
}
