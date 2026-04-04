// Google Apps Script — Newsletter Subscriber Collector
// Connects to: https://docs.google.com/spreadsheets/d/1pNrVOWkSNHEgHXtjikARdWtOjdell1vjeN0N80Y-Bqg
//
// DEPLOYMENT INSTRUCTIONS:
// 1. Open the Google Sheet linked above
// 2. Click Extensions → Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Save (floppy disk icon)
// 5. Click Deploy → New Deployment
// 6. Type: Web app
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Click Deploy → copy the Web App URL
// 10. In js/main.js, replace the NEWSLETTER_ENDPOINT value with that URL

var SHEET_ID = '1pNrVOWkSNHEgHXtjikARdWtOjdell1vjeN0N80Y-Bqg';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email || '';
    var timestamp = data.timestamp || new Date().toISOString();

    if (!email) {
      return jsonResponse({ result: 'error', message: 'No email provided' });
    }

    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Email']);
    }

    sheet.appendRow([timestamp, email]);

    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.toString() });
  }
}

function doGet(e) {
  return jsonResponse({ result: 'ok', message: 'Newsletter endpoint is live.' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
