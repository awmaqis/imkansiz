# İMKANSIZ v2

Derleme yok: düz HTML + JS. GitHub Pages'e `index.html`, `style.css`, `js/` (9 dosya: i18n, math, words, data, tasks, **tasks2**, replay, main) ve varsa `words.json` yüklenir.

## v2 ile gelenler
- **27 görev** (7 yeni): Karşılaştır (karar hızı), Ek ustası (Türkçe ünlü uyumu: -lar/-ler, -da/-ta, -dan/-tan, -a/-ya, -ı/-i/-u/-ü), Zincir hesap (çalışma belleği + aritmetik), Kelime listesi (sözel bellek), Pusula (uzamsal yönelim), Kart eşleştir (görsel+sözel bellek), Işıklar (mantık/planlama).
- **Skor ve seri**: art arda doğrular çarpan (×5'e kadar) ve ekstra stres iyileşmesi verir. Rekor kaydedilir.
- **Denge**: yazım hatası +10 stres (eskiden +20, hem hata hem kart kalıyordu); süre aşımı/yanlış seçim +20. Her oyunun ilk 45 saniyesi ısınmadır (daha az kart). Stres yüksekse kartlar biraz seyrekleşir, düşükse sıklaşır. Aynı görev art arda gelmez.
- **İstatistikler**: menüden. Beceri alanı (matematik, dil, hafıza, dikkat, uzamsal, refleks, mantık) doğrulukları, görev başına ortalama süre, uzun hafıza destesi (kaç kelime, tekrarı gelen, pekişmiş).
- **Görünüm**: kategori renkleri ve simgeler, yeni menü, stres yüksekken kırmızı nabız çerçevesi, +puan efekti, ses efektleri (♪ düğmesiyle kapat), titreşim (telefon). Kindle'da hepsi sade siyah-beyaz.
- Kayıtlar (replay) aynen çalışır; yeni görevler de tekrarlanabilir.

## Notlar
- `words.js` açılışta `raw.githubusercontent.com/awmaqis/amisa` adresinden sözlük verisi çeker (başarısız olursa `words.json`, o da yoksa yedek liste). Bu verinin lisansını/kullanım iznini kontrol et.
- LAB → "Otomatik testler" tüm görevleri 1/50/100. seviyede üretip kontrol eder.
