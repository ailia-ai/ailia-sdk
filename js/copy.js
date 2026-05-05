// Adds a "Copy" button to every <pre><code> block on the page.
// Idempotent: the button is only added once per <pre>.
(function () {
  const LABEL = "Copy";
  const COPIED = "Copied";

  function attach(pre) {
    if (pre.querySelector(':scope > .code-copy-btn')) return;
    const code = pre.querySelector('code');
    if (!code) return;

    pre.classList.add('has-copy-btn');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.textContent = LABEL;
    btn.setAttribute('aria-label', 'Copy code to clipboard');

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
      btn.textContent = COPIED;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = LABEL;
        btn.classList.remove('copied');
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
