# TLK Pass

Tek bir HTML dosyasından ibaret şifre üreteci. Kurulum, sunucu ya da bağımlılık yok; her şey tarayıcıda, Web Crypto ile çalışıyor.

## Ne yapar

- Karakter, parola cümlesi ve PIN modu
- Rastgelelik `crypto.getRandomValues`'tan gelir (rejection sampling, modulo bias yok)
- Entropi (bit) ve tahmini kırılma süresini anlık gösterir
- Tek seferde 1 / 5 / 10 üretim, tek tek ya da toplu kopyalama
- Kopyalanan şifreyi 15 sn sonra panodan siler
- TR / EN arayüz, tercihler tarayıcıda saklanır
- `Enter` yeniler, `Ctrl+C` kopyalar

## Kullanım

`index.html`'i tarayıcıda aç. Hepsi bu.

## Not

Rastgelelik yalnızca işletim sisteminin CSPRNG'sinden gelir, `Math.random()` hiç kullanılmaz. Hiçbir ağ isteği yok, veri cihazdan çıkmaz.

## Lisans

[MIT](LICENSE)
