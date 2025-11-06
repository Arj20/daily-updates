# 📊 Google Sheets API Setup Guide

This guide will walk you through setting up Google Sheets as a database for your Daily Updates app.

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**

   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a new project**
   - Click on the project selector dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name: "Daily Updates App"
   - Click "CREATE"

## Step 2: Enable Google Sheets API

1. **Navigate to APIs & Services**

   - In the left sidebar, click "APIs & Services" > "Library"

2. **Enable Google Sheets API**
   - Search for "Google Sheets API"
   - Click on "Google Sheets API" from results
   - Click "ENABLE"

## Step 3: Create API Key

1. **Go to Credentials**

   - Click "APIs & Services" > "Credentials"

2. **Create API Key**

   - Click "CREATE CREDENTIALS" > "API key"
   - Copy the generated API key
   - Click "CLOSE"

3. **Restrict the API Key (Recommended)**
   - Click on the created API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Save

## Step 4: Create Your Google Sheet

1. **Create a new Google Sheet**

   - Go to [sheets.google.com](https://sheets.google.com/)
   - Click "+" to create a new sheet
   - Name it "Daily Updates"

2. **Set up the headers**

   - In row 1, add these headers:
     ```
     A1: SN
     B1: Date
     C1: Account Name
     D1: Project Name
     E1: Remarks
     ```

3. **Make the sheet public**

   - Click "Share" button
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

4. **Get the Sheet ID**
   - Copy the URL of your sheet
   - Extract the Sheet ID from the URL:
     ```
     https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0
     ```

## Step 5: Configure Your App

1. **Copy environment template**

   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   ```env
   VITE_GOOGLE_SHEETS_ID=your_sheet_id_here
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

## Step 6: Test the Integration

1. **Start your app**

   ```bash
   npm run dev
   ```

2. **Add a test update**
   - Fill in the form
   - Submit
   - Check your Google Sheet to see if data appears

## Advanced Configuration

### OAuth2 Setup (For Write Operations)

For full CRUD operations, you'll need OAuth2:

1. **Create OAuth2 Credentials**

   - In Google Cloud Console > Credentials
   - Click "CREATE CREDENTIALS" > "OAuth client ID"
   - Choose "Web application"
   - Add your domain to authorized origins

2. **Update the service**
   - Modify `src/services/googleSheets.ts`
   - Implement OAuth2 flow for write operations

### Sheet Permissions

For better security:

- Create a service account
- Share the sheet with the service account email
- Use service account credentials instead of API key

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error**

   - Check if the sheet is public
   - Verify API key is correct
   - Ensure Google Sheets API is enabled

2. **CORS Errors**

   - This is normal for direct browser requests
   - Consider using a backend proxy for production

3. **Rate Limiting**
   - Google Sheets API has quotas
   - Implement rate limiting in your app

### Error Messages:

- `"The caller does not have permission"` → Sheet is not public
- `"API key not valid"` → Check your API key
- `"Quota exceeded"` → You've hit API limits

## Production Considerations

1. **Security**

   - Use environment variables
   - Implement proper authentication
   - Consider using a backend service

2. **Performance**

   - Cache frequently accessed data
   - Implement pagination for large datasets
   - Use batch operations when possible

3. **Reliability**
   - Add error handling and retries
   - Implement offline functionality
   - Consider data backup strategies

## Alternative Solutions

If Google Sheets API is too complex:

1. **Google Forms**

   - Create a Google Form
   - Link to your sheet
   - Use form submission for writes

2. **Third-party Services**

   - Airtable API
   - Notion API
   - Supabase
   - Firebase

3. **Local Storage**
   - Use browser localStorage
   - Good for prototyping
   - Data stays on device

---

## Next Steps

Once you have Google Sheets working:

1. Test all CRUD operations
2. Add data validation
3. Implement better error handling
4. Add loading states
5. Consider adding export/import features

Happy coding! 💖
