#!/usr/bin/env python3
import os, re, json
from html.parser import HTMLParser
ROOT = os.getcwd(); DOMAIN = "synchro-vie.com"
BAD = ["strèss","Strèss","mesûres","Europe et Europe","à l'Europe et à l'Europe"]
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.title=""; s._it=False; s.metas=[]
        s.canon=None; s.hf=[]; s.jt=[]; s.jraw=[]
        s.h1=[]; s.h2=[]; s.h3=[]; s._ch=None; s._chb=[]
        s.links=[]; s.imgs=[]; s._js=False; s._jb=[]; s._scr=False; s._inj=False
    def handle_starttag(s,t,a):
        d=dict(a)
        if t=="title": s._it=True
        elif t=="meta": s.metas.append((d.get("name") or d.get("property") or "", d.get("content","")))
        elif t=="link" and d.get("rel")=="canonical": s.canon=d.get("href")
        elif t=="link" and d.get("hreflang"): s.hf.append((d.get("hreflang"),d.get("href")))
        elif t=="script":
            s._scr=True
            if "ld+json" in (d.get("type") or ""): s._inj=True; s._jb=[]
            elif d.get("src"): s.links.append(d["src"])
        elif t in ("h1","h2","h3"): s._ch=t; s._chb=[]
        elif t=="a" and d.get("href"): s.links.append(d["href"])
        elif t=="img": s.imgs.append(d.get("alt"))
    def handle_endtag(s,t):
        if t=="title": s._it=False
        elif t=="script":
            s._scr=False
            if s._inj:
                raw="".join(s._jb).strip(); s._inj=False; s.jraw.append(raw)
                try:
                    data=json.loads(raw)
                    if isinstance(data,dict):
                        if "@graph" in data: s.jt.append([g.get("@type") for g in data["@graph"]])
                        else: s.jt.append(data.get("@type"))
                    elif isinstance(data,list): s.jt.append([d.get("@type") for d in data])
                except Exception: s.jt.append("JSON_INVALIDE")
        elif t in ("h1","h2","h3") and s._ch==t:
            txt=" ".join("".join(s._chb).split())
            {"h1":s.h1,"h2":s.h2,"h3":s.h3}[t].append(txt); s._ch=None
    def handle_data(s,x):
        if s._it: s.title+=x
        if s._scr:
            if s._inj: s._jb.append(x)
            return
        if s._ch: s._chb.append(x)
res=[]
for dp,dns,fs in os.walk(ROOT):
    dns[:]=[d for d in dns if d not in (".git","node_modules","assets","download")]
    for f in sorted(fs):
        if not f.endswith(".html"): continue
        path=os.path.join(dp,f); rel=os.path.relpath(path,ROOT)
        src=open(path,encoding="utf-8",errors="replace").read()
        p=P(); p.feed(src)
        nohead=re.sub(r"<head[\s\S]*?</head>"," ",src,flags=re.I)
        nojs=re.sub(r"<(script|style)[\s\S]*?</\1>"," ",nohead,flags=re.I)
        txt=re.sub(r"<[^>]+>"," ",nojs)
        wc=len(re.findall(r"[\wÀ-ÿ'’-]+",txt))
        issues=[]
        if not src.lstrip().lower().startswith("<!doctype html"): issues.append("DOCTYPE_ABSENT")
        if not p.canon: issues.append("CANONICAL_ABSENT")
        elif DOMAIN not in p.canon: issues.append("CANONICAL_PAS_ABSOLU: "+p.canon)
        for w in BAD:
            if w in src: issues.append("MOT_INTERDIT: "+w)
        if "github.io" in src: issues.append("TRACE_GITHUB.IO")
        relh=[h for h in p.links if h.endswith(".html") and not h.startswith("http")]
        res.append({"fichier":rel,"titre":" ".join(p.title.split()),
        "meta_desc":next((c for k,c in p.metas if k.lower()=="description"),"ABSENT"),
        "robots":next((c for k,c in p.metas if k.lower()=="robots"),""),
        "gverif":"oui" if any(k.lower()=="google-site-verification" for k,_ in p.metas) else "NON",
        "og_title":next((c for k,c in p.metas if k.lower()=="og:title"),""),
        "og_img":next((c for k,c in p.metas if k.lower()=="og:image"),""),
        "canonical":p.canon,"hreflang":p.hf,"jsonld_types":p.jt,
        "h1":p.h1,"h2":p.h2,"nb_h3":len(p.h3),
        "liens_blog":sum(1 for h in p.links if "/blog/" in h),
        "liens_produits":sum(1 for h in p.links if "/produits/" in h),
        "liens_relatifs":relh[:8],
        "img_sans_alt":sum(1 for a in p.imgs if not a),
        "prices_jsonld":re.findall(r'"price"\s*:\s*"?([\d.]+)',src),
        "nb_mots":wc,"anomalies":issues})
print("="*72); print("AUDIT SYNCHROVIE —",len(res),"fichiers HTML — SORTIE BRUTE"); print("="*72)
for r in res:
    print("-"*72); print(json.dumps(r,ensure_ascii=False,indent=1))
