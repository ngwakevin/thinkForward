"use client";
import { useEffect } from 'react';

export function useReveal(selector = '.reveal', visibleClass = 'reveal-visible') {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach(el => el.classList.add(visibleClass));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add(visibleClass);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [selector, visibleClass]);
}
