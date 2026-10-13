# YouTube Lite Popup Blocker

A small, privacy-friendly Chrome/Brave extension that dismisses the recurring YouTube Premium upgrade dialog, especially for Premium Lite users.

**Kurzbeschreibung:** Blendet das wiederkehrende YouTube-Premium-Upgrade-Popup gezielt aus. Für Brave und Chrome, ohne Tracking.

## Installation

1. Download this repository using **Code → Download ZIP** and extract it.
2. Open `brave://extensions` or `chrome://extensions`.
3. Enable **Developer mode / Entwicklermodus**.
4. Choose **Load unpacked / Entpackte Erweiterung laden** and select the **extension** folder containing `manifest.json`.
5. Reload open YouTube tabs. Keep the folder in place afterwards.

## What it does

- Recognizes “Noch bessere Qualität – mit Premium”, or a Premium logo combined with at least two specific German/English benefit statements.
- Tries the dialog's close/dismiss button first, otherwise hides the dialog.
- Hides YouTube's overlay backdrop only when no unrelated dialog is open.
- Handles dynamically added and reused dialogs and YouTube navigation.

It runs only on `https://www.youtube.com/*` and `https://m.youtube.com/*`. It does not unlock subscription features, block video ads, or modify your subscription.

## Privacy

No analytics, remote code, network requests, persistent storage, or additional extension API permissions. Dialog text and image URLs are inspected locally solely to identify the upgrade prompt. See [Privacy policy](PRIVACY.md).

## Development

Node.js 20 or newer is recommended.

```sh
npm install
npx playwright install chromium
npm test
```

You may set `TEST_BROWSER_PATH` to a local Brave/Chrome executable instead of downloading Chromium. The tests use synthetic dialogs in an isolated browser; they do not access your YouTube account. Actual account-specific behavior still needs verification. YouTube may change its markup or wording; closed shadow roots and additional internal modal locks may require future changes.

Build a Chrome Web Store upload ZIP on Windows:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package.ps1
```

The resulting `dist/youtube-lite-popup-blocker.zip` contains `manifest.json` at its root. See [store preparation](store/STORE.md) for listing copy and remaining publication steps. This project has not been published in the Chrome Web Store.

## Issues

If a dialog is missed, report its exact text, browser version, and YouTube language. Avoid sharing account details or private screenshots. Contributions are welcome.

## License and affiliation

MIT © 2026 ChristopherManzi. Independent project; not affiliated with or endorsed by YouTube or Google. YouTube and Google are trademarks of their respective owners.
