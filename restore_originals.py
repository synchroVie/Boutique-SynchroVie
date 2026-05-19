#!/usr/bin/env python3
"""Restore original product images - just convert to WebP, no background processing"""
from PIL import Image
import os

UPLOAD_DIR = "/home/z/my-project/upload"
OUTPUT_DIR = "/home/z/my-project/download/produits_restored"
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGET_W, TARGET_H = 864, 1152

def convert_to_webp(input_path, output_path):
    """Simply convert and resize to WebP without any background modification"""
    img = Image.open(input_path).convert('RGB')
    
    # Resize to fit within target dimensions while maintaining aspect ratio
    img_ratio = img.width / img.height
    target_ratio = TARGET_W / TARGET_H
    
    if img_ratio > target_ratio:
        new_w = TARGET_W
        new_h = int(TARGET_W / img_ratio)
    else:
        new_h = TARGET_H
        new_w = int(TARGET_H * img_ratio)
    
    img = img.resize((new_w, new_h), Image.LANCZOS)
    
    # If not exact target size, pad with the image's own edge color (not adding any bg)
    # Actually just save as-is with the natural dimensions
    img.save(output_path, 'WEBP', quality=92, method=6)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  ✓ {os.path.basename(output_path)}: {img.width}x{img.height}, {size_kb:.0f}KB")

# Product image assignments - ORIGINAL files
products = {
    "TENSIOMÈTRE": [
        (f"{UPLOAD_DIR}/H790cbff6d9e146cd82b7ff082c322bb7Z.jpg", "tensiometre-intelligent-connecte-1.webp"),
        (f"{UPLOAD_DIR}/Hb65ff97c548f4781bd45d6e30cb10c38l.jpg", "tensiometre-intelligent-connecte-2.webp"),
        (f"{UPLOAD_DIR}/H09c47e48fee64310bbd92169fd439f22p.jpg", "tensiometre-intelligent-connecte-3.webp"),
        (f"{UPLOAD_DIR}/Screenshot_20260518-150951.png", "tensiometre-intelligent-connecte-4.webp"),
    ],
    "THERMOMÈTRE": [
        (f"{UPLOAD_DIR}/Hd13ffde58db94bcf9e65a042961411acK.jpg", "thermometre-infrarouge-medical-1.webp"),
        (f"{UPLOAD_DIR}/Screenshot_20260518-152124.png", "thermometre-infrarouge-medical-2.webp"),
        (f"{UPLOAD_DIR}/H46fdb6bdc59c4f97a03ae33a6de8abc6E.jpg", "thermometre-infrarouge-medical-3.webp"),
        (f"{UPLOAD_DIR}/Hb366176bdcc44eab9dfeba04f8aadc30q.jpg", "thermometre-infrarouge-medical-4.webp"),
    ],
    "MASQUE": [
        (f"{UPLOAD_DIR}/Screenshot_20260518-150747.png", "masque-sommeil-ondes-delta-1.webp"),
        (f"{UPLOAD_DIR}/H9734a35593ea4862b45bab6f717b7dafc.jpg", "masque-sommeil-ondes-delta-2.webp"),
        (f"{UPLOAD_DIR}/H4509bfed1c13444eb3606c8e25648763P.jpg", "masque-sommeil-ondes-delta-3.webp"),
        (f"{UPLOAD_DIR}/H2223f4d09aee4e45a2b6eb02a45e8e85Y.jpg", "masque-sommeil-ondes-delta-4.webp"),
    ],
    "BAGUE": [
        (f"{UPLOAD_DIR}/Ha2edc2dbe6f54ef79fdc6aa8e9e44db91.png", "bague-connectee-sante-biometrique-1.webp"),
        (f"{UPLOAD_DIR}/H6929285a3c5d4eabb9592786182b1837a.jpg", "bague-connectee-sante-biometrique-2.webp"),
        (f"{UPLOAD_DIR}/Hf6cdbf11993c479a8eef81cd51a32b89S.jpg", "bague-connectee-sante-biometrique-3.webp"),
        (f"{UPLOAD_DIR}/Hffd8272078c842c59a62ceb88b714bf5w.jpg", "bague-connectee-sante-biometrique-4.webp"),
    ],
}

for product_name, images in products.items():
    print(f"\n📷 Restoring {product_name}")
    for input_path, output_name in images:
        output_path = os.path.join(OUTPUT_DIR, output_name)
        if os.path.exists(input_path):
            convert_to_webp(input_path, output_path)
        else:
            print(f"  ✗ MISSING: {input_path}")

print(f"\n✅ All originals restored!")
