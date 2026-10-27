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

## Yanlış cevap ve kayıtlar (YENİ)
- **Doğru cevap gösterilir**: yanlış seçim, süre aşımı veya erken/geç basış sonrası kart 3,5 sn ekranda kalır; altında "Doğrusu: …" yazar. Seçenekli kartlarda doğru seçenek yeşil, senin seçimin kırmızı olur. (Yazılı cevapta yanlış deneme kartı düşürmez, bu yüzden cevap o anda gösterilmez; kart düşünce görünür.)
- **Her oyun otomatik kaydedilir** (bitti / kazandın / yarım bıraktın). Menü → **KAYITLAR**. Kayıt sadece tohum + tuş/dokunuş olaylarıdır (birkaç KB), localStorage'da `imr:*` anahtarlarında durur. Depolama dolarsa en eski kayıt silinir; **DIŞA AKTAR / İÇE AKTAR** ile yedek al.
- **Tekrar izleme**: oyun aynı tohumla yeniden oynatılır, bu yüzden aynı kartlar ve aynı animasyonlar gelir. Çubukla ileri-geri sar, 0,25×–8× hız, "önceki/sonraki hata" düğmeleri (kırmızı çizgiler hataları gösterir).
- **Duraklatınca**: her kartta 👁 Cevap düğmesi, yazılı kartlarda deneme kutusu, seçenekli kartlarda seçeneklere tıklayıp doğru/yanlış görme. Bunlar oyunu etkilemez. "Duraklatınca cevabı göster" kutusu tüm cevapları otomatik açar.
- Kısayollar: SPACE oynat/duraklat, ←/→ ±2 sn, ESC çık.
- Not: `words.json` değiştirirsen eski kayıtlarda kelimeler farklı çıkabilir (uyarı gösterilir). LAB oyunları kaydedilmez.

## Denge (v3)
- **Stres**: yanlış cevap ya da süre aşımı +20 (5 hata = oyun biter), doğru cevap -5. Kendiliğinden azalma yok; boş durursan 5 kartta biter.
- **Seviye süresi** 30 sn × seviye numarası. Süreye dayanınca sonraki seviye açılır ama oyun bitmez, stres %100 olana kadar (ya da ☰ → SONRAKİ SEVİYE / MENÜ diyene kadar) sürer.
- **Matematik** daha yavaş yükselir (seviye 100'de bile türev gibi zor konular karışık gelir), kartlara daha çok süre verilir.
- **Çeşitlilik**: Farklı olan / Çağrışım için 44 kategori ve ~1100 kelime (`js/data.js`), Hızlı yazı için 136 cümle, Renk-kelime için 10 renk.
