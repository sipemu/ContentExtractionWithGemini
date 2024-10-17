# Invoice Parser with Gemini AI

This project is a Google Apps Script application that uses the Gemini AI API to parse PDF invoices and extract structured data. It processes PDF files from a specified Google Drive folder, extracts information using the Gemini AI model, and logs the results in a Google Spreadsheet.

## Setup Instructions

### 1. Google Workspace Setup

1. Create a new Google Spreadsheet to host the script.
2. Create three folders in Google Drive:
   - Source folder (for incoming PDF invoices). You may have a look at the project [AutomateGmailAttachment](https://github.com/sipemu/AutomateGmailAttachment) on Github to automatically move the PDFs to the source folder.
   - Parsed folder (for successfully processed invoices)
   - Error folder (for invoices that failed to process)

### 2. Enable the Gemini API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "Library".
4. Search for "Gemini API" and enable it for your project.
5. Go to "APIs & Services" > "Credentials".
6. Create an API Key and note it down for later use.

### 3. Google Apps Script Setup

Alternatively, you can use the [clasp](https://github.com/google/clasp) CLI to push the code to Google Apps Script. See below for the steps.

1. In your Google Spreadsheet, go to Extensions > Apps Script.
2. Delete any existing code in the script editor.
3. Create new script files for each of the following:
   - `Code.gs`
   - `Config.gs`
   - `DriveOperations.gs`
   - `GeminiOperations.gs`
   - `SpreadsheetOperations.gs`
4. Copy the contents of each corresponding `.gs` file from this repository into the newly created script files.

### 4. Set up Script Properties

1. In the Apps Script editor, go to Project Settings (gear icon).
2. Under "Script Properties", add the following properties:
   - `SOURCE_FOLDER_ID`: ID of the source folder
   - `PARSED_FOLDER_ID`: ID of the parsed folder
   - `ERROR_FOLDER_ID`: ID of the error folder
   - `SCHEMA_FILE_ID`: ID of the JSON schema file
   - `RESULT_SHEET_NAME`: Name for the results sheet (e.g., "Parsed Invoices")
   - `LOG_SHEET_NAME`: Name for the log sheet (e.g., "Parse Log")
   - `GEMINI_API_KEY`: Your Gemini API key

### 5. Deploy with clasp

1. Install clasp globally:
   ```
   npm install -g @google/clasp
   ```
2. Login to clasp:
   ```
   clasp login
   ```
3. Clone this repository and navigate to the project folder.
4. Create a `.clasp.json` file in the project root with the following content:
   ```json
   {
     "scriptId": "your_script_id_here",
     "rootDir": "."
   }
   ```
   Replace `your_script_id_here` with the Script ID from your Apps Script project.
5. Push the code to Google Apps Script:
   ```
   clasp push
   ```

## Usage

### By Hand

1. Open the Google Spreadsheet containing the script.
2. You should see a new menu item "Invoice Parser".
3. Click on "Invoice Parser" > "Parse Invoices" to run the parser in normal mode.
4. To test without moving files, use "Invoice Parser" > "Parse Invoices (Test Mode)".

### By Cron Job

1. Open the Google Spreadsheet containing the script.
2. You should see a new menu item "Invoice Parser".
3. Click on "Invoice Parser" > "Parse Invoices (Cron Mode)".

## Customization

- Modify the `invoice_schema.json` file to match your specific invoice structure.
- Adjust the Gemini API prompt in `GeminiOperations.gs` if needed.

## Troubleshooting

- If you encounter errors, check the Apps Script execution log for details.
- Ensure all required APIs are enabled in your Google Cloud project.
- Verify that all script properties are correctly set.

## Contributing

Contributions to improve the project are welcome. Please follow the standard fork-and-pull request workflow.

## License

[MIT License](LICENSE)
