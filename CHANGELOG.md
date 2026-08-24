# Changelog

## 1.0.0 — 2026-08-24

First tagged version. The generator itself has not changed; everything around it has.

- English README, Turkish moved to `README.tr.md`, both with the rejection-sampling and entropy
  reasoning written out instead of asserted.
- Documented the two limits that were previously silent: the 92-word passphrase list is 6.5 bits per
  word, and the 15-second clipboard clear is refused by the browser if the tab is not focused.
- Content Security Policy of `default-src 'none'` set in the document, so the "no network" claim is
  enforced by the page and not just by my word.
- Favicon, OpenGraph tags and a page description.
- Fixed the header tagline staying Turkish after switching to English.
- CI greps for `Math.random` and for any external reference on every push.
- Security policy, live demo on GitHub Pages, banner and screenshots.
