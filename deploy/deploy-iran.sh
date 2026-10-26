#!/usr/bin/env bash
# ============================================================
#  بدن‌نامه — استقرار روی سرور ایران (blog.doroodapp.ir)
#  اجرا: روی خود سرور، با دسترسی root:
#     bash deploy-iran.sh
#  به‌روزرسانی نسخه‌ی بعدی: دوباره همین دستور را اجرا کنید — idempotent است.
# ============================================================
set -euo pipefail

DOMAIN="blog.doroodapp.ir"
REPO="https://github.com/mehrshad22020/badannameh.git"
WEBROOT="/var/www/badannameh"
SRC="/tmp/badannameh-src"
CONF=/etc/nginx/sites-available/badannameh
CERT=/etc/letsencrypt/live/$DOMAIN/fullchain.pem

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

if [ -f "$CERT" ]; then
  echo "۳/۵) گواهی موجود است — نصب کانفیگ کامل (443 + هاردنینگ)…"
  cp "$SRC/deploy/nginx-blog-doroodapp.conf" "$CONF"
  ln -sf "$CONF" /etc/nginx/sites-enabled/badannameh
  nginx -t
  systemctl reload nginx
else
  echo "۳/۵) گواهی هنوز نیست — بوت‌استرپ HTTP (با محل ACME)…"
  cat > "$CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    root $WEBROOT;
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
}
EOF
  ln -sf "$CONF" /etc/nginx/sites-enabled/badannameh
  nginx -t
  systemctl reload nginx
fi

echo "۴/۵) گواهی HTTPS (Let's Encrypt)…"
if [ -f "$CERT" ]; then
  echo "— گواهی از قبل موجود است ✓"
elif command -v certbot >/dev/null 2>&1; then
  certbot certonly --webroot -w /var/www/html -d "$DOMAIN" --non-interactive --agree-tos -m "admin@doroodapp.ir" || {
    echo "⚠ گواهی صادر نشد — تقریباً همیشه یعنی رکورد DNS برای $DOMAIN هنوز ست نیست."
    echo "  بعد از ست‌کردن رکورد A در Cloudflare، دوباره همین اسکریپت را اجرا کنید."
  }
else
  echo "⚠ certbot نصب نیست — نصب کنید: apt install -y certbot python3-certbot-nginx"
fi

# اگر گواهی همین حالا صادر شد، کانفیگ کامل را نصب کن
if [ ! -f /etc/nginx/sites-enabled/badannameh ] || ! grep -q "letsencrypt/live/$DOMAIN" "$CONF" 2>/dev/null; then
  if [ -f "$CERT" ]; then
    echo "— گواهی آماده شد — نصب کانفیگ کامل…"
    cp "$SRC/deploy/nginx-blog-doroodapp.conf" "$CONF"
    nginx -t && systemctl reload nginx
  fi
fi

echo "۵/۵) بررسی نهایی…"
sleep 1
CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN/" || true)
echo "— http://$DOMAIN/ → $CODE"
if [ -f "$CERT" ]; then
  echo "✅ بدن‌نامه منتشر شد: https://$DOMAIN"
else
  echo "⏳ فایل‌ها منتشر شدند (HTTP) — برای HTTPS: رکورد A برای $DOMAIN در Cloudflare بسازید و دوباره اجرا کنید."
fi
echo "   به‌روزرسانی بعدی: فقط همین اسکریپت را دوباره اجرا کنید."
