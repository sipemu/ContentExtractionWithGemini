/**
 * Retrieves all PDF files from the source folder.
 * @param {string} sourceFolderId - The ID of the source folder.
 * @returns {GoogleAppsScript.Drive.FileIterator} An iterator of PDF files.
 */
function getPDFFiles(sourceFolderId) {
  const sourceFolder = DriveApp.getFolderById(sourceFolderId);
  const pdfFiles = sourceFolder.getFilesByType(MimeType.PDF);
  return pdfFiles;
}

/**
 * Moves a file to the specified destination folder, or simulates the move in test mode.
 * @param {GoogleAppsScript.Drive.File} file - The file to move.
 * @param {string} destinationFolderId - The ID of the destination folder.
 * @param {boolean} testMode - Whether the function is running in test mode.
 * @returns {GoogleAppsScript.Drive.File} The moved file or the original file in test mode.
 */
function moveFile(file, destinationFolderId, testMode) {
  if (testMode) {
    console.log(`Test Mode: Simulating move of file ${file.getName()} to folder ${destinationFolderId}`);
    return file; // Return the original file without moving it
  }

  try {
    // Get the destination folder
    const destinationFolder = DriveApp.getFolderById(destinationFolderId);
    
    // Get the file's current parents
    const parents = file.getParents();
    
    // Add the file to the new folder
    destinationFolder.addFile(file);
    
    // Remove the file from its original folder(s)
    while (parents.hasNext()) {
      const parent = parents.next();
      parent.removeFile(file);
    }
    
    // Return the moved file
    return file;
  } catch (error) {
    console.error(`Error moving file ${file.getName()} to folder ${destinationFolderId}: ${error}`);
    throw error; // Re-throw the error so it can be caught and handled by the calling function
  }
}

/**
 * Loads the JSON schema from a file in Google Drive.
 * @param {string} fileId - The ID of the schema file in Google Drive.
 * @returns {Object} The parsed JSON schema.
 */
function loadSchema(fileId) {
  const file = DriveApp.getFileById(fileId);
  const content = file.getBlob().getDataAsString();
  return JSON.parse(content);
}
