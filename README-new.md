# 🗺️ Address Map - 地址地圖應用

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-yellow.svg)](https://vitejs.dev/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-green.svg)](https://developers.google.com/maps)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-orange.svg)](https://pages.github.com/)

一個現代化的響應式React應用程序，讓用戶能夠輸入多個地址並在互動式Google地圖上自動標記位置。支持批量地址處理、地理位置定位、移動設備整合等功能。

![Address Map Preview](./public/vite.svg)

## ✨ 功能特色

### 🗺️ 核心功能

- **批量地址處理** - 支持一次輸入多個地址，每行一個
- **智能地理編碼** - 自動將地址轉換為精確的經緯度坐標
- **互動式地圖** - 整合Google Maps JavaScript API
- **自定義標記** - 使用📍符號作為地圖標記，點擊顯示詳細資訊
- **地址管理** - 新增、查看、刪除已保存的地址

### 📱 用戶體驗

- **響應式設計** - 完美適配桌面、平板和手機設備
- **現代UI設計** - 採用漸層背景和卡片式佈局
- **即時反饋** - 處理過程中顯示進度條和狀態
- **鍵盤快捷鍵** - Ctrl+Enter快速添加地址
- **載入狀態** - 可視化反饋和錯誤處理

### 🌐 進階功能

- **地理位置定位** - 獲取用戶當前位置並在地圖上標記
- **移動設備整合** - 直接在手機Google Maps應用中打開地址
- **資訊窗口** - 點擊標記顯示地址和坐標資訊
- **地址導航** - 點擊地址列表在地圖上定位

## 🚀 技術棧

### 前端框架

- **React 19.1.1** - 使用最新的React功能和Hooks
- **TypeScript 5.8.3** - 提供類型安全和更好的開發體驗
- **Vite 7.1.2** - 快速的構建工具和開發服務器

### 地圖與API

- **Google Maps JavaScript API** - 強大的地圖功能
- **@react-google-maps/api 2.20.7** - React專用的Google Maps整合
- **Geocoding API** - 地址到坐標的轉換服務

### 開發工具

- **ESLint 9.33.0** - 代碼品質檢查
- **TypeScript ESLint** - TypeScript專用規則
- **Vite Plugin React** - React的Vite插件

### 樣式與UI

- **CSS3** - 現代CSS特性
- **Flexbox & Grid** - 響應式佈局系統
- **CSS Variables** - 主題化和可維護性

## 📋 系統需求

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **Google Maps API Key** (免費獲取)

## 🛠️ 安裝與設定

### 1. 克隆專案

```bash
git clone https://github.com/your-username/recordmap.git
cd recordmap
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定Google Maps API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用以下API：
   - Maps JavaScript API
   - Geocoding API
4. 創建API金鑰
5. 建立 `.env` 文件：
   ```bash
   cp .env.example .env
   ```
6. 在 `.env` 文件中設定您的API金鑰：
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

### 4. 啟動開發服務器

```bash
npm run dev
```

應用程序將在 `http://localhost:5173/` 上運行。

## 📁 專案結構

```
recordmap/
├── 📁 public/                 # 靜態資源
│   ├── vite.svg              # Vite 圖標
│   └── ...
├── 📁 src/                   # 源代碼
│   ├── App.tsx               # 主應用組件
│   ├── App.css               # 主樣式文件
│   ├── main.tsx              # 應用入口點
│   ├── vite-env.d.ts         # Vite 類型定義
│   └── ...
├── 📁 .github/               # GitHub 配置
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 部署配置
├── 📄 .env.example           # 環境變數模板
├── 📄 package.json           # 專案配置和依賴
├── 📄 vite.config.ts         # Vite 配置
├── 📄 tsconfig.json          # TypeScript 配置
├── 📄 README.md              # 專案說明
└── 📄 .gitignore             # Git 忽略文件
```

## 🎯 使用指南

### 基本操作

1. **輸入地址** - 在文字區域中輸入地址，每行一個
2. **添加地址** - 點擊"➕ Add Addresses"按鈕或按Ctrl+Enter
3. **查看地圖** - 地址會自動在地圖上以📍標記顯示
4. **獲取位置** - 點擊"📍 Current Location"獲取您的位置

### 進階功能

- **點擊標記** - 點擊地圖上的📍標記查看詳細資訊
- **地址導航** - 點擊地址列表在地圖上定位
- **移動整合** - 在手機上點擊"🗺️ Open"直接打開Google Maps應用

## 🌐 部署指南

### GitHub Pages 自動部署

專案已配置GitHub Actions自動部署到GitHub Pages：

1. **推送代碼到GitHub**

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```
2. **設定GitHub Secrets**

   - 前往倉庫 Settings → Secrets and variables → Actions
   - 新增 `VITE_GOOGLE_MAPS_API_KEY` 秘密
3. **啟用GitHub Pages**

   - 前往倉庫 Settings → Pages
   - Source 選擇 "GitHub Actions"

您的應用將自動部署到 `https://your-username.github.io/recordmap/`

## 🔧 可用腳本

```bash
# 開發服務器
npm run dev

# 生產構建
npm run build

# 預覽生產構建
npm run preview

# 代碼檢查
npm run lint
```

## 📱 移動設備支援

- **觸控優化** - 針對觸控設備優化的界面
- **原生應用整合** - 直接在Google Maps應用中打開地址
- **響應式佈局** - 自適應不同屏幕尺寸
- **地理位置** - 支援設備地理位置服務

## 🔒 安全注意事項

- **API金鑰保護** - 從不將 `.env` 文件提交到版本控制
- **GitHub Secrets** - 使用倉庫秘密保護敏感資料
- **HTTPS** - GitHub Pages自動提供SSL證書
- **CORS政策** - Google Maps API支援跨域請求

## 🤝 貢獻指南

歡迎貢獻！請遵循以下步驟：

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 開發規範

- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 配置
- 為新功能添加適當的測試
- 更新文檔

## 📄 授權

此專案採用 [MIT License](LICENSE) 授權。

## 🙏 致謝

- [Google Maps Platform](https://developers.google.com/maps) - 提供強大的地圖服務
- [React](https://reactjs.org/) - 優秀的前端框架
- [Vite](https://vitejs.dev/) - 快速的構建工具
- [TypeScript](https://www.typescriptlang.org/) - 類型安全的JavaScript

## 📞 聯絡方式

如有問題或建議，請開啟 [Issue](https://github.com/your-username/recordmap/issues) 或聯絡專案維護者。

---

**⭐ 如果這個專案對您有幫助，請給我們一個Star！**

**🌐 線上演示**: [https://your-username.github.io/recordmap/](https://your-username.github.io/recordmap/)
