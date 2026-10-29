#!/usr/bin/env python3
"""kaikki.org Türkçe sözlük dosyasından words.json üretir.
Kullanım:  python build_words.py kaikki.org-dictionary-Turkish.jsonl words.json [en_fazla_kelime] [sıklık_listesi.txt]
Sıklık listesi (öneri: hermitdave/FrequencyWords tr_50k.txt, satır = "kelime sayı") verilirse zorluk = nadirlik olur
ve en sık kelimeler seçilir; verilmezse zorluk kelime uzunluğuna göre tahmin edilir.
Çıktı:     [["kitap","book","volume"], ["gelmek","to come","to arrive"], ...]   (tr, en, alternatif|alternatif, zorluk 0-99)"""
import json, random, re, sys
src, out = sys.argv[1], sys.argv[2]
limit = int(sys.argv[3]) if len(sys.argv) > 3 else 20000
rank = {}
if len(sys.argv) > 4:
    for i, l in enumerate(open(sys.argv[4], encoding='utf8')):
        k = l.split()[0].lower() if l.split() else ''
        rank.setdefault(k, i)
POS = {"noun", "verb", "adj", "adv"}
BAD = {"form-of", "alt-of", "misspelling", "obsolete", "archaic", "dialectal", "rare", "vulgar", "slang"}
LET = re.compile(r"^[a-zçğıöşüâîû]{3,14}$")
seen, res = set(), []
for line in open(src, encoding="utf8"):
    try:
        e = json.loads(line)
    except ValueError:
        continue
    w = e.get("word", "")
    if e.get("lang_code", "tr") != "tr":
        continue
    if e.get("pos") not in POS or w in seen or not LET.match(w):
        continue
    gl = []
    for s in e.get("senses", []):
        if set(s.get("tags", [])) & BAD or s.get("form_of") or s.get("alt_of"):
            continue
        for g in s.get("glosses", []):
            g = re.sub(r"\s*\([^)]*\)", "", g).strip().rstrip(".")
            if re.search(r"[çğıöşüÇĞİÖŞÜ]", g):
                continue  # İngilizce açıklamada Türkçe harf olmaz: yanlış (Türkçe Vikisözlük) dosya
            if 0 < len(g) <= 30 and ";" not in g and "," not in g and g.lower() not in [x.lower() for x in gl]:
                gl.append(g)
    if not gl:
        continue
    if e["pos"] == "verb" and not gl[0].startswith("to "):
        gl = ["to " + g for g in gl]
    seen.add(w)
    res.append([w, gl[0], "|".join(gl[1:4]), 0])
if len(res) < 500:
    sys.exit("HATA: sadece %d kelime çıktı. Yanlış dosyayı indirmiş olabilirsin: İngilizce Vikisözlük'ün Türkçe kelimeler dosyası lazım "
             "(kaikki.org/dictionary/Turkish, açıklamalar İngilizce)." % len(res))
random.seed(7)
random.shuffle(res)
if rank:
    res.sort(key=lambda r: rank.get(r[0], 10**9))
    res = res[:limit]
    top = max(1, max((rank[r[0]] for r in res if r[0] in rank), default=1))
    for r in res:
        r[3] = min(99, int(rank[r[0]] * 99 / top)) if r[0] in rank else 99
else:
    res = res[:limit]
    for r in res:
        r[3] = min(99, len(r[0]) * 7 + (5 if r[2] == "" else 0))
json.dump(res, open(out, "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(len(res), "kelime yazıldı ->", out)
