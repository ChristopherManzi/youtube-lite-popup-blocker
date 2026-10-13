# Chrome Web Store preparation

## Listing copy (German)

Name: YouTube Lite Popup Blocker

Short description: Blendet wiederkehrende Premium-Upgrade-Popups auf YouTube aus. Für ungestörteres Schauen, ohne Tracking.

Detailed description:

YouTube Lite Popup Blocker erkennt das wiederkehrende Premium-Upgrade-Fenster auf YouTube und schließt oder versteckt es automatisch. Die Erweiterung richtet sich insbesondere an Nutzer von YouTube Premium Lite, die häufig zum Upgrade aufgefordert werden.

Erkannt wird die deutsche Überschrift „Noch bessere Qualität – mit Premium“ oder die Kombination aus Premium-Logo und passenden Vorteilstexten auf Deutsch oder Englisch. Andere Dialogfenster sollen geöffnet bleiben.

Die Erweiterung arbeitet lokal im Browser, ohne Tracking, Analyse, Datenspeicherung oder externe Anfragen. Sie ist ausschließlich auf www.youtube.com und m.youtube.com aktiv.

Sie schaltet keine kostenpflichtigen Funktionen frei und verändert das Abonnement nicht. Änderungen an YouTube können Anpassungen erforderlich machen.

Unabhängiges Projekt, nicht mit YouTube oder Google verbunden und nicht von ihnen unterstützt.

## Privacy tab

Single purpose: Wiederkehrende Premium-Upgrade-Dialoge auf YouTube automatisch erkennen und schließen oder ausblenden.

Website access justification: Der Zugriff auf www.youtube.com und m.youtube.com ist erforderlich, um lokal die DOM-Inhalte von Dialogfenstern zu prüfen und ausschließlich passende Upgrade-Fenster zu schließen oder auszublenden.

Remote code: No. All executable code is included in the extension package.

Data collection: No user data collected or transmitted. Dialog contents are temporarily processed locally, as explained in the policy. Make all dashboard declarations consistent with the actual version submitted.

Privacy policy URL: https://github.com/ChristopherManzi/youtube-lite-popup-blocker/blob/main/PRIVACY.md

Homepage: https://github.com/ChristopherManzi/youtube-lite-popup-blocker

Support: https://github.com/ChristopherManzi/youtube-lite-popup-blocker/issues

## Reviewer test instructions

Install the extension and open YouTube with its interface language set to German. When YouTube shows the Premium upgrade dialog with “Noch bessere Qualität – mit Premium”, the extension should dismiss or hide it. The prompt is controlled by YouTube and may depend on account/subscription/rollout. No credentials are provided or required by the extension. Synthetic regression tests are in tests/dialogs.cjs; those are not proof of live account behavior.

## Still required before submission

1. Verify the actual prompt on the affected account in Brave and Chrome, including seeking, navigation and unrelated dialogs.
2. Register a Chrome Web Store developer account, pay Google's one-time registration fee and complete the account requirements shown in the dashboard.
3. Build the package using scripts/package.ps1 and upload the resulting ZIP; manifest.json must be at the ZIP root.
4. Supply at least one genuine screenshot (1280×800 or 640×400) showing the extension's behavior, plus a 440×280 promotional image. A 128×128 extension icon is included.
5. Fill in the listing, privacy disclosures and distribution settings, then submit for Google's review. Approval is Google's decision and cannot be guaranteed.

Official references (checked 2026-10-13):
- https://developer.chrome.com/docs/webstore/register
- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/images

## GitHub About metadata

Description: Privacy-friendly Chrome/Brave extension that dismisses recurring YouTube Premium upgrade popups for Premium Lite users.

Topics: youtube, youtube-premium, premium-lite, chrome-extension, brave-extension, manifest-v3, popup-blocker, privacy, javascript
