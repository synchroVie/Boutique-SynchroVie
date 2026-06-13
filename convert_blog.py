#!/usr/bin/env python3
"""
Convert all 19 SynchroVie blog pages from dark cyan design to Claude's Gold/Cream/Indigo luxury design.

PRESERVES: All article content, meta tags, OG tags, schema.org, gtag.js, canonical URLs, internal links
CHANGES: CSS, fonts, and HTML wrapper (header, footer, trust bar, breadcrumb, etc.)
"""

import os
import re
from bs4 import BeautifulSoup, Comment

BLOG_DIR = '/home/z/my-project/Boutique-SynchroVie/blog'

BLOG_FILES = [
    'abonnement-bague-connectee-donnees-sante.html',
    'vfc-variabilite-frequence-cardiaque-biomarqueur-longevite.html',
    'performance-physique-stimulation-ems.html',
    'guide-bague-connectee-biometrique.html',
    'glycemie-sans-piqure-analyseur-non-invasif.html',
    'technologies-neuro-sommeil-2026.html',
    'balance-impedancemetre-comprendre-composition-corporelle.html',
    'bio-monitoring-sante-connectee-erreur-diagnostic.html',
    'sommeil-profond-90-premieres-minutes.html',
    'tension-arterielle-connectee-5-erreurs-mesures.html',
    'nerf-vague-stopper-crise-angoisse.html',
    'biofeedback-gestion-stress-rythme-cardiaque.html',
    'optimisation-sommeil-profond-micro-reveils.html',
    'photobiomodulation-irradiance-panneau-led.html',
    'biohacking-performance-physique-respiration-nasale.html',
    'recuperation-musculaire-technologies-pointe-athletes.html',
    'correcteur-posture-haptique-reeduquer-dos-intelligemment.html',
    'surveiller-coeur-domicile-moniteur-ecg-portable.html',
    'bague-controle-cortisol-stress-invisible-mesurable.html',
]

# ==============================================================================
# CLAUDE'S DESIGN CSS
# ==============================================================================
CLAUDE_CSS = r"""
/* ===== RESET & BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: var(--cream);
  color: var(--text);
  line-height: 1.7;
  font-size: 16px;
  overflow-x: hidden;
}
img { max-width: 100%; height: auto; display: block; }
a { color: var(--gold); text-decoration: none; transition: color 0.25s, opacity 0.25s; }
a:hover { color: #a8843f; }
ul, ol { padding-left: 1.5rem; }

/* ===== VARIABLES ===== */
:root {
  --navy: #0B1B3D;
  --navy-soft: #1a2d58;
  --indigo: #1e1b4b;
  --gold: #C9A96E;
  --gold-light: #e8d5b0;
  --cream: #F7F4EE;
  --white: #FFFFFF;
  --text: #1a1a2e;
  --text-soft: #4a5568;
  --border: #e2ddd5;
  --green-ok: #2d6a4f;
  --green-bg: #d8f3dc;
  --violet: #6d28d9;
  --violet-soft: #ede9fe;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 20px;
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.06);
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== TRUST STRIP ===== */
.trust-strip {
  background: var(--indigo);
  border-bottom: 1px solid rgba(201, 169, 110, 0.15);
  padding: 10px 16px;
  font-size: 0.8rem;
  color: var(--gold-light);
}
.trust-strip-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}
.trust-strip-item {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.trust-strip-item svg { flex-shrink: 0; }

/* ===== HEADER ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  transition: var(--transition);
}
.site-header.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--navy);
}
.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--navy);
}
.nav-links { display: flex; gap: 24px; align-items: center; }
.nav-links a {
  color: var(--navy);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--gold); }

/* ===== BREADCRUMB ===== */
.breadcrumb-wrap {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 20px 0;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-soft);
  flex-wrap: wrap;
}
.breadcrumb a { color: var(--text-soft); }
.breadcrumb a:hover { color: var(--gold); }
.breadcrumb .sep { opacity: 0.4; }
.breadcrumb .current { color: var(--gold); }

/* ===== HERO ===== */
.article-hero {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}
.hero-category {
  display: inline-block;
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid rgba(201, 169, 110, 0.3);
  color: var(--gold);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 18px;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.7rem, 4.5vw, 2.6rem);
  font-weight: 600;
  line-height: 1.2;
  color: var(--navy);
  margin-bottom: 16px;
}
.hero-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 0.85rem;
  color: var(--text-soft);
  flex-wrap: wrap;
}
.hero-meta-item { display: flex; align-items: center; gap: 5px; }
.hero-divider {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 20px;
}
.hero-divider hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
}

/* ===== TABLE OF CONTENTS ===== */
.toc-section {
  max-width: 860px;
  margin: 0 auto;
  padding: 28px 20px;
}
.toc-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  box-shadow: var(--shadow-card);
}
.toc-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.toc-list { list-style: none; padding: 0; counter-reset: toc; }
.toc-list li { counter-increment: toc; margin-bottom: 6px; }
.toc-list li a {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--text);
  font-size: 0.9rem;
  padding: 6px 0;
  text-decoration: none;
  transition: color 0.2s, padding-left 0.2s;
}
.toc-list li a::before {
  content: counter(toc, decimal-leading-zero);
  color: var(--gold);
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.82rem;
  flex-shrink: 0;
  min-width: 22px;
}
.toc-list li a:hover { color: var(--gold); padding-left: 4px; }

/* ===== ARTICLE BODY ===== */
.article-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 10px 20px 40px;
}
.article-body h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  font-weight: 600;
  color: var(--navy);
  margin: 48px 0 18px;
  line-height: 1.3;
  scroll-margin-top: 90px;
}
.article-body h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
  font-weight: 600;
  color: var(--indigo);
  margin: 32px 0 12px;
  line-height: 1.4;
  scroll-margin-top: 90px;
}
.article-body p {
  margin-bottom: 18px;
  color: var(--text);
  line-height: 1.8;
}
.article-body strong { color: var(--navy); font-weight: 600; }
.article-body em { font-style: italic; }
.article-body ul, .article-body ol {
  margin: 0 0 20px;
  color: var(--text);
}
.article-body li { margin-bottom: 8px; line-height: 1.7; }
.article-body blockquote {
  border-left: 3px solid var(--gold);
  background: var(--white);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 20px 24px;
  margin: 28px 0;
  font-style: italic;
  color: var(--text-soft);
  box-shadow: var(--shadow-card);
}
.article-body blockquote p { margin-bottom: 8px; }

/* Highlight box */
.highlight-box {
  background: var(--white);
  border-left: 3px solid var(--gold);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 20px 24px;
  margin: 28px 0;
  box-shadow: var(--shadow-card);
}
.highlight-box p { margin-bottom: 0; }

/* Info box (from Structure B pages) */
.info-box {
  background: var(--white);
  border-left: 3px solid var(--gold);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 20px 24px;
  margin: 28px 0;
  box-shadow: var(--shadow-card);
}
.info-box-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 1rem;
  color: var(--gold);
  margin-bottom: 8px;
}
.info-box p { margin-bottom: 8px; font-size: 0.92rem; }
.info-box p:last-child { margin-bottom: 0; }

/* Warning box */
.warning-box {
  background: #FFF8F0;
  border-left: 3px solid #E8913A;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 20px 24px;
  margin: 28px 0;
}
.warning-box p { margin-bottom: 8px; font-size: 0.92rem; }
.warning-box p:last-child { margin-bottom: 0; }

/* Stat callout */
.stat-callout {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px;
  margin: 28px 0;
  box-shadow: var(--shadow-card);
}
.stat-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--gold);
  flex-shrink: 0;
  line-height: 1;
}
.stat-label {
  font-size: 0.92rem;
  color: var(--text);
  line-height: 1.6;
}

/* Stat highlight (from Structure B pages) */
.stat-highlight {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 32px;
  margin: 28px 0;
  text-align: center;
  box-shadow: var(--shadow-card);
}

/* Comparison table */
.comparison-table-wrap {
  overflow-x: auto;
  margin: 28px 0;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  min-width: 560px;
}
.comparison-table th {
  background: var(--navy);
  color: var(--white);
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
}
.comparison-table td {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  color: var(--text);
  background: var(--white);
}
.comparison-table tr:hover td { background: rgba(201, 169, 110, 0.04); }
.comparison-table .best { color: var(--green-ok); font-weight: 600; }

/* Source reference */
.source-ref {
  font-size: 0.78rem;
  color: var(--text-soft);
  display: block;
  margin-top: 4px;
}
.source-ref a { color: var(--gold); font-size: 0.78rem; }

/* Product card (from Structure B pages) */
.product-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin: 28px 0;
  transition: border-color 0.3s, transform 0.2s;
  box-shadow: var(--shadow-card);
}
.product-card:hover { border-color: var(--gold-light); transform: translateY(-2px); }
.product-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.product-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--navy); margin: 0; }
.product-card-subtitle { font-size: 0.85rem; color: var(--text-soft); margin-top: 2px; }
.product-price { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--gold); white-space: nowrap; }
.product-features { list-style: none; padding: 0; margin: 16px 0 20px; }
.product-features li { padding: 6px 0 6px 28px; position: relative; font-size: 0.9rem; color: var(--text); border-bottom: 1px solid var(--border); }
.product-features li::before { content: ''; position: absolute; left: 0; top: 12px; width: 16px; height: 16px; background: rgba(201, 169, 110, 0.15); border-radius: 50%; border: 2px solid var(--gold); }
.product-features li::after { content: ''; position: absolute; left: 5px; top: 17px; width: 6px; height: 3px; border-left: 2px solid var(--gold); border-bottom: 2px solid var(--gold); transform: rotate(-45deg); }

/* ===== CTA BOXES ===== */
.cta-box {
  background: linear-gradient(135deg, var(--indigo) 0%, #2d2a6e 100%);
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  margin: 40px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), transparent);
}
.cta-box-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 10px;
}
.cta-box h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 10px;
}
.cta-box-text {
  color: var(--gold-light);
  font-size: 0.92rem;
  margin-bottom: 20px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}
.cta-box p {
  color: var(--gold-light);
  margin-bottom: 20px;
  font-size: 0.95rem;
}
.cta-box p:last-of-type { margin-bottom: 0; }
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: var(--navy);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  cursor: pointer;
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(201, 169, 110, 0.35);
  color: var(--navy);
}
.cta-button-secondary {
  background: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  margin-left: 12px;
}
.cta-button-secondary:hover {
  background: rgba(201, 169, 110, 0.15);
  box-shadow: 0 8px 24px rgba(201, 169, 110, 0.15);
  color: var(--gold);
}

/* ===== FOOTER ===== */
.site-footer {
  background: var(--navy);
  border-top: 1px solid rgba(201, 169, 110, 0.15);
  padding: 40px 20px 24px;
}
.footer-inner {
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}
.footer-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 12px;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.footer-links a { color: var(--gold-light); font-size: 0.82rem; }
.footer-links a:hover { color: var(--gold); }
.footer-copy {
  font-size: 0.78rem;
  color: rgba(232, 213, 176, 0.5);
}

/* ===== WHATSAPP FLOAT ===== */
.whatsapp-float, .whatsapp-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  width: 56px;
  height: 56px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.4);
  transition: transform 0.25s, box-shadow 0.25s;
  text-decoration: none;
}
.whatsapp-float:hover, .whatsapp-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37,211,102,0.55);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .trust-strip-inner { gap: 14px; }
  .trust-strip-item { font-size: 0.72rem; }
  .nav-links { display: none; }
  .hero-title { font-size: 1.6rem; }
  .stat-callout { flex-direction: column; text-align: center; }
  .stat-number { font-size: 1.8rem; }
  .cta-button { font-size: 0.88rem; padding: 12px 24px; }
  .cta-button-secondary { margin-left: 0; margin-top: 10px; }
  .cta-box { padding: 24px 18px; }
  .comparison-table { font-size: 0.82rem; }
  .whatsapp-float, .whatsapp-btn { bottom: 16px; right: 16px; width: 50px; height: 50px; }
}
@media (max-width: 480px) {
  .hero-meta { gap: 10px; }
  .toc-card { padding: 18px 16px; }
  .article-body { padding: 10px 16px 30px; }
}

/* ===== SCROLL ANIMATIONS ===== */
.fade-up, .fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-up.visible, .fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== ARTICLE CONTENT CLASS (for Structure B pages) ===== */
.article-content { max-width: 860px; margin: 0 auto; }
.article-content h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  font-weight: 600;
  color: var(--navy);
  margin: 48px 0 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  line-height: 1.3;
  scroll-margin-top: 90px;
}
.article-content h2:first-child { margin-top: 0; border-top: none; padding-top: 0; }
.article-content h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
  font-weight: 600;
  color: var(--indigo);
  margin: 32px 0 14px;
  line-height: 1.4;
  scroll-margin-top: 90px;
}
.article-content p { margin-bottom: 18px; color: var(--text); line-height: 1.8; }
.article-content strong { color: var(--navy); font-weight: 600; }
.article-content ul, .article-content ol { margin: 0 0 20px; color: var(--text); }
.article-content li { margin-bottom: 8px; line-height: 1.7; }
.article-content blockquote {
  border-left: 3px solid var(--gold);
  background: var(--white);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 20px 24px;
  margin: 28px 0;
  font-style: italic;
  color: var(--text-soft);
  box-shadow: var(--shadow-card);
}

/* Category badge (Structure B) */
.category-badge {
  background: rgba(201, 169, 110, 0.12);
  color: var(--gold);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid rgba(201, 169, 110, 0.3);
}

/* Read time (Structure B) */
.read-time { font-size: 0.82rem; color: var(--text-soft); display: flex; align-items: center; gap: 5px; }

/* Article meta (Structure B) */
.article-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.article-hero-excerpt { font-size: 1.1rem; color: var(--text-soft); max-width: 720px; line-height: 1.7; }

/* Footer Structure B */
.footer-brand .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--gold); margin-bottom: 12px; }
.footer-brand p { font-size: 0.85rem; color: var(--gold-light); max-width: 280px; }
.footer-col h5 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); margin-bottom: 16px; }
.footer-col a { display: block; font-size: 0.85rem; color: var(--gold-light); padding: 4px 0; }
.footer-col a:hover { color: var(--gold); }
.footer-bottom { max-width: 1200px; margin: 36px auto 0; padding-top: 20px; border-top: 1px solid rgba(201, 169, 110, 0.15); text-align: center; font-size: 0.78rem; color: rgba(232, 213, 176, 0.4); }

/* TOC Sidebar (Structure B) */
.toc-sidebar {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: var(--shadow-card);
}
.toc-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); margin-bottom: 16px; }

/* Pulse CTA (Structure B) */
@keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.3); } 50% { box-shadow: 0 0 0 8px rgba(201, 169, 110, 0); } }
.pulse-cta { animation: pulse-glow 2.5s infinite; }

/* Article layout grid (Structure B) */
.article-layout { max-width: 1200px; margin: 0 auto; padding: 0 24px 60px; display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: start; }
@media (max-width: 1024px) { .article-layout { grid-template-columns: 1fr; } .toc-sidebar { position: relative; top: 0; } }
@media (max-width: 768px) { .menu-toggle { display: block; } .header-nav { display: none; } .header-nav.open { display: flex; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: rgba(255,255,255,0.98); padding: 20px 24px; border-bottom: 1px solid var(--border); gap: 16px; } }

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--gold-light); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--gold); }
"""


def convert_inline_styles(html):
    """Convert inline styles from cyan/green to gold/cream design."""
    # Replace cyan gradient hr styles
    html = re.sub(
        r'background:linear-gradient\(90deg,transparent,rgba\(0,224,255,0\.2\),transparent\)',
        'background:linear-gradient(90deg,transparent,rgba(201,169,110,0.25),transparent)',
        html
    )
    # Replace other common inline cyan references
    html = html.replace('stroke="#00E0FF"', 'stroke="#C9A96E"')
    html = html.replace('stroke="#00C9A7"', 'stroke="#C9A96E"')
    html = html.replace('stroke="#8899B4"', 'stroke="#4a5568"')
    html = html.replace('stroke="#5a7a9e"', 'stroke="#4a5568"')
    html = html.replace('stroke="#8fa8c8"', 'stroke="#4a5568"')
    # Logo gradient stops
    html = html.replace('stop-color="#00E0FF"', 'stop-color="#C9A96E"')
    html = html.replace('stop-color="#00C9A7"', 'stop-color="#e8d5b0"')
    # Fix the <<title>> issue that some pages have
    html = re.sub(r'<<title>(.*?)</title>>', r'<title>\1</title>', html)
    # Fix OG title with OG_ prefix
    html = html.replace('content="OG_<title>', 'content="')
    html = html.replace('</title>">', '"')
    # Fix Twitter title with TWITTER_ prefix
    html = html.replace('content="TWITTER_<title>', 'content="')
    return html


def extract_article_content(soup):
    """Extract the article body content from the page, regardless of structure."""
    # Try Structure A: <article class="article-body">
    article = soup.find('article', class_='article-body')
    if article:
        return article.decode_contents(), 'article-body'
    
    # Try Structure B: <article class="article-content">
    article = soup.find('article', class_='article-content')
    if article:
        return article.decode_contents(), 'article-content'
    
    # Fallback: try any article tag
    article = soup.find('article')
    if article:
        return article.decode_contents(), 'article-body'
    
    return None, None


def extract_toc_items(soup):
    """Extract TOC items from the page."""
    toc_items = []
    
    # Try Structure A: <ol class="toc-list">
    toc_list = soup.find('ol', class_='toc-list')
    if toc_list:
        for li in toc_list.find_all('li'):
            a = li.find('a')
            if a:
                toc_items.append({'href': a.get('href', ''), 'text': a.get_text()})
        return toc_items
    
    # Try Structure B: <ul class="toc-list">
    toc_list = soup.find('ul', class_='toc-list')
    if toc_list:
        for li in toc_list.find_all('li'):
            a = li.find('a')
            if a:
                toc_items.append({'href': a.get('href', ''), 'text': a.get_text()})
        return toc_items
    
    return toc_items


def extract_breadcrumb_current(soup):
    """Extract the current breadcrumb item text."""
    # Structure A
    current = soup.find('span', class_='current')
    if current:
        return current.get_text(strip=True)
    
    # Structure B - last span in breadcrumb
    breadcrumb = soup.find('nav', class_='breadcrumb')
    if breadcrumb:
        spans = breadcrumb.find_all('span')
        for span in spans:
            if span.get('style') and 'color' in span.get('style', ''):
                return span.get_text(strip=True)
    
    return ''


def extract_hero_data(soup):
    """Extract hero section data."""
    data = {'category': '', 'title': '', 'date': '', 'read_time': '', 'author': '', 'excerpt': ''}
    
    # Try Structure A hero
    hero = soup.find('header', class_='article-hero')
    if hero:
        cat = hero.find('span', class_='hero-category')
        if not cat:
            cat = hero.find('span', class_='category-badge')
        if cat:
            data['category'] = cat.get_text(strip=True)
        
        title = hero.find('h1')
        if title:
            data['title'] = str(title.decode_contents())
        
        # Extract meta items
        meta_items = hero.find_all('span', class_='hero-meta-item')
        if meta_items:
            texts = [m.get_text(strip=True) for m in meta_items]
            if len(texts) >= 1:
                data['date'] = texts[0]
            if len(texts) >= 2:
                data['read_time'] = texts[1]
            if len(texts) >= 3:
                data['author'] = texts[2]
        
        # Structure B excerpt
        excerpt = hero.find('p', class_='article-hero-excerpt')
        if excerpt:
            data['excerpt'] = excerpt.get_text(strip=True)
    
    # Try Structure B section hero
    if not hero:
        hero = soup.find('section', class_='article-hero')
        if hero:
            cat = hero.find('span', class_='category-badge')
            if not cat:
                cat = hero.find('span', class_='hero-category')
            if cat:
                data['category'] = cat.get_text(strip=True)
            
            title = hero.find('h1')
            if title:
                data['title'] = str(title.decode_contents())
            
            read_time = hero.find('span', class_='read-time')
            if read_time:
                data['read_time'] = read_time.get_text(strip=True)
            
            excerpt = hero.find('p', class_='article-hero-excerpt')
            if excerpt:
                data['excerpt'] = excerpt.get_text(strip=True)
    
    return data


def build_trust_strip():
    """Build Claude's design trust strip."""
    return '''<!-- ============ TRUST STRIP ============ -->
<div class="trust-strip">
  <div class="trust-strip-inner">
    <div class="trust-strip-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <span>Paiement 100% securise</span>
    </div>
    <div class="trust-strip-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      <span>Livraison Afrique et Europe</span>
    </div>
    <div class="trust-strip-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Support WhatsApp 7j/7</span>
    </div>
    <div class="trust-strip-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span>Garantie 2 ans</span>
    </div>
  </div>
</div>'''


def build_header():
    """Build Claude's design header."""
    return '''<!-- ============ HEADER ============ -->
<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <a href="https://synchrovie.github.io/Boutique-SynchroVie/" class="logo-link" aria-label="Accueil Synchrovie">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="url(#logoGrad)" stroke-width="2.5"/>
        <path d="M10 16 L14 20 L22 12" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#C9A96E"/><stop offset="1" stop-color="#e8d5b0"/></linearGradient></defs>
      </svg>
      <span class="logo-text">SYNCHROVIE</span>
    </a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/">Accueil</a>
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/#produits">Produits</a>
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/blog/">Blog</a>
      <a href="https://wa.me/22360625155?text=Bonjour%20Synchrovie%2C%20conseil%20bague%20biom%C3%A9trique" target="_blank" rel="noopener">Contact</a>
    </nav>
  </div>
</header>'''


def build_breadcrumb(current_text):
    """Build Claude's design breadcrumb."""
    return f'''<nav class="breadcrumb-wrap" aria-label="Fil d'Ariane">
  <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="https://synchrovie.github.io/Boutique-SynchroVie/"><span itemprop="name">Accueil</span></a>
      <meta itemprop="position" content="1"/>
    </li>
    <span class="sep" aria-hidden="true">›</span>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="https://synchrovie.github.io/Boutique-SynchroVie/blog/"><span itemprop="name">Blog</span></a>
      <meta itemprop="position" content="2"/>
    </li>
    <span class="sep" aria-hidden="true">›</span>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name" class="current">{current_text}</span>
      <meta itemprop="position" content="3"/>
    </li>
  </ol>
</nav>'''


def build_hero(hero_data):
    """Build Claude's design hero section."""
    date_svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    time_svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    author_svg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    
    meta_parts = []
    if hero_data.get('date'):
        meta_parts.append(f'<span class="hero-meta-item">{date_svg} {hero_data["date"]}</span>')
    if hero_data.get('read_time'):
        meta_parts.append(f'<span class="hero-meta-item">{time_svg} {hero_data["read_time"]}</span>')
    if hero_data.get('author'):
        meta_parts.append(f'<span class="hero-meta-item">{author_svg} {hero_data["author"]}</span>')
    
    excerpt_html = ''
    if hero_data.get('excerpt'):
        excerpt_html = f'<p class="article-hero-excerpt">{hero_data["excerpt"]}</p>'
    
    return f'''<header class="article-hero">
  <span class="hero-category">{hero_data.get("category", "")}</span>
  <h1 class="hero-title">{hero_data.get("title", "")}</h1>
  {excerpt_html}
  <div class="hero-meta">
    {''.join(meta_parts)}
  </div>
</header>'''


def build_toc(toc_items):
    """Build Claude's design TOC section."""
    if not toc_items:
        return ''
    
    toc_links = []
    for item in toc_items:
        toc_links.append(f'<li><a href="{item["href"]}">{item["text"]}</a></li>')
    
    return f'''<div class="hero-divider"><hr></div>
<section class="toc-section" aria-label="Sommaire">
  <div class="toc-card">
    <div class="toc-card-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      Sommaire
    </div>
    <ol class="toc-list">
      {''.join(toc_links)}
    </ol>
  </div>
</section>'''


def build_footer():
    """Build Claude's design footer."""
    return '''<!-- ============ FOOTER ============ -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-logo">SYNCHROVIE</div>
    <div class="footer-links">
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/">Accueil</a>
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/#produits">Produits</a>
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/blog/">Blog</a>
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/faq.html">FAQ</a>
      <a href="https://synchrovie.github.io/Boutique-SynchroVie/contact.html">Contact</a>
    </div>
    <p class="footer-copy">&copy; 2026 Synchrovie. Tous droits reserves.</p>
  </div>
</footer>'''


def build_whatsapp():
    """Build Claude's design WhatsApp float."""
    return '''<!-- ============ WHATSAPP FLOAT ============ -->
<a href="https://wa.me/22360625155?text=Bonjour%20Synchrovie%2C%20j%27ai%20une%20question" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Contact WhatsApp">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>'''


def build_scripts():
    """Build the JavaScript for scroll animations and header effect."""
    return '''<script>
// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
  var fadeEls = document.querySelectorAll('.fade-up, .fade-in-up');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(function(el) { observer.observe(el); });
});

// Header scroll effect
window.addEventListener('scroll', function() {
  var header = document.getElementById('siteHeader');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
});
</script>'''


def convert_file(filename):
    """Convert a single blog file from dark cyan to Claude's design."""
    filepath = os.path.join(BLOG_DIR, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Fix known issues with some pages
    html = convert_inline_styles(html)
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # ---- Extract data from the page ----
    
    # Extract head content (everything before <style>)
    # We need to preserve: gtag.js, meta tags, OG tags, schema.org, canonical, Twitter
    
    # Get the <head> element
    head = soup.find('head')
    
    # Extract all elements from head, excluding <style> and old font links
    head_elements = []
    for child in head.children:
        if child.name == 'style':
            continue  # Skip old CSS
        if child.name == 'link' and child.get('href', '').find('fonts.googleapis.com') != -1:
            continue  # Skip old font link
        if child.name == 'link' and child.get('rel') == ['preconnect']:
            continue  # Skip old preconnect
        head_elements.append(str(child))
    
    head_html = '\n'.join(head_elements)
    
    # Clean up head HTML
    head_html = head_html.replace('&lt;', '<').replace('&gt;', '>')
    
    # Extract article content
    article_content, article_class = extract_article_content(soup)
    if article_content is None:
        print(f"  WARNING: Could not find article content in {filename}")
        return False
    
    # Convert inline styles in article content
    article_content = convert_inline_styles(article_content)
    
    # Extract other data
    breadcrumb_current = extract_breadcrumb_current(soup)
    hero_data = extract_hero_data(soup)
    toc_items = extract_toc_items(soup)
    
    # ---- Build the new page ----
    
    # Build new head
    new_head = f"""<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-R7FXCZJQVT"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'G-R7FXCZJQVT');
    </script>

{head_html}

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">

<style>
{CLAUDE_CSS}
</style>
</head>"""
    
    # Build body
    body_parts = []
    body_parts.append('')
    body_parts.append(build_trust_strip())
    body_parts.append('')
    body_parts.append('')
    body_parts.append(build_header())
    body_parts.append('')
    body_parts.append(build_breadcrumb(breadcrumb_current))
    body_parts.append(build_hero(hero_data))
    body_parts.append(build_toc(toc_items))
    body_parts.append(f'<article class="article-body" itemscope itemtype="https://schema.org/Article">')
    body_parts.append(article_content)
    body_parts.append('</article>')
    body_parts.append('')
    body_parts.append(build_footer())
    body_parts.append('')
    body_parts.append('')
    body_parts.append(build_whatsapp())
    body_parts.append('')
    body_parts.append('')
    body_parts.append(build_scripts())
    body_parts.append('')
    body_parts.append('</body>')
    
    new_body = '\n'.join(body_parts)
    
    # Assemble final page
    new_html = f'<!DOCTYPE html>\n<html lang="fr">\n{new_head}\n{new_body}\n</html>'
    
    # Final cleanup - BeautifulSoup may double-encode some entities
    # Fix &amp; that should just be & in visible text (but keep valid HTML entities)
    # We need to be careful: &amp; in href attributes is valid, but in text it may be over-encoded
    # Let's just fix the most common issue: &amp;copy; should be &copy;
    new_html = new_html.replace('&amp;copy;', '&copy;')
    new_html = new_html.replace('&amp;euro;', '&euro;')
    new_html = new_html.replace('&amp;rsquo;', '&rsquo;')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    return True


def main():
    print(f"Converting {len(BLOG_FILES)} blog pages to Claude's design...")
    print("=" * 60)
    
    success = 0
    fail = 0
    
    for i, filename in enumerate(BLOG_FILES, 1):
        print(f"[{i}/{len(BLOG_FILES)}] Converting {filename}...", end=" ")
        try:
            result = convert_file(filename)
            if result:
                print("OK")
                success += 1
            else:
                print("FAILED")
                fail += 1
        except Exception as e:
            print(f"ERROR: {e}")
            fail += 1
    
    print("=" * 60)
    print(f"Done! {success} succeeded, {fail} failed out of {len(BLOG_FILES)} files.")


if __name__ == '__main__':
    main()
