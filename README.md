# İMKANSIZ — kurulum ve yayınlama

Bu klasör **derleme gerektirmez** (Node.js, npm yok). Düz HTML + JS dosyalarıdır; Kindle dahil her tarayıcıda çalışır.

## 1) Deneme (bilgisayarında)
`index.html` dosyasına çift tıkla. Oyun açılır, yedek 150 kelime ile çalışır.
(Büyük kelime listesi `words.json` yalnızca bir web sitesinde yüklenir; dosyadan açınca tarayıcı engeller.)

## 2) İnternete koy (GitHub Pages, ücretsiz)
1. github.com → **New repository** → adı `imkansiz`, Public → Create.
2. **Add file → Upload files**: bu klasördeki `index.html`, `style.css`, `js` klasörü (içindekilerle) ve `words.json` dosyasını sürükle. Commit et.
3. Repo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `(root)` → Save.
4. 1-2 dakika sonra adres: `https://KULLANICI_ADIN.github.io/imkansiz/`

## 3) Büyük kelime listesi (words.json)
1. https://kaikki.org/dictionary/Turkish/ sayfasından **Turkish JSONL** dosyasını indir (`kaikki.org-dictionary-Turkish.jsonl`).
2. Python 3 kurulu olmalı. Terminalde:
   `python tools/build_words.py kaikki.org-dictionary-Turkish.jsonl words.json 20000`
3. Çıkan `words.json` dosyasını repoya `index.html`'in yanına yükle. Oyun onu otomatik bulur (LAB → Otomatik testler "words.json" yazar).

Kelime verisi Vikisözlük'ten (CC BY-SA); oyunun menüsünde kaynak yazısı var, silme.

## Kullanım
- **Tab / tıklama**: aktif kartı seç. Yazdığın cevap aktif karta gider. **Enter**: gönder.
- **Ok tuşları, SPACE**: ilgili kartlara doğrudan gider. **ESC**: duraklat.
- **KINDLE** düğmesi: siyah-beyaz, animasyonsuz, saniyede 1 kare; ses/refleks/renk/N-geri görevleri kapanır, süreler ×1,5.
- **LAB**: her görevi istediğin seviyede, stres olmadan dene; "Otomatik testler" düğmesi sistemi kontrol eder.
- İlerleme ve uzun hafıza destesi tarayıcının localStorage'ında (`im2`) saklanır.
