import React from "react";
import { FiSun, FiMoon, FiGrid, FiList, FiCheckCircle } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";
import { googleSheetsService } from "../services/googleSheets";
import type { ViewMode } from "../types";

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const testGoogleSheets = async () => {
    console.log("Testing Google Sheets connection...");
    const canAccess = await googleSheetsService.testSheetAccess();
    if (canAccess) {
      alert("✅ Google Sheets connection successful!");
    } else {
      alert("❌ Google Sheets connection failed. Check console for details.");
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">✨ Daily Updates</h1>

        <div className="header-controls">
          <div className="view-toggle">
            <button
              className={`view-button ${
                viewMode.type === "cards" ? "active" : ""
              }`}
              onClick={() => onViewModeChange({ type: "cards" })}
              title="Card View"
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`view-button ${
                viewMode.type === "table" ? "active" : ""
              }`}
              onClick={() => onViewModeChange({ type: "table" })}
              title="Table View"
            >
              <FiList size={18} />
            </button>
          </div>

          <button
            className="theme-toggle"
            onClick={testGoogleSheets}
            title="Test Google Sheets Connection"
          >
            <FiCheckCircle size={20} />
          </button>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
