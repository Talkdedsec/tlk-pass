# TLK Pass

Secure, offline password generator in a **single HTML file**. No build, no server, no dependencies — everything runs on your device using the Web Crypto API.

> Güvenli, çevrimdışı şifre üreteci — tek bir HTML dosyası. Kurulum yok, sunucu yok, bağımlılık yok.

## Features / Özellikler

- 🔐 **Cryptographically secure** — `crypto.getRandomValues` with rejection sampling (no modulo bias)
- 🎛️ **Three modes** — characters, passphrase, PIN
- 📊 **Live strength** — real entropy (bits) + estimated crack time
- 📦 **Bulk generation** — 1 / 5 / 10 at once, copy one or copy all
- 🧹 **Clipboard auto-clear** — wipes the copied password after 15s
- 🌍 **TR / EN** interface, preferences saved locally
- ⌨️ **Shortcuts** — `Enter` reroll, `Ctrl+C` copy
- 🎨 Dark, premium UI — zero telemetry, fully offline

## Usage / Kullanım

Just open `index.html` in any modern browser. That's it.

`index.html` dosyasını herhangi bir tarayıcıda aç, hepsi bu.

## Security / Güvenlik

- Randomness comes only from the OS CSPRNG via Web Crypto — never `Math.random()`.
- Nothing leaves the browser; there are no network requests.
- Character mode guarantees at least one character from each selected set, then shuffles.

## License

[MIT](LICENSE) © talkdedsec
