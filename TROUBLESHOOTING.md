# 🔧 Troubleshooting Google Sheets API

## Quick Checks

### 1. Check Browser Console

Open the browser console (F12) and look for these debug messages:

```
Environment Variables Debug:
SPREADSHEET_ID: Set
API_KEY: Set
```

If you see "Not set", your environment variables aren't loading.

### 2. Test Button

Click the test button (checkmark icon) in the header to test Google Sheets connectivity.

## Common Issues & Solutions

### Issue 1: Environment Variables Not Loading

**Symptoms**: Console shows "SPREADSHEET_ID: Not set" or "API_KEY: Not set"

**Solutions**:

1. Make sure `.env` file is in the project root
2. Restart the development server (`npm run dev`)
3. Check `.env` file format:
   ```
   VITE_GOOGLE_SHEETS_ID=your_sheet_id
   VITE_GOOGLE_API_KEY=your_api_key
   ```

### Issue 2: CORS Errors

**Symptoms**: Console shows "Failed to fetch" or CORS-related errors

**Solutions**:

1. Try the CSV export method (see Alternative Method below)
2. Use a backend proxy
3. Enable CORS in Google Cloud Console (not always possible)

### Issue 3: 403 Forbidden

**Symptoms**: "The caller does not have permission"

**Solutions**:

1. Make sure your Google Sheet is public:
   - Click "Share" in Google Sheets
   - Change to "Anyone with the link can view"
2. Check if your API key is restricted to wrong domains
3. Verify Google Sheets API is enabled for your API key

### Issue 4: 400 Bad Request

**Symptoms**: "Unable to parse range" or "Invalid range"

**Solutions**:

1. Check if your sheet name is "Sheet1" (default)
2. Make sure the sheet has the correct headers in row 1:
   ```
   A1: SN | B1: Date | C1: Account Name | D1: Project Name | E1: Remarks
   ```

## Alternative Method: CSV Export

If the API doesn't work due to CORS, you can use Google Sheets' CSV export feature:

1. **Make your sheet public**
2. **Use the CSV export URL** (automatically bypasses CORS):

   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
   ```

3. **Update the service** to use CSV parsing instead of JSON API

## Testing Steps

1. **Test Sheet Access**:
   Visit this URL in your browser (replace SHEET_ID and API_KEY):

   ```
   https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID?key=API_KEY
   ```

2. **Test Data Reading**:
   Visit this URL to see if you can read data:

   ```
   https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/Sheet1!A:E?key=API_KEY
   ```

3. **Check Sheet Format**:
   Make sure your Google Sheet looks like this:
   ```
   | SN | Date | Account Name | Project Name | Remarks |
   | 1  | ... | ...          | ...          | ...     |
   ```

## Debug Console Commands

Open browser console and run these commands:

```javascript
// Check environment variables
console.log("SPREADSHEET_ID:", import.meta.env.VITE_GOOGLE_SHEETS_ID);
console.log("API_KEY:", import.meta.env.VITE_GOOGLE_API_KEY);

// Test direct API call
fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${
    import.meta.env.VITE_GOOGLE_SHEETS_ID
  }?key=${import.meta.env.VITE_GOOGLE_API_KEY}`
)
  .then((response) => console.log("Response:", response))
  .catch((error) => console.error("Error:", error));
```

## Need Help?

1. Check the console for detailed error messages
2. Verify all setup steps in `GOOGLE_SHEETS_SETUP.md`
3. Try the CSV export method as a fallback
4. Consider using a backend service for production

## Working Configuration Example

This is what a working setup looks like:

**.env file**:

```
VITE_GOOGLE_SHEETS_ID=1Gy32FSTOSicv34LC7z6PIpq2lCUmM3WADMWjyLBk5NY
VITE_GOOGLE_API_KEY=AIzaSyAHnVtA9OKq-BlNjayFj1V338Nj2-o2p2A
```

**Google Sheet** (public, with headers in row 1):

```
| SN | Date | Account Name | Project Name | Remarks |
```

**Console output** (successful):

```
Environment Variables Debug:
SPREADSHEET_ID: Set
API_KEY: Set
Testing sheet access...
Response status: 200
Sheet info: Daily Updates
Making request to: https://sheets.googleapis.com/v4/spreadsheets/...
Response status: 200
Successfully loaded X records from Google Sheets
```
