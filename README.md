# ✨ Daily Updates App

A cute and girly daily updates tracking application built with React, TypeScript, and Vite. Perfect for tracking project updates with a beautiful, iPhone-friendly interface.

## 🌟 Features

- **Auto-incrementing Serial Numbers**: SN field automatically updates
- **Real-time Timestamps**: Date field captures current timestamp
- **Form Fields**: Account Name, Project Name, and Remarks
- **Dual View Modes**: Switch between Cards view and Table view (minimal)
- **Theme Support**: Cute girly theme with light and dark variants
- **Mobile-Friendly**: Optimized for iPhone and mobile devices
- **CRUD Operations**: Create, Read, Update, Delete with notifications
- **Google Sheets Integration**: Use Google Sheets as your database
- **Cute Fonts**: Comfortaa and Quicksand for a delightful experience

## 🎨 Design

- **Girly Theme**: Pink color palette with cute aesthetics
- **Light/Dark Mode**: Toggle between themes
- **Responsive**: Mobile-first design optimized for iPhone
- **Cute Fonts**: Google Fonts integration
- **Smooth Animations**: Delightful micro-interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (current requirement)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd daily-updates
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (optional for Google Sheets)

```bash
cp .env.example .env
# Edit .env with your Google Sheets configuration
```

4. Start the development server

```bash
npm run dev
```

## 📊 Google Sheets Integration

### Setup Steps:

1. **Create Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Sheets API**

   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create API Key**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

4. **Create Google Sheet**

   - Create a new Google Sheet
   - Set up columns: `SN | Date | Account Name | Project Name | Remarks`
   - Make the sheet public (view access) or set up proper permissions
   - Copy the Sheet ID from the URL

5. **Configure Environment Variables**

```env
VITE_GOOGLE_SHEETS_ID=your_google_sheet_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### Sheet Structure:

```
| A  | B    | C            | D            | E       |
| SN | Date | Account Name | Project Name | Remarks |
```

### API Endpoints Used:

- **Read**: `GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}?key={apiKey}`
- **Write**: `POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append`
- **Update**: `PUT https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}`

## 📱 Mobile Optimization

The app is specifically optimized for iPhone:

- Touch-friendly buttons and form elements
- Responsive grid layout that adapts to screen size
- Optimized font sizes and spacing
- Swipe-friendly card interactions
- Mobile keyboard optimizations

## 🎯 Usage

1. **Adding Updates**: Fill in Account Name, Project Name, and optional Remarks
2. **Viewing Updates**: Switch between Card view (detailed) and Table view (minimal)
3. **Editing**: Click the edit icon on any update
4. **Deleting**: Click the delete icon (with confirmation)
5. **Theme Toggle**: Use the moon/sun icon in the header

## 🛠 Technology Stack

- **Frontend**: React 19.1+ with TypeScript
- **Styling**: CSS with custom properties (CSS variables)
- **Icons**: React Icons (Feather icons)
- **Notifications**: React Toastify
- **Database**: Google Sheets API
- **Build Tool**: Vite
- **Fonts**: Google Fonts (Comfortaa, Quicksand)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with theme toggle
│   ├── UpdateForm.tsx  # Form for adding updates
│   ├── UpdateCard.tsx  # Card view component
│   ├── UpdateTable.tsx # Table view component
│   └── EditModal.tsx   # Modal for editing updates
├── contexts/           # React contexts
│   ├── ThemeContext.ts # Theme context definition
│   └── ThemeContext.tsx # Theme provider
├── hooks/              # Custom hooks
│   └── useTheme.ts     # Theme hook
├── services/           # API services
│   └── googleSheets.ts # Google Sheets service
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── utils/              # Utilities
│   └── themes.ts       # Theme definitions
├── App.tsx             # Main app component
├── App.css             # App styles
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Colors

The girly theme can be customized by modifying the color variables in `src/utils/themes.ts`:

```typescript
export const lightTheme: Theme = {
  name: "light",
  colors: {
    primary: "#ff69b4", // Hot pink
    secondary: "#ffc0cb", // Light pink
    background: "#fff5fd", // Very light pink
    // ... more colors
  },
};
```

### Fonts

Update the Google Fonts import in `src/index.css` and modify the CSS variables:

```css
@import url("https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap");

:root {
  --font-primary: "YourFont", cursive;
  --font-secondary: "YourFont", sans-serif;
}
```

## 🚨 Troubleshooting

### Node.js Version Issue

If you encounter Node.js version errors:

```bash
# Update Node.js to version 20.19+ or 22.12+
nvm install 20
nvm use 20
```

### Google Sheets API Issues

- Ensure the sheet is public or properly shared
- Verify API key has Google Sheets API access
- Check the Sheet ID is correct
- Ensure CORS is properly configured for web requests

### Mobile Issues

- Test on actual device for best experience
- Use browser dev tools mobile simulation
- Check touch event handling

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💖 Acknowledgments

- Icons by [Feather Icons](https://feathericons.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Inspiration from modern girly UI/UX trends

---

Made with 💖 for daily productivity tracking!
