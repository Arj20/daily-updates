# 🔧 How to Enable Google Sheets Write Access

Your Daily Updates app is currently working with localStorage as a backup. To get actual Google Sheets write functionality, follow this guide.

## ❗ The Core Issue

**Google Sheets API requires OAuth2 for write operations.** API keys can only read data, not write. This is a Google security requirement.

## ✅ Quick Solution: Google Apps Script Web App

### Step 1: Create the Web App

1. **Open**: https://script.google.com/
2. **New Project**: Click "New project"
3. **Paste Code**: Replace default code with the contents of `google-apps-script/Code.gs`
4. **Update ID**: Change `SPREADSHEET_ID` to your sheet ID: `1Gy32FSTOSicv34LC7z6PIpq2lCUmM3WADMWjyLBk5NY`
5. **Save**: Name it "Daily Updates Web App"

### Step 2: Deploy

1. **Deploy** → "New deployment"
2. **Type**: Web app
3. **Execute as**: Me
4. **Access**: Anyone (for testing)
5. **Deploy** and copy the URL

### Step 3: Configure

1. **Add to .env**:
   ```
   VITE_GOOGLE_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
2. **Restart** your dev server

### Step 4: Test

Add a new update in your app - it should now save to Google Sheets!

## 🔍 How to Verify It's Working

1. **Console Messages**: Look for "✅ Successfully saved via Web App!"
2. **Google Sheet**: Check your sheet for new rows
3. **No More Local Storage**: Data should go directly to sheets

## 💡 Current App Behavior

Your app tries these methods in order:

1. ✨ **Google Apps Script** (if configured)
2. 📝 **Google Forms** (if configured)
3. 📋 **Manual entry** (opens sheet)
4. 💾 **localStorage** (always works)

## 🆘 Still Not Working?

- Check the browser console for error messages
- Make sure the Apps Script is deployed as "Anyone" access
- Verify your spreadsheet ID is correct
- Try visiting the web app URL directly to test it

Once set up, your app will automatically detect and use the web app for all future updates!
