// Adds a "Copy" button to every <pre><code> block on the page.
// Idempotent: the button is only added once per <pre>.
(function () {
  const COPY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  function attach(pre) {
    if (pre.querySelector(':scope > .code-copy-btn')) return;
    const code = pre.querySelector('code');
    if (!code) return;

    pre.classList.add('has-copy-btn');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.innerHTML = COPY_SVG;
    btn.setAttribute('aria-label', 'Copy code');
    btn.title = 'Copy';

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
      } catch (e) {
        // Fallback for older browsers / file:// pages
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand('copy'); } catch (_) {}
        sel.removeAllRanges();
      }
      btn.innerHTML = CHECK_SVG;
      btn.classList.add('copied');
      btn.setAttribute('aria-label', 'Copied');
      btn.title = 'Copied';
      setTimeout(() => {
        btn.innerHTML = COPY_SVG;
        btn.classList.remove('copied');
        btn.setAttribute('aria-label', 'Copy code');
        btn.title = 'Copy';
      }, 1500);
    });

    pre.prepend(btn);
  }

  function init() {
    document.querySelectorAll('pre > code').forEach(c => attach(c.parentElement));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
