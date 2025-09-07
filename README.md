# 🗺️ Address Map

A modern, responsive React application that allows users to input multiple addresses and automatically mark them on an interactive Google Map.

## ✨ Features

- **🌐 Internationalization (i18n)**: Full support for Traditional Chinese and English with easy language switching
- **📤 Export Functionality**: Multiple export options including CSV, JSON, static map images, and KML files
- **Progressive Web App (PWA)**: Installable app with offline support, service worker caching, and native app-like experience
- **Modern UI Design**: Beautiful gradient backgrounds and card-based layout
- **Responsive Design**: Fully responsive across all devices (desktop, tablet, mobile)
- **Interactive Map**: Google Maps integration with custom numbered markers
- **Address Management**: Add, view, and remove addresses with coordinates
- **Real-time Geocoding**: Automatic address-to-coordinates conversion
- **Loading States**: Visual feedback during address searches
- **Error Handling**: User-friendly error messages
- **Keyboard Support**: Press Enter to add addresses quickly
- **Mobile Integration**: Direct integration with native Google Maps app
- **Offline Support**: Cached Google Maps and fonts for offline use

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Maps API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd recordmap
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up Google Maps API**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API
   - Create credentials (API Key)
   - Add your API key to `.env` file:
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```
4. **Start the development server**

   ```bash
   npm run dev
   ```

## 🌐 Deployment to GitHub Pages

### Step 1: Prepare Your Repository

1. **Create a new GitHub repository** (or use existing one)
2. **Initialize Git** (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Rename repository** to match the base path in `vite.config.ts`:

   - If your GitHub username is `yourusername`, rename repo to `recordmap`
   - Or update `vite.config.ts` base path to match your repo name

### Step 2: Protect Your Environment Variables

1. **Copy environment template**:

   ```bash
   cp .env .env.backup
   ```
2. **Remove .env from git tracking** (if already committed):

   ```bash
   git rm --cached .env
   git commit -m "Remove .env file from tracking"
   ```
3. **Set up GitHub Secrets**:

   - Go to your GitHub repository
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API Key (from `.env` file)

### Step 3: Deploy

1. **Push to GitHub**:

   ```bash
   git remote add origin https://github.com/yourusername/recordmap.git
   git branch -M main
   git push -u origin main
   ```
2. **Enable GitHub Pages**:

   - Go to your GitHub repository
   - Click **Settings** → **Pages**
   - Source: **GitHub Actions**
   - The workflow will automatically deploy your site
3. **Access your deployed site**:

   - Your site will be available at: `https://yourusername.github.io/recordmap/`

### Step 4: Update Repository Name (Optional)

If you want to use a different repository name:

1. **Update `vite.config.ts`**:

   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // Change this to match your repo name
   })
   ```
2. **Update workflow file** `.github/workflows/deploy.yml`:

   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     if: github.ref == 'refs/heads/main'
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist
       cname: your-custom-domain.com  # Optional: for custom domain
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Google Maps JavaScript API** - Map functionality
- **@react-google-maps/api** - React Google Maps integration
- **React i18next** - Internationalization framework
- **i18next** - Core internationalization library
- **i18next Browser LanguageDetector** - Automatic language detection
- **Vite PWA Plugin** - Progressive Web App functionality
- **Workbox** - Service worker and caching strategies
- **Sharp** - Image processing for PWA icons
- **CSS3** - Modern styling with gradients and animations

## 🌐 Internationalization (i18n)

This application supports multiple languages with full internationalization:

### Supported Languages
- **繁體中文 (zh-TW)** - Traditional Chinese (Default)
- **English (en)** - English

### Language Features
- **Automatic Detection**: Detects browser language preference
- **Persistent Selection**: Remembers user's language choice
- **Real-time Switching**: Instant language switching without page reload
- **Complete Coverage**: All UI text, messages, and labels are translated

### How to Use
1. Click the language switcher button in the header (🇹🇼 中文 / 🇺🇸 EN)
2. The interface will instantly switch to the selected language
3. Your language preference is automatically saved

### Adding New Languages
To add support for additional languages:

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json` for French)
2. Add the language to the resources in `src/i18n/i18n.ts`
3. Update the language switcher component to include the new language option

## � Export Functionality

The application provides multiple export options to save and share your address data:

### Export Formats

- **📊 CSV Format**: Tabular data with address, latitude, and longitude columns
  - Compatible with Excel, Google Sheets, and other spreadsheet applications
  - Perfect for data analysis and reporting

- **📄 JSON Format**: Structured data format
  - Complete address objects with all properties
  - Ideal for integration with other applications
  - Includes status information and coordinates

- **🗺️ Static Map Image**: Google Maps static image with markers
  - High-quality 800x600 pixel image
  - Includes all address markers on the map
  - Opens in new tab for immediate viewing
  - Perfect for presentations and documentation

- **🌍 KML Format**: Geographic data format
  - Compatible with Google Earth and Google My Maps
  - Standard format for geographic information systems
  - Includes all address points with coordinates

### How to Export

1. **Add Addresses**: First, input and add the addresses you want to export
2. **Export Options Appear**: The export section will automatically appear above the input buttons once addresses are added
3. **Choose Format**: Click on the desired export button in the Export Options section
4. **View/Download**:
   - CSV, JSON, KML files will be automatically downloaded
   - Static map image will open in a new tab for immediate viewing

### Export Section Visibility

- **Hidden by Default**: Export options are hidden when no addresses are added
- **Auto-Show**: Export section appears automatically once the first address is added
- **Always Available**: Export options remain visible as long as addresses exist### Usage Examples

- **CSV**: Import into Excel for data analysis (Chinese characters properly encoded)
- **JSON**: Use in web applications or data processing scripts
- **Static Map**: View immediately in new tab or save the image
- **KML**: Open in Google Earth for 3D visualization

### Technical Notes

- **CSV Encoding**: Uses UTF-8 BOM to ensure proper display of Chinese characters in Excel
- **Static Map**: Opens in new tab for immediate viewing (right-click to save image)
- **File Names**: All exported files have descriptive names with timestamps
- **API Limits**: Static map export requires valid Google Maps API key

## �📱 Mobile Features

- **Native App Integration**: Direct opening in Google Maps mobile app
- **Touch Optimized**: Responsive design for mobile devices
- **Geolocation**: Access to device location services

## 🏠 Progressive Web App (PWA)

This application is built as a Progressive Web App with the following features:

### Installation

- **Chrome/Edge**: Click the install icon in the address bar or use the app menu
- **Firefox**: Click the install button in the page info or use the app menu
- **Safari (iOS)**: Use the Share button → "Add to Home Screen"
- **Android**: Use "Add to Home Screen" from the browser menu

### Offline Support

- **Cached Maps**: Google Maps tiles and fonts are cached for offline use
- **Service Worker**: Automatic background updates and caching
- **Fast Loading**: Pre-cached resources for instant loading

### PWA Features

- **Installable**: Can be installed like a native app
- **Offline Capable**: Works without internet connection (limited functionality)
- **Background Sync**: Automatic updates when online
- **Push Notifications**: Ready for future notification features
- **Native Feel**: App-like experience on mobile devices

## 🔒 Security Notes

- **API Key Protection**: Never commit `.env` files to version control
- **GitHub Secrets**: Use repository secrets for sensitive data
- **HTTPS**: GitHub Pages automatically provides SSL certificates

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Live Demo**: [https://yourusername.github.io/recordmap/](https://yourusername.github.io/recordmap/)

```

5. **Open your browser**
   - Navigate to `http://localhost:5173/`

## 🎯 Usage

1. **Enter an Address**: Type any address in the input field
2. **Add to Map**: Click "➕ Add Address" or press Enter
3. **View on Map**: See the location marked with a numbered pin
4. **Manage Addresses**: View all saved addresses in the sidebar
5. **Remove Addresses**: Click the trash icon to remove any address

## 🎨 Design Features

- **Gradient Background**: Beautiful purple gradient backdrop
- **Glass Morphism**: Semi-transparent main container with blur effect
- **Custom Markers**: Numbered pins on the map
- **Hover Effects**: Interactive elements with smooth transitions
- **Mobile-First**: Optimized for all screen sizes
- **Accessibility**: Proper contrast and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Maps**: Google Maps JavaScript API
- **Styling**: Custom CSS with modern design principles
- **Icons**: Unicode emojis for lightweight iconography

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 480px - 768px
- **Mobile**: < 480px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
