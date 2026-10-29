# İMKANSIZ v2

Derleme yok: düz HTML + JS. GitHub Pages'e `index.html`, `style.css`, `js/` (9 dosya: i18n, math, words, data, tasks, **tasks2**, replay, main) ve varsa `words.json` yüklenir.

## v2 ile gelenler
- **27 görev** (7 yeni): Karşılaştır (karar hızı), Ek ustası (Türkçe ünlü uyumu: -lar/-ler, -da/-ta, -dan/-tan, -a/-ya, -ı/-i/-u/-ü), Zincir hesap (çalışma belleği + aritmetik), Kelime listesi (sözel bellek), Pusula (uzamsal yönelim), Kart eşleştir (görsel+sözel bellek), Işıklar (mantık/planlama).
- **Skor ve seri**: art arda doğrular çarpan (×5'e kadar) ve ekstra stres iyileşmesi verir. Rekor kaydedilir.
- **Denge**: yazım hatası +10 stres (eskiden +20, hem hata hem kart kalıyordu); süre aşımı/yanlış seçim +20. Her oyunun ilk 45 saniyesi ısınmadır (daha az kart). Stres yüksekse kartlar biraz seyrekleşir, düşükse sıklaşır. Aynı görev art arda gelmez.
- **İstatistikler**: menüden. Beceri alanı (matematik, dil, hafıza, dikkat, uzamsal, refleks, mantık) doğrulukları, görev başına ortalama süre, uzun hafıza destesi (kaç kelime, tekrarı gelen, pekişmiş).
- **Görünüm**: kategori renkleri ve simgeler, yeni menü, stres yüksekken kırmızı nabız çerçevesi, +puan efekti, ses efektleri (♪ düğmesiyle kapat), titreşim (telefon).
- Kayıtlar (replay) aynen çalışır; yeni görevler de tekrarlanabilir.

## Notlar
- `words.js` açılışta `raw.githubusercontent.com/awmaqis/amisa` adresinden sözlük verisi çeker (başarısız olursa `words.json`, o da yoksa yedek liste). Bu verinin lisansını/kullanım iznini kontrol et.
- LAB → "Otomatik testler" tüm görevleri 1/50/100. seviyede üretip kontrol eder.

## Küp Rubik: kontroller
- **Fare / parmak sürüklemesi**: küpü döndürür (tek yol). Sürüklediğin yöne döner, ters değil.
- **W A S D** (ÇEVİR): seçili satırı sola/sağa (A/D), seçili sütunu yukarı/aşağı (W/S) çevirir. Ekrana göre çalışır.
- **Ok tuşları** (SEÇ): satır (↑↓) ve sütun (←→) arasında gezer. Küpe tıklayarak da seçilir; numara düğmeleri de var (pembe = satır, turkuaz = sütun).
- **Klavye**: küpün kartına tıkla. Menü → KÜP TUŞLARI ekranından hepsi değiştirilebilir.

## Kindle
Kindle modu tamamen kaldırıldı. Eski Kindle kayıtları (replay) listede gösterilmez.

## JUNIOR (12 yaş altı)
- Başlık çubuğundaki **JUNIOR** düğmesi sayfayı çocuk moduna geçirir; modda aynı düğme **İMKANSIZ** yazar ve normal oyuna döner. İlerleme, istatistik, kelime destesi, rekor ve kayıtlar iki mod için ayrı tutulur (`im2` / `im2j`; seçili mod `im2mode`). Dil ve ses ayarı Junior'a ilk açılışta kopyalanır.
- 30 seviye. Seviye süresi 40 sn + 10 sn × seviye (en çok 5 dk). Aynı anda en çok 4 kart, kartlar seyrek gelir.
- Görevler 18 tanedir ve kademeli açılır: Matematik (sadece 4 işlem), Kelime, Ok dizisi, Farklı olan, Hızlı yazı, Refleks, Karşılaştır, Sayı hafızası, Renk-kelime, Desen hafızası, Kart eşleştir, Nokta sayma, Sayı dizisi, Dikkat tablosu, Pusula, Işıklar, Harf bulmaca. Küp Rubik 6. seviyeden sonra 2×2 olarak gelir. Ağır görevler (N-geri, 3B, uzun hafıza, ek ustası, zincir hesap, ses, çağrışım) yoktur. 10. seviye küp kapıları da yoktur.
- Zorluk normal oyunun yaklaşık %40'ı hızındadır (seviye × 0,4). Süreler 1,8 kat uzun, hatırlanacak şeyler 1,6 kat uzun görünür. Süre aşımı +10 (normalde +20), yazım hatası +4 (normalde +10), doğru cevap 3 puan daha fazla rahatlatır.
