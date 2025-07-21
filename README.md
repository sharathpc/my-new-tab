# 🌟 My New Tab Chrome Extension

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/sharathpc/my-new-tab)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cgljimgmioocacliojoepmlpbonidohc.svg?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/cgljimgmioocacliojoepmlpbonidohc)

A beautiful, customizable Chrome extension that transforms your new tab page with a fresh Unsplash wallpaper every day, a digital clock, and one-click access to your favorite sites as favicon bookmarks.

[![Demo](screenshots/demo.gif)](#demo)

---

## ✨ Features

- **Daily Random Wallpaper** from Unsplash 🌄
- **Refresh Button** for a new image on demand 🔄
- **Digital Clock** for time tracking ⏰
- **Bookmark Your Favorite Sites** as clickable favicons ⭐
- **Lightweight & Fast** – no bloat!

---

## 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sharathpc/my-new-tab.git
   ```
2. **Open Chrome Extensions** at `chrome://extensions`
3. **Enable Developer Mode** (top right)
4. **Click "Load Unpacked"** and select the `Source code` folder

---

## 🛠️ Usage

- Open a new tab to see a random Unsplash wallpaper and the digital clock.
- Click the refresh button to get a new wallpaper instantly.
- Add your favorite sites as bookmarks; they’ll appear as favicons for quick access.

---

## 🧩 Project Structure

```
Source code/
  ├── css/
  │   ├── myNewTab.css
  │   ├── myNewTab.less
  │   ├── popup.css
  │   └── popup.less
  ├── img/
  │   ├── icon16.png
  │   ├── icon48.png
  │   ├── icon128.png
  │   ├── icons_sprite.png
  │   └── logos_sprite.png
  ├── js/
  │   ├── myNewTab.js
  │   ├── background.js
  │   └── popup.js
  ├── libraries/
  │   ├── jquery.min.js
  │   └── moment.min.js
  ├── manifest.json
  ├── myNewTab.html
  └── popup.html
```

---

## 🧑‍💻 Example Code

**Fetch and Set Random Unsplash Wallpaper:**
```js
function setRandomBackground() {
  fetch('https://source.unsplash.com/random/1920x1080')
    .then(response => {
      document.body.style.backgroundImage = `url(${response.url})`;
    });
}
setRandomBackground();
```

**Digital Clock:**
```js
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();
```

**Bookmark Favicons:**
```js
function renderBookmarks() {
  chrome.storage.local.get({ bookmarks: [] }, function(result) {
    const container = document.getElementById('bookmarks');
    container.innerHTML = '';
    result.bookmarks.forEach(url => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      const favicon = document.createElement('img');
      favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
      link.appendChild(favicon);
      container.appendChild(link);
    });
  });
}
renderBookmarks();
```

---

## 🔒 Permissions

- `tabs` – For tab utilities and bookmark management
- `storage` – To save bookmarks and settings
- `https://api.unsplash.com/` – To fetch wallpapers

---

## 📝 License

MIT

---

## 🙌 Credits

- [Unsplash](https://unsplash.com/) for the beautiful wallpapers
- [Google Favicons API](https://www.google.com/s2/favicons) for bookmark icons

---

## 📣 Contributing

Pull requests and suggestions are welcome! Please open an issue first to discuss what you would like to change.

---

## 🌐 Links

- **Extension Link:** [Chrome Webstore Link](https://chromewebstore.google.com/detail/my-new-tab/cgljimgmioocacliojoepmlpbonidohc)

---

**Enjoy your new, inspiring tab experience!**