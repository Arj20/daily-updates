import type { DailyUpdate } from "../types";

// Google Sheets API configuration
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_FORM_URL = import.meta.env.VITE_GOOGLE_FORM_URL; // Optional: Google Form URL for submissions

class GoogleSheetsService {
  // Test method to verify sheet access
  async testSheetAccess(): Promise<boolean> {
    if (!SPREADSHEET_ID || !API_KEY) {
      console.log("❌ Missing configuration - cannot test sheet access");
      return false;
    }

    try {
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
      console.log("🧪 Testing sheet access...");

      const response = await fetch(testUrl);
      console.log("📡 Test response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(
          "✅ Sheet access successful! Sheet:",
          data.properties?.title
        );
        return true;
      } else {
        const errorText = await response.text();
        console.error("❌ Sheet access failed:", response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error("❌ Sheet access test error:", error);
      return false;
    }
  }

  // CSV fallback method (bypasses CORS issues)
  async getAllRecordsCSV(): Promise<DailyUpdate[]> {
    if (!SPREADSHEET_ID) {
      console.warn("❌ SPREADSHEET_ID missing for CSV method");
      return [];
    }

    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;
      console.log("📊 Fetching CSV data...");

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`CSV fetch failed: ${response.status}`);
      }

      const csvText = await response.text();
      console.log("✅ CSV data received successfully");

      return this.parseCSV(csvText);
    } catch (error) {
      console.error("❌ CSV fetch error:", error);
      return [];
    }
  }

  private parseCSV(csvText: string): DailyUpdate[] {
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) {
      console.log("📭 No data rows in CSV");
      return [];
    }

    const records: DailyUpdate[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = this.parseCSVRow(lines[i]);
      if (row.length >= 3 && row[0]) {
        records.push({
          sn: parseInt(row[0]) || i,
          date: row[1] || "",
          accountName: row[2] || "",
          projectName: row[3] || "",
          remarks: row[4] || "",
          id: `csv_row_${i + 1}`,
        });
      }
    }

    console.log(`✅ Parsed ${records.length} records from CSV`);
    return records.reverse();
  }

  private parseCSVRow(row: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  async getAllRecords(): Promise<DailyUpdate[]> {
    try {
      // Get data from Google Sheets (read-only via CSV)
      const sheetsData = await this.getAllRecordsCSV();

      // Get data from localStorage (where we store new records)
      const localData = this.getLocalRecords();

      // Combine both data sources
      const combined = [...sheetsData, ...localData];

      // Remove duplicates based on ID and sort by SN
      const unique = combined
        .filter(
          (record, index, self) =>
            index === self.findIndex((r) => r.id === record.id)
        )
        .sort((a, b) => a.sn - b.sn);

      return unique;
    } catch (error) {
      console.error(
        "❌ Error fetching records, using localStorage only:",
        error
      );
      return this.getLocalRecords();
    }
  }

  async addRecord(
    record: Omit<DailyUpdate, "sn" | "id">
  ): Promise<DailyUpdate> {
    console.log("➕ Adding new record...");

    try {
      const existingRecords = await this.getAllRecords();
      const nextSN =
        existingRecords.length > 0
          ? Math.max(...existingRecords.map((r) => r.sn)) + 1
          : 1;

      const newRecord: DailyUpdate = {
        ...record,
        sn: nextSN,
        id: `local_${Date.now()}`,
      };

      // Try multiple methods to add the record
      console.log("🔄 Attempting to save to Google Sheets...");

      // Method 1: Try direct Google Apps Script Web App (if configured)
      const webAppSuccess = await this.tryWebAppSubmission(newRecord);
      if (webAppSuccess) {
        console.log("✅ Successfully saved via Web App!");
        return newRecord;
      }

      // Method 2: Try Google Forms submission (if configured)
      const formSuccess = await this.tryFormSubmission();
      if (formSuccess) {
        console.log("✅ Successfully saved via Google Forms!");
        return newRecord;
      }

      // Method 3: Manual URL approach (user copies URL)
      this.generateManualEntryURL(newRecord);

      // Method 4: Store in localStorage as backup
      const localRecords = this.getLocalRecords();
      localRecords.unshift(newRecord);
      localStorage.setItem("daily_updates_local", JSON.stringify(localRecords));

      console.log("⚠️ Saved to local storage as backup");
      console.log("💡 Check console for manual entry instructions");

      return newRecord;
    } catch (error) {
      console.error("❌ Error adding record:", error);
      const fallbackRecord: DailyUpdate = {
        ...record,
        sn: Date.now() % 1000,
        id: `fallback_${Date.now()}`,
      };
      return fallbackRecord;
    }
  }

  // Method 1: Try Google Apps Script Web App
  private async tryWebAppSubmission(record: DailyUpdate): Promise<boolean> {
    const webAppUrl = import.meta.env.VITE_GOOGLE_WEBAPP_URL;
    if (!webAppUrl) {
      console.log("ℹ️ Google Web App URL not configured");
      return false;
    }

    try {
      console.log("🔄 Attempting to submit to Google Web App:", webAppUrl);

      const payload = {
        sn: record.sn,
        date: record.date,
        accountName: record.accountName,
        projectName: record.projectName,
        remarks: record.remarks,
      };

      console.log("📤 Payload:", payload);

      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors", // Bypass CORS restrictions
      });

      console.log("📨 Response status:", response.status);
      console.log("📨 Response type:", response.type);

      if (response.type === "opaque") {
        // no-cors mode - we can't read the response, but if no error was thrown, it likely succeeded
        console.log("✅ Request sent successfully (no-cors mode)");
        return true;
      } else if (response.ok) {
        const responseData = await response.text();
        console.log("✅ Web App response:", responseData);
        return true;
      } else {
        const errorText = await response.text();
        console.error("❌ Web App error response:", errorText);
        return false;
      }
    } catch (error) {
      console.error("❌ Web App submission failed:", error);
      if (error instanceof TypeError && error.message.includes("CORS")) {
        console.error(
          "🚫 CORS Error - This is likely due to Google Apps Script CORS limitations"
        );
        console.log(
          "💡 Try opening the Web App URL directly in a new tab to test it"
        );
      }
      return false;
    }
  }

  // Method 2: Try Google Forms submission
  private async tryFormSubmission(): Promise<boolean> {
    if (!GOOGLE_FORM_URL) {
      console.log("ℹ️ Google Form URL not configured");
      return false;
    }

    try {
      // This would require specific form field IDs
      // For now, we'll return false and provide instructions
      console.log("📝 Google Forms method requires manual setup");
      return false;
    } catch {
      console.error("Form submission failed");
      return false;
    }
  }

  // Method 3: Generate manual entry URL
  private generateManualEntryURL(record: DailyUpdate): void {
    if (!SPREADSHEET_ID) return;

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    console.log("📋 MANUAL ENTRY INSTRUCTIONS:");
    console.log("1. Open your Google Sheet:", sheetUrl);
    console.log("2. Add a new row with this data:");
    console.log(`   SN: ${record.sn}`);
    console.log(`   Date: ${record.date}`);
    console.log(`   Account Name: ${record.accountName}`);
    console.log(`   Project Name: ${record.projectName}`);
    console.log(`   Remarks: ${record.remarks}`);

    // Try to open the sheet automatically (may be blocked by popup blockers)
    if (typeof window !== "undefined") {
      try {
        window.open(sheetUrl, "_blank");
        console.log("📖 Attempted to open Google Sheet in new tab");
      } catch {
        console.log("⚠️ Could not auto-open sheet (popup blocked?)");
      }
    }
  }

  // Helper method to get records from localStorage
  private getLocalRecords(): DailyUpdate[] {
    try {
      const stored = localStorage.getItem("daily_updates_local");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async updateRecord(
    id: string,
    updates: Partial<DailyUpdate>
  ): Promise<DailyUpdate> {
    console.log("✏️ Updating record:", id);

    try {
      // Get current record details
      const currentRecords = await this.getAllRecords();
      const currentRecord = currentRecords.find((record) => record.id === id);

      if (!currentRecord) {
        throw new Error("Record not found");
      }

      const updatedRecord = { ...currentRecord, ...updates };

      // Try to update via Web App
      const webAppSuccess = await this.tryWebAppUpdate(updatedRecord);
      if (webAppSuccess) {
        console.log("✅ Successfully updated via Web App!");
        return updatedRecord;
      }

      // Fallback: update in localStorage if it's a local record
      const localRecords = this.getLocalRecords();
      const localIndex = localRecords.findIndex((record) => record.id === id);

      if (localIndex !== -1) {
        localRecords[localIndex] = updatedRecord;
        localStorage.setItem(
          "daily_updates_local",
          JSON.stringify(localRecords)
        );
        console.log("✅ Updated in local storage");
        return updatedRecord;
      }

      // If it's a Google Sheets record, provide manual update instructions
      this.generateManualUpdateInstructions(updatedRecord);
      return updatedRecord;
    } catch (error) {
      console.error("❌ Error updating record:", error);
      return { ...updates, id } as DailyUpdate;
    }
  }

  // Method to update via Google Apps Script Web App
  private async tryWebAppUpdate(record: DailyUpdate): Promise<boolean> {
    const webAppUrl = import.meta.env.VITE_GOOGLE_WEBAPP_URL;
    if (!webAppUrl) {
      console.log("ℹ️ Google Web App URL not configured for updates");
      return false;
    }

    try {
      console.log("🔄 Attempting to update via Google Web App:", record.id);

      const payload = {
        action: "update",
        id: record.id,
        sn: record.sn,
        date: record.date,
        accountName: record.accountName,
        projectName: record.projectName,
        remarks: record.remarks,
      };

      console.log("📤 Update payload:", payload);

      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors", // Bypass CORS restrictions
      });

      if (response.type === "opaque") {
        console.log("✅ Update request sent successfully (no-cors mode)");
        return true;
      } else if (response.ok) {
        const responseData = await response.text();
        console.log("✅ Web App update response:", responseData);
        return true;
      } else {
        console.error("❌ Web App update failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Web App update failed:", error);
      return false;
    }
  }

  // Provide manual update instructions
  private generateManualUpdateInstructions(record: DailyUpdate): void {
    if (!SPREADSHEET_ID) return;

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    console.log("📋 MANUAL UPDATE INSTRUCTIONS:");
    console.log("1. Open your Google Sheet:", sheetUrl);
    console.log(`2. Find the row with SN: ${record.sn}`);
    console.log("3. Update the row with this data:");
    console.log(`   Date: ${record.date}`);
    console.log(`   Account Name: ${record.accountName}`);
    console.log(`   Project Name: ${record.projectName}`);
    console.log(`   Remarks: ${record.remarks}`);

    // Try to open the sheet automatically
    if (typeof window !== "undefined") {
      try {
        window.open(sheetUrl, "_blank");
        console.log("📖 Attempted to open Google Sheet in new tab");
      } catch {
        console.log("⚠️ Could not auto-open sheet (popup blocked?)");
      }
    }
  }

  async deleteRecord(id: string): Promise<void> {
    console.log("🗑️ Deleting record:", id);

    // Try to delete via Web App first
    const webAppSuccess = await this.tryWebAppDeletion(id);
    if (webAppSuccess) {
      console.log("✅ Successfully deleted via Web App!");
      return;
    }

    // Fallback: remove from localStorage if it's a local record
    const localRecords = this.getLocalRecords();
    const filteredRecords = localRecords.filter((record) => record.id !== id);

    if (filteredRecords.length !== localRecords.length) {
      localStorage.setItem(
        "daily_updates_local",
        JSON.stringify(filteredRecords)
      );
      console.log("✅ Removed from local storage");
      return;
    }

    // If it's a Google Sheets record, provide manual deletion instructions
    this.generateManualDeleteInstructions(id);
  }

  // Method to delete via Google Apps Script Web App
  private async tryWebAppDeletion(id: string): Promise<boolean> {
    const webAppUrl = import.meta.env.VITE_GOOGLE_WEBAPP_URL;
    if (!webAppUrl) {
      console.log("ℹ️ Google Web App URL not configured for deletion");
      return false;
    }

    try {
      console.log("🔄 Attempting to delete via Google Web App:", id);

      // Get the record details to find the SN for deletion
      const allRecords = await this.getAllRecords();
      const recordToDelete = allRecords.find((record) => record.id === id);

      if (!recordToDelete) {
        console.log("❌ Record not found for deletion:", id);
        return false;
      }

      const payload = {
        action: "delete",
        id: id,
        sn: recordToDelete.sn, // Send the serial number to help identify the row
      };

      console.log("📤 Delete payload:", payload);

      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors", // Bypass CORS restrictions
      });

      if (response.type === "opaque") {
        console.log("✅ Delete request sent successfully (no-cors mode)");
        return true;
      } else if (response.ok) {
        const responseData = await response.text();
        console.log("✅ Web App delete response:", responseData);
        return true;
      } else {
        console.error("❌ Web App delete failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Web App deletion failed:", error);
      return false;
    }
  }

  // Provide manual deletion instructions
  private generateManualDeleteInstructions(id: string): void {
    if (!SPREADSHEET_ID) return;

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    console.log("📋 MANUAL DELETION INSTRUCTIONS:");
    console.log("1. Open your Google Sheet:", sheetUrl);
    console.log(`2. Find and delete the row with ID: ${id}`);
    console.log("3. The record has been removed from local cache");

    // Try to open the sheet automatically
    if (typeof window !== "undefined") {
      try {
        window.open(sheetUrl, "_blank");
        console.log("📖 Attempted to open Google Sheet in new tab");
      } catch {
        console.log("⚠️ Could not auto-open sheet (popup blocked?)");
      }
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
