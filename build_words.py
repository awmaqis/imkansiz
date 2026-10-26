#!/usr/bin/env python3
"""kaikki.org Türkçe sözlük dosyasından words.json üretir.
Kullanım:  python build_words.py kaikki.org-dictionary-Turkish.jsonl words.json [en_fazla_kelime]
Çıktı:     [["kitap","book","volume"], ["gelmek","to come","to arrive"], ...]   (tr, en, alternatif|alternatif)"""
import json, random, re, sys
src, out = sys.argv[1], sys.argv[2]
limit = int(sys.argv[3]) if len(sys.argv) > 3 else 20000
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
    if e.get("pos") not in POS or w in seen or not LET.match(w):
        continue
    gl = []
    for s in e.get("senses", []):
        if set(s.get("tags", [])) & BAD or s.get("form_of") or s.get("alt_of"):
            continue
        for g in s.get("glosses", []):
            g = re.sub(r"\s*\([^)]*\)", "", g).strip().rstrip(".")
            if 0 < len(g) <= 30 and ";" not in g and "," not in g and g.lower() not in [x.lower() for x in gl]:
                gl.append(g)
    if not gl:
        continue
    if e["pos"] == "verb" and not gl[0].startswith("to "):
        gl = ["to " + g for g in gl]
    seen.add(w)
    res.append([w, gl[0], "|".join(gl[1:4])])
random.seed(7)
random.shuffle(res)
res = res[:limit]
json.dump(res, open(out, "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
print(len(res), "kelime yazıldı ->", out)
