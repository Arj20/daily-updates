/**
 * Google Apps Script Web App for Daily Updates
 *
 * This script creates a web app that can receive POST requests from your React app
 * and write data directly to your Google Sheet.
 *
 * Setup Instructions:
 * 1. Open https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Replace SPREADSHEET_ID with your actual spreadsheet ID
 * 5. Save the project with a name like "Daily Updates Web App"
 * 6. Deploy as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Choose "Web app" as type
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone" (or "Anyone with Google account" for security)
 *    - Click "Deploy"
 * 7. Copy the web app URL and add it to your .env file as VITE_GOOGLE_WEBAPP_URL
 */

// Replace this with your actual Google Sheets ID
const SPREADSHEET_ID = "1Gy32FSTOSicv34LC7z6PIpq2lCUmM3WADMWjyLBk5NY";

function doPost(e) {
  // Add CORS headers immediately
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "3600",
  };

  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the spreadsheet and the first sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    // Handle different actions
    if (data.action === "delete") {
      // Handle delete operation
      return handleDelete(sheet, data, headers);
    } else if (data.action === "update") {
      // Handle update operation
      return handleUpdate(sheet, data, headers);
    } else {
      // Handle add operation (default)
      return handleAdd(sheet, data, headers);
    }
  } catch (error) {
    // Return error response with CORS headers
    const output = ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);

    // Set all headers
    Object.keys(headers).forEach((key) => {
      output.setHeaders({ [key]: headers[key] });
    });

    return output;
  }
}

function handleAdd(sheet, data, headers) {
  // Prepare the row data
  const rowData = [
    data.sn || "",
    data.date || new Date().toISOString(),
    data.accountName || "",
    data.projectName || "",
    data.remarks || "",
  ];

  // Append the row to the sheet
  sheet.appendRow(rowData);

  // Return success response with CORS headers
  const output = ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Record added successfully",
      data: data,
    })
  ).setMimeType(ContentService.MimeType.JSON);

  // Set all headers
  Object.keys(headers).forEach((key) => {
    output.setHeaders({ [key]: headers[key] });
  });

  return output;
}

function handleDelete(sheet, data, headers) {
  try {
    // Extract row number from ID if it's in the format csv_row_X
    let rowToDelete = null;

    if (data.id && data.id.includes("csv_row_")) {
      const rowMatch = data.id.match(/csv_row_(\d+)/);
      if (rowMatch) {
        rowToDelete = parseInt(rowMatch[1]);
      }
    }

    // If we have a specific row number, delete that row
    if (rowToDelete && rowToDelete > 1) {
      // Don't delete header row
      sheet.deleteRow(rowToDelete);

      const output = ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: `Record at row ${rowToDelete} deleted successfully`,
          deletedId: data.id,
        })
      ).setMimeType(ContentService.MimeType.JSON);

      Object.keys(headers).forEach((key) => {
        output.setHeaders({ [key]: headers[key] });
      });

      return output;
    } else {
      // If no specific row, try to find by matching data
      const allData = sheet.getDataRange().getValues();
      let deletedRowIndex = -1;

      // Search for matching record (skip header row)
      for (let i = 1; i < allData.length; i++) {
        const row = allData[i];
        if (data.sn && row[0] === data.sn) {
          sheet.deleteRow(i + 1); // +1 because sheets are 1-indexed
          deletedRowIndex = i + 1;
          break;
        }
      }

      const output = ContentService.createTextOutput(
        JSON.stringify({
          success: deletedRowIndex > 0,
          message:
            deletedRowIndex > 0
              ? `Record with SN ${data.sn} deleted successfully`
              : `Record with SN ${data.sn} not found`,
          deletedId: data.id,
          deletedRow: deletedRowIndex,
        })
      ).setMimeType(ContentService.MimeType.JSON);

      Object.keys(headers).forEach((key) => {
        output.setHeaders({ [key]: headers[key] });
      });

      return output;
    }
  } catch (error) {
    const output = ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Delete error: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);

    Object.keys(headers).forEach((key) => {
      output.setHeaders({ [key]: headers[key] });
    });

    return output;
  }
}

function handleUpdate(sheet, data, headers) {
  try {
    // Find the row to update by SN
    const allData = sheet.getDataRange().getValues();
    let updateRowIndex = -1;

    // Search for matching record by SN (skip header row)
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      if (data.sn && row[0] === data.sn) {
        updateRowIndex = i + 1; // +1 because sheets are 1-indexed
        break;
      }
    }

    if (updateRowIndex > 0) {
      // Update the row with new data
      const rowData = [
        data.sn || "",
        data.date || new Date().toISOString(),
        data.accountName || "",
        data.projectName || "",
        data.remarks || "",
      ];

      // Set the range for the specific row
      const range = sheet.getRange(updateRowIndex, 1, 1, 5);
      range.setValues([rowData]);

      const output = ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: `Record with SN ${data.sn} updated successfully`,
          updatedId: data.id,
          updatedRow: updateRowIndex,
        })
      ).setMimeType(ContentService.MimeType.JSON);

      Object.keys(headers).forEach((key) => {
        output.setHeaders({ [key]: headers[key] });
      });

      return output;
    } else {
      const output = ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: `Record with SN ${data.sn} not found for update`,
          updatedId: data.id,
        })
      ).setMimeType(ContentService.MimeType.JSON);

      Object.keys(headers).forEach((key) => {
        output.setHeaders({ [key]: headers[key] });
      });

      return output;
    }
  } catch (error) {
    const output = ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Update error: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);

    Object.keys(headers).forEach((key) => {
      output.setHeaders({ [key]: headers[key] });
    });

    return output;
  }
}

function doGet(e) {
  // Handle GET requests (for testing) with CORS headers
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "Daily Updates Web App is running",
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
    })
  )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput("").setHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "3600",
  });
}

// Test function to verify the script works
function testAddRecord() {
  const testData = {
    sn: 999,
    date: "2024-01-01",
    accountName: "Test Account",
    projectName: "Test Project",
    remarks: "Test entry from Apps Script",
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockEvent);
  console.log(result.getContent());
}
