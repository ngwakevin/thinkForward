"use client";
import { useEffect, useState } from 'react';

// Lightweight dynamic import of Giscus script. User must configure repo details below.
export default function Giscus() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (document.getElementById('giscus-script')) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.id = 'giscus-script';
    s.async = true;
    // TODO: Replace these placeholders with your actual repo details.
    s.setAttribute('data-repo', 'YOUR_GITHUB_USERNAME/YOUR_REPO');
    s.setAttribute('data-repo-id', 'REPO_ID');
    s.setAttribute('data-category', 'General');
    s.setAttribute('data-category-id', 'CATEGORY_ID');
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'bottom');
    s.setAttribute('data-theme', window.document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    s.setAttribute('data-lang', 'en');
    s.crossOrigin = 'anonymous';
    s.onload = () => setLoaded(true);
    document.getElementById('giscus-container')?.appendChild(s);
  }, []);

  // Theme sync if user toggles theme (listens for class changes)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow?.postMessage({ giscus: { setConfig: { theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' } } }, 'https://giscus.app');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Comments</h2>
      <div id="giscus-container" className="border border-border/60 rounded-xl p-4 bg-bg-alt/40">
        {!loaded && <div className="text-sm text-fg-muted">Loading comments...</div>}
      </div>
      <p className="mt-3 text-[10px] text-fg-muted/70">Powered by GitHub Discussions via Giscus.</p>
    </div>
  );
}
