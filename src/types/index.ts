export interface DailyUpdate {
  sn: number;
  date: string;
  accountName: string;
  projectName: string;
  remarks: string;
  id?: string; // Google Sheets row ID
}

export interface Theme {
  name: "light" | "dark";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
  };
}

export interface ViewMode {
  type: "cards" | "table";
}

export interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}
