"use client";
import React from "react";

const Hello = () => {
  console.log("i am client side component");
  /** ↑ 在伺服器終端機依然可以看到客戶端元件的日誌
   *
   * 客戶端元件在 Next.js 會經歷以下過程：
   * 1. 伺服器端渲染：在伺服器執行這個元件的邏輯，生成初始的 HTML
   * 2. 靜態內容傳輸：將生成的 HTML 傳輸到瀏覽器（客戶端）
   * 3. 客戶端水合：JS bundle 載入後，React 會接管這個 DOM 節點，綁定事件處理器、恢復元件狀態…，使其變得完全互動
   */
  return <div>Hello</div>;
};

export default Hello;
