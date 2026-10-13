(() => {
  'use strict';

  const DIALOGS = 'tp-yt-paper-dialog, ytd-dialog-renderer, yt-dialog-view-model, [role="dialog"], dialog';
  const BLOCKED = 'data-yt-lite-blocked';
  const BACKDROP = 'data-yt-lite-backdrop';
  const attempted = new WeakSet();
  const normalize = value => (value || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();

  function isUpgrade(dialog) {
    const text = normalize(dialog.textContent);
    if (/noch bessere qualität\s*[–—-]?\s*mit premium/.test(text)) return true;
    const premiumLogo = Array.from(dialog.querySelectorAll('img')).some(img =>
      /\/youtube\/img\/unlimited\/ytu_.*premium_logo/i.test(img.getAttribute('src') || '')
    );
    const benefits = [
      /(?:youtube und youtube music ohne werbeunterbrechungen|ad.free youtube and youtube music)/,
      /(?:videos für offlinewiedergabe herunterladen|download videos to watch offline)/,
      /(?:videos im hintergrund abspielen|play videos in the background)/
    ].filter(pattern => pattern.test(text)).length;
    return premiumLogo && benefits >= 2;
  }

  function isOpen(dialog) {
    if (dialog.hidden || dialog.getAttribute('aria-hidden') === 'true') return false;
    if (dialog.tagName === 'DIALOG' && !dialog.open) return false;
    // Our own CSS hides matching dialogs, so retain their active state until YouTube closes them.
    if (dialog.hasAttribute(BLOCKED)) {
      return dialog.style.display !== 'none' && dialog.style.visibility !== 'hidden' &&
        !(dialog.tagName === 'TP-YT-PAPER-DIALOG' && !dialog.hasAttribute('opened'));
    }
    return dialog.getClientRects().length > 0 && getComputedStyle(dialog).visibility !== 'hidden';
  }

  function closeButton(dialog) {
    return Array.from(dialog.querySelectorAll('button, [role="button"], tp-yt-paper-button')).find(button => {
      const label = normalize(button.getAttribute('aria-label') || button.getAttribute('title') || button.textContent);
      return /^(schließen|schliessen|close|dismiss|nein danke|no thanks|nicht jetzt|not now|später|maybe later|überspringen|skip)[.!]?$/.test(label);
    });
  }

  let queued = false;
  function scan() {
    queued = false;
    const all = Array.from(document.querySelectorAll(DIALOGS));
    // Prefer the actual modal shell over renderers nested inside it.
    const shells = all.filter(dialog => !dialog.parentElement?.closest(DIALOGS));
    const targets = [];
    for (const dialog of shells) {
      if (!isUpgrade(dialog) || !isOpen(dialog)) {
        dialog.removeAttribute(BLOCKED);
        attempted.delete(dialog);
        continue;
      }
      if (!dialog.hasAttribute(BLOCKED)) dialog.setAttribute(BLOCKED, 'true');
      if (!attempted.has(dialog)) {
        attempted.add(dialog);
        const button = closeButton(dialog);
        if (button) button.click();
        else if (dialog.tagName === 'DIALOG' && dialog.open) dialog.close();
      }
      if (isOpen(dialog)) targets.push(dialog);
      else dialog.removeAttribute(BLOCKED);
    }

    // Never hide a backdrop while a different modal is still open.
    const otherOpen = shells.some(dialog => !targets.includes(dialog) && isOpen(dialog));
    const blockBackdrop = targets.length > 0 && !otherOpen;
    for (const backdrop of document.querySelectorAll('tp-yt-iron-overlay-backdrop, [data-yt-lite-backdrop]')) {
      if (blockBackdrop && (backdrop.hasAttribute('opened') || backdrop.hasAttribute(BACKDROP))) {
        if (!backdrop.hasAttribute(BACKDROP)) backdrop.setAttribute(BACKDROP, 'true');
      } else if (backdrop.hasAttribute(BACKDROP)) backdrop.removeAttribute(BACKDROP);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    queueMicrotask(scan);
  }

  new MutationObserver(schedule).observe(document, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['opened', 'open', 'hidden', 'aria-hidden', 'style', 'class', 'src']
  });
  document.addEventListener('yt-navigate-finish', schedule);
  document.addEventListener('yt-popup-opened', schedule);
  schedule();
})();
