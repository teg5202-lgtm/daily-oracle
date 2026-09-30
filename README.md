# 求籤問卜 · Daily Oracle

繁體中文靜態抽籤網站，包含籤筒動畫、合成音效、12 則籤文、指引與本機歷史紀錄。

## 執行

不需要建置或後端。在專案目錄執行 `python3 -m http.server 8000`，開啟 http://localhost:8000 。

## GitHub Pages

將本目錄的所有檔案上傳到新 repository 的 `main` 分支。在 Settings → Pages 選擇 Deploy from a branch，來源設為 `main` 與 `/ (root)`，儲存後等待部署完成。

## 檔案

- `index.html`：頁面與內嵌 SVG 插圖
- `styles.css`：自訂樣式與動畫
- `app.js`：抽籤、音效與紀錄管理
- `.nojekyll`：靜態檔案發佈設定

## 依賴與資料

Tailwind CSS、Google Fonts 與 Font Awesome 由外部 CDN 載入，因此完整樣式需要網路連線。插圖是內嵌 SVG，音效由 Web Audio API 產生，無額外圖片或音檔。

紀錄只保存在目前瀏覽器的 localStorage，最多保留 500 筆；不會上傳到伺服器。清除瀏覽資料或更換裝置不會保留紀錄。若儲存不可用，仍可在當次頁面使用抽籤。抽籤結果為隨機產生。

程式碼由使用者提供，未另行指定開源授權。
