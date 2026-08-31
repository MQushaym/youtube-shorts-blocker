<div align="center">

# 🛡️ YouTube Shorts Blocker | حاجب يوتيوب شورتس

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-Compatible-brightgreen.svg?style=flat-square&logo=googlechrome)](https://www.google.com/chrome/)
[![Edge](https://img.shields.io/badge/Edge-Compatible-blue.svg?style=flat-square&logo=microsoftedge)](https://www.microsoft.com/edge)
[![Brave](https://img.shields.io/badge/Brave-Compatible-orange.svg?style=flat-square&logo=brave)](https://brave.com/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-purple.svg?style=flat-square)](#-privacy--security-policy)

**A lightweight, privacy-focused browser extension (Manifest V3) to completely hide YouTube Shorts and redirect short links to the classic video player.**

**إضافة متصفح خفيفة وآمنة (Manifest V3) لإخفاء وحظر مقاطع وشريط YouTube Shorts بالكامل، مع تحويل الروابط تلقائياً إلى المشغل التقليدي.**

[المميزات](#-المميزات-العربية) • [English Features](#-features-english) • [طريقة التثبيت](#-طريقة-التثبيت-والتشغيل) • [Privacy Policy](#-privacy--security-policy) • [License](#-license)

---

</div>

## 🇸🇦 المميزات (العربية)

1. **إخفاء زر Shorts من الشريط الجانبي**:
   - إزالة خيار الشورتس من القائمة الجانبية الموسعة والمصغرة (Sidebar & Mini Guide).
2. **إخفاء رفوف وفيديوهات Shorts**:
   - تنظيف الصفحة الرئيسية، صفحة الاشتراكات، نتائج البحث، وتبويب القنوات من أي رفوف أو فيديوهات Shorts.
3. **حظر فوري بدون وميض (Zero Layout Shift)**:
   - حقن فوري لأنماط الـ CSS عند بداية تحميل الصفحة (`document_start`) لمنع ظهور الشورتس ولو لجزء من الثانية.
4. **التحويل التلقائي للمشغل التقليدي (Auto-Redirect)**:
   - فتح أي رابط شورتس مثل `youtube.com/shorts/VIDEO_ID` في مشغل اليوتيوب العادي `youtube.com/watch?v=VIDEO_ID`.
5. **لوحة تحكم وتخصيص أنيقة (Popup UI)**:
   - مفاتيح للتحكم في تفعيل أو تعطيل أي ميزة مع عداد إحصائي مباشر لعناصر الشورتس المحجوبة.
6. **100% آمنة وخاصة**:
   - لا تتطلب صلاحيات معقدة، وتعمل محلياً بالكامل بدون جمع أو إرسال أي بيانات خارجية.

---

## 🇬🇧 Features (English)

- 🚫 **Hide Sidebar Shorts Button**: Seamlessly removes the Shorts icon and navigation entry from YouTube's expanded and mini sidebar.
- 🧹 **Clean Feeds & Shelves**: Automatically filters out Shorts shelves, video grids, and recommendation items across Home, Subscriptions, Search Results, and Channel pages.
- ⚡ **Zero-Flicker CSS Injection**: CSS rules are applied at `document_start`, guaranteeing no visual flashing or layout shifts while pages load.
- 🔄 **Smart URL Auto-Redirection**: Automatically redirects `/shorts/VIDEO_ID` to the standard desktop player (`/watch?v=VIDEO_ID`).
- 🎛️ **Modern Extension Popup**: Full control over features with individual toggle switches, dark theme design, and a live blocked-count tracker.
- 🔒 **Privacy-First & Secure**: 100% client-side execution. Zero analytics, zero trackers, and minimal necessary permissions.

---

## 🚀 طريقة التثبيت والتشغيل | Installation Guide

### متصفحات Chromium (Chrome, Microsoft Edge, Brave, Opera, Vivaldi):

1. قم بتنزيل أو استنساخ المستودع (Clone / Download ZIP):
   ```bash
   git clone https://github.com/MQushaym/youtube-shorts-blocker.git
   ```
   *أو يمكنك [تحميل الملف المضغوط مباشرة (Download ZIP)](https://github.com/MQushaym/youtube-shorts-blocker/archive/refs/heads/main.zip) وفك الضغط عنه.*
2. افتح صفحة إدارة الإضافات في متصفحك:
   - **Google Chrome**: اكتب `chrome://extensions/`
   - **Microsoft Edge**: اكتب `edge://extensions/`
   - **Brave Browser**: اكتب `brave://extensions/`
3. قم بتفعيل **وضع مطور البرامج (Developer mode)** في الزاوية العلوية.
4. اضغط على زر **تحميل إضافة تم فك حزمتها (Load unpacked)**.
5. حدد مجلد المشروع `youtube-shorts-blocker`.
6. افتح [YouTube](https://www.youtube.com) وستعمل الإضافة فوراً وبشكل تلقائي!

---

## 📁 هيكلية المشروع | Project Structure

```text
youtube-shorts-blocker/
├── manifest.json            # Manifest V3 configuration & permissions
├── icons/                   # High-res extension icons (16px, 48px, 128px)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── content/                 # Content scripts injected into YouTube
│   ├── content.css          # Instant zero-flash CSS hiding rules
│   └── content.js           # Dynamic SPA observer & URL redirection
├── popup/                   # Popup control panel UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## 🔒 Privacy & Security Policy | سياسة الخصوصية والأمان

- **Zero Data Collection**: We do NOT collect, track, store, or transmit any user browsing data, history, or personal identifiers.
- **Local Storage Only**: The `storage` permission is strictly used to store your toggle preferences (e.g. enable/disable switches) and the blocked item counter locally on your browser.
- **Host Permissions**: The `*://*.youtube.com/*` permission is strictly scoped to YouTube domains to inject the necessary styles and scripts.
- **No External Dependencies / No Remote Code**: 100% vanilla JavaScript and CSS complying strictly with Chrome Web Store safety guidelines (no `eval`, no remote CDNs).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.
