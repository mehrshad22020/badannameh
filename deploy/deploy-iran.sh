#!/usr/bin/env bash
# ============================================================
#  بدن‌نامه — استقرار روی سرور ایران (blog.doroodapp.ir)
#  اجرا: روی خود سرور، با دسترسی root:
#     bash deploy-iran.sh
#  به‌روزرسانی نسخه‌ی بعدی: دوباره همین دستور را اجرا کنید.
# ============================================================
set -euo pipefail

DOMAIN="blog.doroodapp.ir"
REPO="https://github.com/mehrshad22020/badannameh.git"
WEBROOT="/var/www/badannameh"
SRC="/tmp/badannameh-src"

[ "$(id -u)" -eq 0 ] || { echo "✗ با root یا sudo اجرا کنید"; exit 1; }

echo "۱/۵) دریافت آخرین نسخه از گیت‌هاب…"
rm -rf "$SRC"
git clone --depth 1 "$REPO" "$SRC"

echo "۲/۵) کپی فایل‌ها به $WEBROOT…"
mkdir -p "$WEBROOT"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$SRC/" "$WEBROOT/" --exclude ".git"
else
  rm -rf "$WEBROOT"/*; cp -r "$SRC/." "$WEBROOT/"; rm -rf "$WEBROOT/.git"
fi

echo "۳/۵) نصب کانفیگ nginx…"
cp "$SRC/deploy/nginx-blog-doroodapp.conf" /etc/nginx/sites-available/badannameh
ln -sf /etc/nginx/sites-available/badannameh /etc/nginx/sites-enabled/badannameh
nginx -t
systemctl reload nginx

echo "۴/۵) گواهی HTTPS (Let's Encrypt)…"
if command -v certbot >/dev/null 2>&1; then
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect -m "admin@doroodapp.ir" || \
    echo "⚠ گواهی خودکار نصب نشد — دستی اجرا کنید: certbot --nginx -d $DOMAIN"
else
  echo "⚠ certbot نصب نیست — نصب کنید: apt install -y certbot python3-certbot-nginx && certbot --nginx -d $DOMAIN"
fi

echo "۵/۵) بررسی نهایی…"
sleep 1
CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN/" || true)
echo "— http://$DOMAIN/ → $CODE"
echo "✅ بدن‌نامه منتشر شد: https://$DOMAIN"
echo "   به‌روزرسانی بعدی: فقط همین اسکریپت را دوباره اجرا کنید."
