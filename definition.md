Task
- I want to create a Apps Script for Google Sheets that will use the Gemini API.
- The script shall scan a Google Drive folder for PDFs. 
- The script shall use the Gemini API to process the PDFs.
- The PDFs are invoices and I want to extract the data from them. The data is invoice data.
- The information to be extracted is defined in a JSON schema. 
- The JSON schema shall be stored in a JSON file in Google Drive.
- The parsed data shall be stored in a new tab in the Google Sheet. 
- As different customers have different invoice formats, the script shall be configurable using a JSON schema.
- The JSON schema shall be stored in a JSON file in Google Drive.
- The parsed PDF shall be stored in a separate Google Drive folder. 
- PDF files where parsing was not successful shall be stored in a separate folder.
- In a separete tab of the Google Sheets should be stored the date of the parsed file, the name of the parsed file, and a link to the parsed PDF file of the new directory.
