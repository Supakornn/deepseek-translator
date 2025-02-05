<script lang="ts">
  /// <reference types="chrome"/>
  import { onMount } from "svelte";
  import { translate } from "./translator";

  let inputText = "";
  let translatedText = "";
  let targetLanguage = "en";

  async function handleTranslate() {
    translatedText = await translate(inputText, targetLanguage);
  }

  async function translatePage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "translatePage",
          targetLang: targetLanguage
        });
      }
    } catch (error) {
      console.error("Error translating page:", error);
    }
  }

  async function restorePage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, { action: "restorePage" });
      }
    } catch (error) {
      console.error("Error restoring page:", error);
    }
  }
</script>

<main>
  <h2>DeepSeek Translator</h2>

  <!-- ปุ่มแปลทั้งหน้า -->
  <div class="page-actions">
    <button on:click={translatePage}>แปลทั้งหน้า</button>
    <button on:click={restorePage}>คืนค่าเดิม</button>
  </div>

  <hr />

  <!-- แปลข้อความ -->
  <textarea bind:value={inputText} placeholder="ใส่ข้อความที่ต้องการแปล"></textarea>
  <select bind:value={targetLanguage}>
    <option value="en">อังกฤษ</option>
    <option value="th">ไทย</option>
    <option value="zh">จีน</option>
  </select>
  <button on:click={handleTranslate}>แปล</button>
  <p>{translatedText}</p>
</main>

<style>
  main {
    padding: 10px;
    width: 300px;
  }
  textarea {
    width: 100%;
    height: 100px;
    margin: 8px 0;
  }
  button {
    margin-top: 10px;
    width: 100%;
  }
  .page-actions {
    display: flex;
    gap: 8px;
  }
  .page-actions button {
    flex: 1;
  }
  hr {
    margin: 16px 0;
    border: none;
    border-top: 1px solid #ccc;
  }
</style>
