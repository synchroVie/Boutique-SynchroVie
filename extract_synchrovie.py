#!/usr/bin/env python3
import os, re, glob
targets = sorted(glob.glob("blog/*.html")) + sorted(glob.glob("produits/*.html")) + [
 "index.html","blog.html","faq.html","contact.html","propos.html",
 "promotions.html","commander.html","404.html"]
seen=set()
for path in targets:
    if not os.path.exists(path) or path in seen: continue
    seen.add(path)
    src=open(path,encoding="utf-8",errors="replace").read()
    jsonlds=re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>([\s\S]*?)</script>',src,flags=re.I)
    body=re.sub(r"<head[\s\S]*?</head>"," ",src,flags=re.I)
    body=re.sub(r"<(script|style|nav|footer)[\s\S]*?</\1>"," ",body,flags=re.I)
    text=re.sub(r"<[^>]+>","\n",body)
    text=re.sub(r"[ \t]+"," ",text); text=re.sub(r"\n\s*\n+","\n",text).strip()
    wc=len(re.findall(r"[\wÀ-ÿ'’-]+",text))
    print("="*72)
    print("FICHIER:",path)
    print("URL: https://synchro-vie.com/"+path)
    print("NB_MOTS:",wc)
    print("BLOCS_JSONLD:",len(jsonlds))
    for j in jsonlds:
        print("---JSONLD---"); print(j.strip()[:8000])
    print("---TEXTE---")
    print(text)
