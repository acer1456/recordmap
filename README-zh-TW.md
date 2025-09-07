# 🗺️ 地址地圖

一個現代化的響應式React應用程式，讓用戶可以輸入多個地址並自動在地圖上標記位置。

## ✨ 功能特色

- **🌐 國際化 (i18n)**: 完整支援繁體中文和英文，輕鬆切換語言
- **📤 匯出功能**: 多種匯出選項，包括CSV、JSON、靜態地圖影像和KML文件
- **Progressive Web App (PWA)**: 可安裝應用程式，具有離線支援、Service Worker快取和原生應用程式般的體驗
- **現代化UI設計**: 美麗的漸層背景和卡片式佈局
- **響應式設計**: 完全響應式，支援所有設備（桌面、平板、手機）
- **互動式地圖**: Google Maps整合，自定義編號標記
- **地址管理**: 添加、查看和移除地址及其座標
- **即時地理編碼**: 自動地址轉座標轉換
- **載入狀態**: 地址搜尋期間的視覺回饋
- **錯誤處理**: 用戶友好的錯誤訊息
- **鍵盤支援**: 按Enter快速添加地址
- **行動裝置整合**: 直接整合到原生Google Maps應用程式
- **離線支援**: 快取Google Maps和字體以供離線使用

## 🚀 開始使用

### 先決條件

- Node.js (v16 或更高版本)
- npm 或 yarn
- Google Maps API 金鑰

### 安裝

1. **複製倉庫**

   ```bash
   git clone <repository-url>
   cd recordmap
   ```
2. **安裝依賴項**

   ```bash
   npm install
   ```
3. **設定Google Maps API**

   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 創建新專案或使用現有專案
   - 啟用以下API：
     - Maps JavaScript API
     - Geocoding API
   - 創建憑證 (API 金鑰)
   - 將您的API金鑰添加到 `.env` 文件：
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```
4. **啟動開發服務器**

   ```bash
   npm run dev
   ```

## 🌐 部署到GitHub Pages

### 步驟1: 準備您的倉庫

1. **創建新的GitHub倉庫** (或使用現有倉庫)
2. **初始化Git** (如果尚未完成)：

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **重新命名倉庫** 以匹配 `vite.config.ts` 中的base路徑：

   - 如果您的GitHub用戶名是 `yourusername`，請將倉庫重新命名為 `recordmap`
   - 或更新 `vite.config.ts` base路徑以匹配您的倉庫名稱

### 步驟2: 保護您的環境變數

1. **複製環境模板**：

   ```bash
   cp .env .env.backup
   ```
2. **從git追蹤中移除 .env** (如果已提交)：

   ```bash
   git rm --cached .env
   git commit -m "Remove .env file from tracking"
   ```
3. **設定GitHub Secrets**：

   - 前往您的GitHub倉庫
   - 點擊 **Settings** → **Secrets and variables** → **Actions**
   - 點擊 **New repository secret**
   - 名稱: `VITE_GOOGLE_MAPS_API_KEY`
   - 值: 您的Google Maps API金鑰 (來自 `.env` 文件)

### 步驟3: 部署

1. **推送到GitHub**：

   ```bash
   git remote add origin https://github.com/yourusername/recordmap.git
   git branch -M main
   git push -u origin main
   ```
2. **啟用GitHub Pages**：

   - 前往您的GitHub倉庫
   - 點擊 **Settings** → **Pages**
   - Source: **GitHub Actions**
   - 工作流程將自動部署您的網站
3. **訪問您的已部署網站**：

   - 您的網站將在以下位置可用： `https://yourusername.github.io/recordmap/`

### 步驟4: 更新倉庫名稱 (可選)

如果您想要使用不同的倉庫名稱：

1. **更新 `vite.config.ts`**：

   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // 更改為匹配您的倉庫名稱
   })
   ```
2. **更新工作流程文件** `.github/workflows/deploy.yml`：

   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     if: github.ref == 'refs/heads/main'
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist
       cname: your-custom-domain.com  # 可選：自定義域名
   ```

## 🔧 可用腳本

- `npm run dev` - 啟動開發服務器
- `npm run build` - 為生產環境建置
- `npm run preview` - 在本地預覽生產建置
- `npm run lint` - 運行ESLint

## 🛠️ 使用的技術

- **React 19** - 前端框架
- **TypeScript** - 類型安全
- **Vite** - 建置工具和開發服務器
- **Google Maps JavaScript API** - 地圖功能
- **@react-google-maps/api** - React Google Maps整合
- **React i18next** - 國際化框架
- **i18next** - 核心國際化函式庫
- **i18next Browser LanguageDetector** - 自動語言檢測
- **Vite PWA Plugin** - Progressive Web App功能
- **Workbox** - Service Worker和快取策略
- **Sharp** - PWA圖標影像處理
- **CSS3** - 現代化樣式設計，包含漸層和動畫

## 🌐 國際化 (i18n)

此應用程式支援多種語言，具有完整的國際化功能：

### 支援的語言

- **繁體中文 (zh-TW)** - 繁體中文 (預設)
- **English (en)** - 英文

### 語言功能

- **自動檢測**: 檢測瀏覽器語言偏好
- **持續選擇**: 記住用戶的語言選擇
- **即時切換**: 無需重新載入頁面的即時語言切換
- **完整覆蓋**: 所有UI文字、訊息和標籤都已翻譯

### 如何使用

1. 點擊頁首的語言切換按鈕 (🇹🇼 中文 / 🇺🇸 EN)
2. 介面將立即切換到選定的語言
3. 您的語言偏好將自動保存

### 添加新語言

要添加對其他語言的支援：

1. 在 `src/i18n/locales/` 中創建新的JSON文件 (例如：`fr.json` 用於法文)
2. 在 `src/i18n/i18n.ts` 中的資源中添加語言
3. 更新語言切換組件以包含新語言選項

## 📤 匯出功能

應用程式提供多種匯出選項來保存和分享您的地址數據：

### 匯出格式

- **📊 CSV格式**: 包含地址、緯度、經度欄的表格數據

  - 與Excel、Google Sheets和其他試算表應用程式相容
  - 完美適用於數據分析和報告
- **📄 JSON格式**: 結構化數據格式

  - 完整的地址對象及其所有屬性
  - 適用於與其他應用程式整合
  - 包含狀態資訊和座標
- **🗺️ 靜態地圖影像**: 包含標記的Google Maps靜態影像

  - 高品質800x600像素影像
  - 包含地圖上的所有地址標記
  - 在新分頁中開啟以立即查看
  - 完美適用於簡報和文檔
- **🌍 KML格式**: 地理數據格式

  - 與Google Earth和Google My Maps相容
  - 地理資訊系統標準格式
  - 包含所有地址點及其座標

### 如何匯出

1. **添加地址**: 首先輸入並添加您想要匯出的地址
2. **匯出選項出現**: 添加地址後，匯出區段將自動出現在輸入按鈕上方
3. **選擇格式**: 點擊匯出選項區段中所需的匯出按鈕
4. **查看/下載**：
   - CSV、JSON、KML文件將自動下載
   - 靜態地圖影像將在新分頁中開啟以立即查看

### 匯出區段可見性

- **預設隱藏**: 沒有添加地址時，匯出選項隱藏
- **自動顯示**: 添加第一個地址後，匯出區段自動出現
- **始終可用**: 只要存在地址，匯出選項就保持可見

### 使用範例

- **CSV**: 匯入Excel進行數據分析 (中文字符正確編碼)
- **JSON**: 在Web應用程式或數據處理腳本中使用
- **靜態地圖**: 在新分頁中立即查看或保存影像
- **KML**: 在Google Earth中開啟以進行3D視覺化

### 技術說明

- **CSV編碼**: 使用UTF-8 BOM確保在Excel中正確顯示中文字符
- **靜態地圖**: 在新分頁中開啟以立即查看 (右鍵可保存影像)
- **文件名稱**: 所有匯出文件都有描述性的名稱
- **API限制**: 靜態地圖匯出需要有效的Google Maps API金鑰

## 📱 行動裝置功能

- **原生應用程式整合**: 直接在Google Maps行動應用程式中開啟
- **觸控優化**: 針對行動裝置的響應式設計
- **地理定位**: 存取裝置位置服務

## 🏠 Progressive Web App (PWA)

此應用程式建置為Progressive Web App，具有以下功能：

### 安裝

- **Chrome/Edge**: 點擊地址欄中的安裝圖標或使用應用程式選單
- **Firefox**: 點擊頁面資訊中的安裝按鈕或使用應用程式選單
- **Safari (iOS)**: 使用分享按鈕 → "添加到主畫面"
- **Android**: 使用瀏覽器選單中的"添加到主畫面"

### 離線支援

- **快取地圖**: Google Maps圖磚和字體被快取以供離線使用
- **Service Worker**: 自動背景更新和快取
- **快速載入**: 預快取資源以實現即時載入

### PWA功能

- **可安裝**: 可以像原生應用程式一樣安裝
- **離線可用**: 在沒有網路連接的情況下工作 (功能有限)
- **背景同步**: 上線時自動更新
- **推送通知**: 為未來通知功能做好準備
- **原生體驗**: 行動裝置上的應用程式般體驗

## 🔒 安全性說明

- **API金鑰保護**: 切勿將 `.env` 文件提交到版本控制
- **GitHub Secrets**: 對敏感數據使用倉庫密鑰
- **HTTPS**: GitHub Pages自動提供SSL憑證

## 📄 授權

此專案為開源專案，可在 [MIT License](LICENSE) 下使用。

---

**線上演示**: [https://yourusername.github.io/recordmap/](https://yourusername.github.io/recordmap/)

---

📖 **查看英文版**: [README.md](README.md)

---

5. **開啟您的瀏覽器**
   - 導航到 `http://localhost:5173/`

## 🎯 使用方式

1. **輸入地址**: 在輸入欄位中輸入任何地址
2. **添加到地圖**: 點擊"➕ 添加地址"或按Enter
3. **在地圖上查看**: 查看以編號圖釘標記的位置
4. **管理地址**: 在側邊欄中查看所有保存的地址
5. **移除地址**: 點擊垃圾桶圖標移除任何地址

## 🎨 設計特色

- **漸層背景**: 美麗的紫色漸層背景
- **玻璃形態**: 半透明主容器帶有模糊效果
- **自定義標記**: 地圖上的編號圖釘
- **懸停效果**: 互動元素帶有平滑過渡
- **行動優先**: 針對所有螢幕尺寸優化
- **無障礙**: 適當的對比度和鍵盤導航

## 🛠️ 技術棧

- **前端**: React 19 + TypeScript
- **建置工具**: Vite
- **地圖**: Google Maps JavaScript API
- **樣式**: 現代設計原則的自定義CSS
- **圖標**: 輕量級圖標的Unicode表情符號

## 📱 響應式斷點

- **桌面**: > 768px
- **平板**: 480px - 768px
- **手機**: < 480px

## 🔧 可用腳本

- `npm run dev` - 啟動開發服務器
- `npm run build` - 為生產環境建置
- `npm run preview` - 在本地預覽生產建置
- `npm run lint` - 運行ESLint

## 📄 授權

此專案為開源專案，可在 [MIT License](LICENSE) 下使用。

      // 移除 tseslint.configs.recommended 並替換為此
      ...tseslint.configs.recommendedTypeChecked,
      // 或者，使用此以獲得更嚴格的規則
      ...tseslint.configs.strictTypeChecked,
      // 可選：添加此以獲得風格規則
      ...tseslint.configs.stylisticTypeChecked,

      // 其他配置...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他選項...
    },
  },
])

您也可以安裝 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) 和 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) 以獲得React特定的lint規則：

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 其他配置...
      // 啟用React的lint規則
      reactX.configs['recommended-typescript'],
      // 啟用React DOM的lint規則
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他選項...
    },
  },
])
```

---

📖 **查看英文版**: [README.md](README.md)
