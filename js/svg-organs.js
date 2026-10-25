/* ============================================================
   بدن‌نامه — گرافیک: نمودار تفصیلی اندام‌ها
   در مودال جزئیات هر عضو نمایش داده می‌شوند.
============================================================ */
(function(){
'use strict';
window.FIGS = window.FIGS || {};
const F = window.FIGS;
const svg = (inner, vb) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
const lt = (x, y, t, anchor) => `<text class="lbl lbl-t" x="${x}" y="${y}" text-anchor="${anchor||'middle'}">${t}</text>`;
const l = (x, y, t, anchor) => `<text class="lbl" x="${x}" y="${y}" text-anchor="${anchor||'middle'}">${t}</text>`;
const lead = (d) => `<path class="leader" d="${d}"/>`;

/* ---------- قلب ---------- */
F.heart = svg(`
  <g class="hot" data-hot="#myo">
    <path d="M150 150 C120 100 190 60 240 84 C300 112 330 180 300 260 C276 324 214 366 168 392 C120 356 66 292 58 216 C52 156 96 118 150 150 Z" fill="#be123c" opacity=".35"/>
  </g>
  <g class="hot" data-hot="#ra">
    <path d="M132 168 C118 148 138 132 160 138 C180 144 184 162 176 180 C166 196 144 196 132 168 Z" fill="#38bdf8"/>
  </g>
  <g class="hot" data-hot="#rv">
    <path d="M136 190 C124 218 134 262 160 292 C176 310 196 320 210 322 C200 290 186 250 176 212 C162 188 146 178 136 190 Z" fill="#60a5fa"/>
  </g>
  <g class="hot" data-hot="#la">
    <path d="M232 128 C258 116 292 128 296 154 C300 178 282 192 262 188 C242 184 224 150 232 128 Z" fill="#f87171"/>
  </g>
  <g class="hot" data-hot="#lv">
    <path d="M262 196 C286 220 292 268 268 308 C250 336 224 356 208 364 C226 322 244 268 252 222 C256 202 258 190 262 196 Z" fill="#ef4444"/>
  </g>
  <g class="hot" data-hot="#tv"><circle cx="164" cy="184" r="7" fill="#fef08a" stroke="#a16207" stroke-width="1.5"/></g>
  <g class="hot" data-hot="#mv"><circle cx="254" cy="196" r="7" fill="#fde68a" stroke="#a16207" stroke-width="1.5"/></g>
  <g class="hot" data-hot="#av"><circle cx="216" cy="252" r="7" fill="#fef3c7" stroke="#a16207" stroke-width="1.5"/><circle cx="150" cy="238" r="7" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5"/></g>
  <g class="hot" data-hot="#sanode"><circle cx="146" cy="150" r="5" fill="#facc15" stroke="#a16207"/></g>
  <g fill="none" stroke-linecap="round">
    <path d="M120 120 C104 92 120 60 148 52" stroke="#38bdf8" stroke-width="14"/>
    <path d="M148 52 L192 44 C216 40 236 52 240 74" stroke="#ef4444" stroke-width="16"/>
    <path d="M240 74 C244 96 232 108 224 120" stroke="#ef4444" stroke-width="12"/>
    <path d="M126 168 C110 200 112 250 132 288" stroke="#38bdf8" stroke-width="11" opacity=".9"/>
    <path d="M150 118 C140 140 138 152 136 166" stroke="#38bdf8" stroke-width="7" opacity=".85"/>
    <path d="M258 136 C270 118 292 112 312 122" stroke="#f87171" stroke-width="7" opacity=".85"/>
    <path d="M266 172 C284 190 292 216 288 244" stroke="#f87171" stroke-width="6" opacity=".8"/>
  </g>
  <g stroke-linecap="round" fill="none" stroke-width="4">
    <path d="M96 78 L114 96 M114 96 L106 92 M114 96 L110 84" stroke="#38bdf8"/>
    <path d="M282 96 L264 116 M264 116 L272 112 M264 116 L268 104" stroke="#ef4444"/>
  </g>
  ${lt(60, 48, 'ورید اجوف فوقانی')} ${lead('M76 44 L118 62')}
  ${lt(300, 34, 'آئورت')} ${lead('M288 38 L246 52')}
  ${lt(320, 140, 'سرخرگ ریوی')} ${lead('M304 136 L238 100')}
  ${l(60, 158, 'دهلیز راست')} ${lead('M74 154 L130 158')}
  ${l(330, 176, 'دهلیز چپ')} ${lead('M316 172 L296 164')}
  ${l(60, 260, 'بطن راست')} ${lead('M76 256 L134 248')}
  ${l(330, 280, 'بطن چپ')} ${lead('M316 276 L290 272')}
  ${l(64, 340, 'ورید اجوف تحتانی')} ${lead('M78 336 L130 296')}
  ${l(200, 428, 'نوک قلب')}
  ${l(110, 196, 'سه‌لتی')} ${lead('M96 200 L156 188')}
  ${l(322, 212, 'میترال')} ${lead('M308 208 L262 198')}
  ${l(96, 244, 'ریوی')} ${lead('M108 246 L142 240')}
  ${l(240, 264, 'سینی')} ${lead('M226 262 L224 254')}
  ${l(96, 130, 'گره SA')} ${lead('M108 132 L140 148')}
`, '0 0 380 450');

/* ---------- خون ---------- */
F['blood-cells'] = svg(`
  <rect x="20" y="20" width="480" height="240" rx="18" fill="#7f1d1d" opacity=".28"/>
  ${(()=>{let s='';const cs=[[70,80],[110,120],[150,70],[190,110],[230,80],[270,130],[310,75],[350,115],[390,85],[430,125],[100,190],[160,200],[230,195],[300,205],[370,190],[440,200]];cs.forEach(c=>{s+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="17" ry="8" fill="#ef4444" stroke="#b91c1c" stroke-width="1.6"/>`;});return s;})()}
  <g class="hot" data-hot="#rbc">${l(160, 60, 'گلبول قرمز — حمل اکسیژن', 'middle')}</g>
  <g>
    <circle cx="240" cy="140" r="26" fill="#a78bfa" opacity=".95"/>
    <path d="M226 132 C232 122 246 122 252 130 C258 140 254 154 244 158 C232 162 220 148 226 132 Z" fill="#6d28d9"/>
    ${l(240, 92, 'گلبول سفید — ارتش ایمنی')}
  </g>
  <g>
    <ellipse cx="330" cy="170" rx="12" ry="7" fill="#fbbf24" transform="rotate(20 330 170)"/>
    <ellipse cx="345" cy="162" rx="9" ry="5" fill="#fbbf24" transform="rotate(-15 345 162)"/>
    ${l(348, 130, 'پلاکت — انعقاد')}
  </g>
  ${l(60, 236, 'پلاسما (مایع زردرنگ) — ۵۵٪ حجم خون')}
`, '0 0 520 280');

/* ---------- ریه ---------- */
F.lung = svg(`
  <rect x="196" y="24" width="14" height="86" rx="7" fill="#38bdf8"/>
  ${l(240, 40, 'نای')}
  <path d="M203 108 L172 138 M203 108 L234 138" stroke="#38bdf8" stroke-width="11" stroke-linecap="round" fill="none"/>
  ${l(130, 120, 'نایژه‌ها')}
  <path d="M96 140 C84 176 82 230 96 272 C108 306 130 322 152 320 C170 318 178 300 178 272 L178 160 C178 146 168 138 152 138 C130 138 108 136 96 140 Z" fill="#38bdf8" opacity=".85"/>
  <path d="M310 140 C322 176 324 230 310 272 C298 306 276 322 254 320 C236 318 228 300 228 272 L228 160 C228 146 238 138 254 138 C276 138 298 136 310 140 Z" fill="#38bdf8" opacity=".85"/>
  <path d="M100 210 C130 222 152 258 156 318 M304 210 C276 222 252 258 248 318" stroke="#0284c7" stroke-width="2.4" fill="none" opacity=".8"/>
  ${l(84, 226, 'شکاف')}
  <path d="M136 160 C130 180 128 210 130 236" stroke="#bae6fd" stroke-width="1.6" fill="none" opacity=".7" stroke-dasharray="4 4"/>
  ${l(64, 150, 'لوب فوقانی')}
  ${l(64, 252, 'لوب تحتانی')}
  ${l(300, 130, 'ریه راست: ۳ لوب')}
  ${l(300, 344, 'ریه چپ: ۲ لوب')}
  <path d="M116 344 C160 324 246 324 290 344" stroke="#7dd3fc" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>
  ${l(204, 372, 'پرده جنب (پلور)')}
`, '0 0 380 400');

/* ---------- آلوئول ---------- */
F.alveoli = svg(`
  ${(()=>{let s='';const b=[[150,110],[210,90],[270,120],[180,170],[240,180],[130,190],[300,190]];b.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="34" fill="#bae6fd" opacity=".55" stroke="#0284c7" stroke-width="2"/>`;});return s;})()}
  ${l(210, 268, 'خوشه آلوئول‌ها')}
  <circle cx="360" cy="130" r="52" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.4"/>
  <g fill="none" stroke="#ef4444" stroke-width="3" opacity=".85">
    <path d="M330 92 C360 78 396 88 408 116 C418 142 404 172 376 180"/>
    <path d="M338 168 C358 186 388 182 402 164"/>
  </g>
  ${l(376, 250, 'شبکه مویرگی دور آلوئول')}
  <g stroke-linecap="round" stroke-width="4" fill="none">
    <path d="M300 108 L336 122 M336 122 L328 114 M336 122 L326 128" stroke="#0ea5e9"/>
    <path d="M414 170 L380 152 M380 152 L388 160 M380 152 L390 146" stroke="#ef4444"/>
  </g>
  ${lt(286, 96, 'O₂')}
  ${lt(428, 184, 'CO₂')}
  ${l(210, 300, 'دیواره تنفسی فقط ۰.۵ میکرومتر؛ گازها با انتشار رد می‌شوند')}
`, '0 0 470 330');

/* ---------- نورون ---------- */
F.neuron = svg(`
  <g fill="none" stroke="#a78bfa" stroke-width="4" stroke-linecap="round">
    <path d="M92 150 C64 120 44 118 30 128"/><path d="M92 150 C64 158 46 152 30 164"/>
    <path d="M92 150 C70 186 52 190 34 200"/><path d="M92 150 C66 100 48 88 30 92"/>
  </g>
  <circle cx="120" cy="150" r="38" fill="#7c3aed"/>
  <circle cx="112" cy="144" r="12" fill="#ddd6fe"/>
  ${l(120, 220, 'جسم سلولی')}
  <path d="M156 150 C220 142 280 156 340 150" stroke="#a78bfa" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${(()=>{let s='';for(let i=0;i<4;i++){const x=180+i*44;s+=`<ellipse cx="${x}" cy="148" rx="17" ry="12" fill="#c4b5fd" stroke="#8b5cf6" stroke-width="2"/>`;}return s;})()}
  ${l(240, 112, 'غلاف میلین (سلول شوآن)')}
  ${(()=>{let s='';for(let i=0;i<4;i++){const x=208+i*44;s+=`<line x1="${x}" y1="128" x2="${x}" y2="168" stroke="#0f172a" stroke-width="3.4"/>`;}return s;})()}
  ${l(208, 190, 'گره‌های رانویه')}
  <path d="M340 150 C386 144 412 150 436 148" stroke="#a78bfa" stroke-width="7" fill="none" stroke-linecap="round"/>
  <g fill="#a78bfa"><circle cx="444" cy="140" r="4"/><circle cx="452" cy="152" r="4"/><circle cx="446" cy="162" r="4"/><circle cx="438" cy="130" r="4"/></g>
  <path d="M470 108 L470 196 C500 196 516 178 516 150 C516 124 498 108 470 108 Z" fill="#ddd6fe" opacity=".7" stroke="#8b5cf6" stroke-width="2"/>
  ${l(500, 90, 'پایانه و سیناپس')}
  ${l(120, 40, 'دندریت‌ها — دریافت پیام')}
  ${lead('M120 46 L84 108')}
  ${l(560, 150, 'پیام الکتریکی')}
`, '0 0 620 240');

/* ---------- ساختار استخوان ---------- */
F['bone-long'] = svg(`
  <path d="M140 30 C120 30 100 44 96 70 C92 94 108 108 104 130 C100 150 100 250 104 280 C108 306 92 322 96 346 C100 372 122 386 142 386 C160 386 168 372 166 352 C164 330 166 120 164 66 C162 44 156 30 140 30 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.4"/>
  <path d="M116 52 C132 44 148 46 156 58 C160 66 158 76 152 82 C142 92 124 92 114 84 C104 74 104 60 116 52 Z" fill="#94a3b8" opacity=".55"/>
  <path d="M116 334 C130 324 148 324 156 334 C162 344 158 356 148 362 C136 368 120 366 114 356 C108 346 108 340 116 334 Z" fill="#f87171" opacity=".75"/>
  <rect x="112" y="110" width="44" height="196" fill="#fbbf24" opacity=".55"/>
  ${l(210, 52, 'اپی‌فیز (سر استخوان)')}
  ${lead('M196 48 L160 58')}
  ${l(210, 88, 'بافت اسفنجی')}
  ${lead('M196 84 L158 74')}
  ${l(238, 150, 'بافت متراکم')}
  ${lead('M224 146 L164 132')}
  ${l(238, 210, 'مغز زرد (چربی)')}
  ${lead('M224 206 L158 206')}
  ${l(238, 300, 'مغز قرمز — خون‌سازی')}
  ${lead('M224 296 L158 344')}
  ${l(210, 356, 'صفحه رشد')}
  ${lead('M196 352 L160 346')}
  ${l(64, 210, 'پریوست')}
  ${lead('M80 210 L102 200')}
  ${l(140, 412, 'استخوان بلند (برش طولی)')}
`, '0 0 320 430');

/* ---------- مفصل ---------- */
F.joint = svg(`
  <path d="M60 130 C120 110 150 116 172 140 L160 180 C140 196 100 198 60 190 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.4"/>
  <path d="M420 130 C360 110 330 116 308 140 L320 180 C340 196 380 198 420 190 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.4"/>
  <path d="M158 146 C186 132 194 132 222 146 L216 176 C192 190 188 190 164 176 Z" fill="#7dd3fc" opacity=".9"/>
  <path d="M222 146 C250 132 258 132 286 146 L280 176 C256 190 252 190 228 176 Z" fill="#7dd3fc" opacity=".9" transform="translate(-4 0)"/>
  <ellipse cx="240" cy="162" rx="34" ry="14" fill="#bae6fd" opacity=".7"/>
  <g fill="#38bdf8" opacity=".7"><circle cx="228" cy="160" r="2.6"/><circle cx="244" cy="166" r="2.6"/><circle cx="252" cy="158" r="2.6"/></g>
  <path d="M150 108 C200 88 280 88 330 108" stroke="#fbbf24" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M150 216 C200 236 280 236 330 216" stroke="#fbbf24" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M240 70 L240 112 M240 214 L240 252" stroke="#f87171" stroke-width="8" stroke-linecap="round"/>
  ${l(240, 52, 'تاندون (عضله ← استخوان)')}
  ${l(240, 108, 'کپسول مفصلی')}
  ${l(70, 96, 'استخوان')}
  ${l(240, 162, 'مایع سینوویال')}
  ${l(240, 240, 'رباط‌ها')}
  ${l(172, 166, 'غضروف مفصلی')}
  ${lead('M172 172 L192 168')}
`, '0 0 480 280');

/* ---------- چشم ---------- */
F.eye = svg(`
  <circle cx="250" cy="180" r="128" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2.6"/>
  <path d="M250 52 C300 52 340 92 352 140 C340 188 300 228 250 228 C240 228 232 224 232 208 L232 72 C232 56 240 52 250 52 Z" fill="#7dd3fc" opacity=".85"/>
  <circle cx="250" cy="140" r="46" fill="#0c4a6e"/>
  <circle cx="250" cy="140" r="20" fill="#020617"/>
  <circle cx="262" cy="128" r="7" fill="#e0f2fe" opacity=".9"/>
  <path d="M214 96 C198 108 192 124 194 140 C196 156 204 170 218 180" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <ellipse cx="248" cy="176" rx="40" ry="14" fill="#fbbf24" opacity=".85" transform="rotate(-18 248 176)"/>
  ${l(160, 74, 'قرنیه')} ${lead('M172 70 L236 62')}
  ${l(120, 140, 'عنبیه')} ${lead('M136 138 L208 138')}
  ${l(120, 190, 'عدسی')} ${lead('M136 186 L212 180')}
  ${l(380, 300, 'شبکیه (داخل پشت)')} ${lead('M366 292 L330 262')}
  ${l(390, 96, 'زجاجیه')}
  <circle cx="352" cy="180" r="7" fill="#facc15"/>
  ${l(376, 186, 'لکه زرد')}
  ${lead('M374 186 L362 182')}
  <path d="M250 232 C246 260 240 280 230 296" stroke="#a78bfa" stroke-width="14" fill="none" stroke-linecap="round"/>
  ${l(190, 320, 'عصب بینایی')}
  ${l(250, 360, 'برش چشم (ساژیتال)')}
`, '0 0 480 390');

/* ---------- گوش ---------- */
F.ear = svg(`
  <path d="M70 120 C46 84 96 60 122 92 C142 116 136 154 122 176 C112 194 118 214 132 220 C150 228 150 248 136 254 C112 264 92 244 88 220 C84 192 82 146 70 120 Z" fill="#fbbf24" opacity=".9" stroke="#b45309" stroke-width="2.4"/>
  ${l(76, 60, 'لاله گوش')}
  <path d="M130 170 C160 176 190 184 214 190" stroke="#fbbf24" stroke-width="16" fill="none" stroke-linecap="round"/>
  <line x1="222" y1="176" x2="222" y2="206" stroke="#38bdf8" stroke-width="5"/>
  ${l(160, 220, 'مجرای گوش')}
  ${l(238, 232, 'پرده صماخ')} ${lead('M232 228 L226 210')}
  <g stroke="#f472b6" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M232 192 C252 182 268 180 282 184"/>
    <path d="M282 184 C298 178 310 184 314 196"/>
    <path d="M314 196 C322 202 326 210 322 218"/>
  </g>
  ${l(252, 150, 'چکشی')} ${l(306, 160, 'سندانی')} ${l(340, 226, 'رکابی — کوچک‌ترین استخوان بدن')}
  <path d="M236 220 C226 250 220 268 214 284" stroke="#22d3ee" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${l(170, 296, 'شیپور استاش')}
  <g stroke="#a78bfa" stroke-width="5" fill="none" stroke-linecap="round">
    <ellipse cx="380" cy="130" rx="26" ry="14" transform="rotate(-30 380 130)"/>
    <ellipse cx="392" cy="118" rx="26" ry="14" transform="rotate(-10 392 118)"/>
    <ellipse cx="398" cy="140" rx="26" ry="14" transform="rotate(24 398 140)"/>
  </g>
  ${l(384, 84, 'مجاری نیم‌دایره — تعادل')}
  <g stroke="#a78bfa" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M388 168 C376 196 372 226 384 254 C396 282 424 296 452 288 C472 282 484 266 484 248 C484 230 472 216 456 212 C440 208 426 216 420 230 C416 242 420 254 430 260"/>
  </g>
  ${l(430, 330, 'حلزون (کوکلئا) — ۱۶ هزار سلول مویی')}
  <path d="M360 190 C340 210 330 236 330 260" stroke="#f43f5e" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${l(300, 286, 'عصب دهلیزی-حلزونی')}
`, '0 0 520 360');

/* ---------- پوست ---------- */
F.skin = svg(`
  <rect x="30" y="30" width="440" height="70" rx="8" fill="#fcd34d" opacity=".35"/>
  <rect x="30" y="100" width="440" height="120" rx="8" fill="#fca5a5" opacity=".3"/>
  <rect x="30" y="220" width="440" height="90" rx="8" fill="#fbbf24" opacity=".28"/>
  ${(()=>{let s='';for(let i=0;i<7;i++){s+=`<rect x="${46+i*60}" y="40" width="44" height="52" rx="10" fill="#f59e0b" opacity=".4"/>`;}return s;})()}
  <path d="M250 30 C250 60 258 84 262 108" stroke="#92400e" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="266" cy="122" rx="13" ry="10" fill="#fbbf24"/>
  ${l(320, 46, 'فولیکول مو')}
  ${l(320, 82, 'غده چربی (سباسه)')}
  <path d="M120 226 C120 200 128 184 140 176" stroke="#38bdf8" stroke-width="4.4" fill="none" stroke-linecap="round"/>
  <path d="M104 250 C112 238 132 238 140 250 C146 258 136 270 120 270 C106 270 100 258 104 250 Z" fill="#7dd3fc" opacity=".8"/>
  ${l(60, 306, 'غده عرق')}
  <path d="M104 250 L120 270" stroke="#38bdf8" stroke-width="3.6"/>
  ${l(330, 128, 'اپیدرم — سد محافظ')}
  ${l(330, 170, 'درم — رگ، گیرنده، فولیکول')}
  ${l(330, 250, 'هیپودرم — چربی عایق')}
  <ellipse cx="150" cy="160" rx="17" ry="9" fill="#a78bfa" opacity=".85"/>
  ${l(84, 162, 'مایسنر (لمس لطیف)')}
  <g fill="none" stroke="#a78bfa" stroke-width="2.6"><ellipse cx="160" cy="205" rx="15" ry="10"/><ellipse cx="160" cy="205" rx="9" ry="6"/><ellipse cx="160" cy="205" rx="4" ry="3"/></g>
  ${l(76, 208, 'پاچینی (لرزش عمقی)')}
  <g fill="#ef4444" opacity=".85"><circle cx="360" cy="120" r="5"/><circle cx="390" cy="126" r="5"/><circle cx="420" cy="120" r="5"/></g>
  ${l(390, 146, 'گیرنده‌های درد')}
  ${(()=>{let s='';for(let i=0;i<6;i++){s+=`<circle cx="${60+i*74}" cy="262" r="17" fill="#fde68a" opacity=".8"/>`;}return s;})()}
  ${l(250, 330, 'سلول‌های چربی (آدیپوسیت)')}
`, '0 0 500 350');

/* ---------- کلیه ---------- */
F.kidney = svg(`
  <path d="M120 60 C70 60 40 110 44 170 C48 230 80 280 130 280 C160 280 176 258 172 230 C170 208 158 196 158 170 C158 144 172 132 172 110 C172 82 150 60 120 60 Z" fill="#22d3ee" opacity=".9" stroke="#0e7490" stroke-width="2.4"/>
  <path d="M126 78 C96 78 74 118 78 168 C82 218 104 258 132 258 C148 258 156 246 154 230 C150 208 142 196 142 170 C142 144 152 134 152 112 C152 90 144 78 126 78 Z" fill="#0e7490" opacity=".35"/>
  ${(()=>{let s='';[[100,110],[104,170],[100,230]].forEach(p=>{s+=`<path d="M${p[0]} ${p[1]-24} C${p[0]+28} ${p[1]-6} ${p[0]+28} ${p[1]+6} ${p[0]} ${p[1]+24} C${p[0]-12} ${p[1]+10} ${p[0]-12} ${p[1]-10} ${p[0]} ${p[1]-24} Z" fill="#0891b2" opacity=".85"/>`;});return s;})()}
  <path d="M164 150 C186 150 200 158 206 172" stroke="#0891b2" stroke-width="14" fill="none" stroke-linecap="round" opacity=".8"/>
  ${l(150, 46, 'قشر (کورتکس)')}
  ${l(84, 66, 'هرم‌های مدولا')}
  ${l(238, 150, 'لگنچه')}
  ${l(238, 200, 'حالب')}
  ${lead('M226 196 L206 182')}
  <path d="M60 120 C44 118 30 122 22 134" stroke="#ef4444" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M60 210 C44 212 32 206 24 196" stroke="#38bdf8" stroke-width="10" fill="none" stroke-linecap="round"/>
  ${l(20, 106, 'سرخرگ کلیوی')}
  ${l(20, 232, 'سیاهرگ کلیوی')}
`, '0 0 320 300');

/* ---------- نفرون ---------- */
F.nephron = svg(`
  <circle cx="90" cy="130" r="34" fill="#bae6fd" opacity=".7" stroke="#0284c7" stroke-width="2.4"/>
  <g stroke="#ef4444" stroke-width="3.4" fill="none"><circle cx="90" cy="130" r="22"/><circle cx="90" cy="130" r="14"/></g>
  ${l(90, 60, 'گلومرول (توپ مویرگی)')}
  ${l(90, 186, 'کپسول بومن')}
  <path d="M118 140 C170 130 200 96 240 100 C280 104 290 140 260 158 C230 176 196 168 186 196 C178 224 208 246 240 240" stroke="#fbbf24" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${l(210, 76, 'لوله پیچ‌خورده نزدیک (PCT)')}
  <path d="M240 240 C252 280 244 320 232 348 C220 380 196 396 172 392 C150 388 142 364 156 348 C170 332 196 336 206 312 C216 288 206 262 216 250" stroke="#38bdf8" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${l(320, 320, 'حلقه هنله — تغلیظ ادرار')}
  <path d="M216 250 C226 244 240 240 252 244 C286 252 300 224 306 196 C312 168 306 140 296 120" stroke="#a3e635" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${l(370, 130, 'لوله دور (DCT)')}
  <path d="M296 120 C310 110 326 106 340 110" stroke="#f472b6" stroke-width="12" fill="none" stroke-linecap="round"/>
  ${l(392, 100, 'مجرای جمع‌کننده')}
  <g stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 4" fill="none" opacity=".8"><path d="M90 164 C90 240 96 320 130 372"/><path d="M330 120 C330 200 320 280 288 340"/></g>
  ${l(150, 410, 'مسیر پالایش: گلومرول ← لوله‌ها ← ادرار')}
`, '0 0 460 440');

/* ---------- معده ---------- */
F.stomach = svg(`
  <path d="M120 70 C160 40 220 44 250 74 C280 104 284 160 262 208 C244 250 208 282 170 284 C136 286 112 264 110 232 C108 204 122 184 142 174 C158 166 170 152 168 128 C166 100 140 88 120 70 Z" fill="#f59e0b" opacity=".9" stroke="#b45309" stroke-width="2.4"/>
  <path d="M136 100 C150 92 168 94 178 106 M128 140 C148 132 172 136 186 152 M130 186 C152 178 180 184 196 202 M140 228 C160 222 186 230 200 246" stroke="#b45309" stroke-width="3" fill="none" opacity=".7"/>
  ${l(150, 60, 'قبه (فوندوس)')}
  ${l(96, 116, 'دهانه (کاردیا)')} ${lead('M110 112 L120 92')}
  ${l(110, 214, 'چین‌های روگا')}
  ${l(300, 236, 'پیلور (خروجی)')} ${lead('M286 232 L232 250')}
  <circle cx="228" cy="252" r="9" fill="#fef08a" stroke="#a16207" stroke-width="2"/>
  <path d="M238 258 C258 268 274 276 292 284" stroke="#d97706" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${l(320, 296, 'دوازدهه')}
  ${l(180, 320, 'معده — ظرفیت ۱ تا ۱.۵ لیتر')}
  ${l(320, 120, 'بدنه')}
  <path d="M150 84 C120 120 108 180 126 232" stroke="#b45309" stroke-width="2.4" fill="none" opacity=".7"/>
`, '0 0 400 350');

/* ---------- کبد ---------- */
F.liver = svg(`
  <path d="M60 120 C90 84 190 68 260 84 C330 100 360 140 350 180 C342 212 300 232 240 236 C170 242 96 232 66 200 C44 176 42 142 60 120 Z" fill="#b45309" opacity=".92" stroke="#78350f" stroke-width="2.4"/>
  <path d="M196 74 C190 120 186 170 190 232" stroke="#78350f" stroke-width="3" fill="none" opacity=".9"/>
  ${l(130, 130, 'لوب راست (بزرگ)')}
  ${l(290, 130, 'لوب چپ')}
  ${l(196, 60, 'رشته داسی (جداکننده لوب‌ها)')}
  <ellipse cx="120" cy="238" rx="18" ry="24" fill="#16a34a" transform="rotate(14 120 238)"/>
  ${l(120, 286, 'کیسه صفرا')}
  <g stroke-linecap="round" fill="none" stroke-width="6">
    <path d="M250 60 C246 84 244 100 244 112" stroke="#ef4444"/>
    <path d="M268 58 C266 82 264 98 262 112" stroke="#38bdf8"/>
    <path d="M286 62 C284 84 282 100 280 112" stroke="#4ade80"/>
  </g>
  ${l(286, 44, 'سه‌گانه پورت: سرخرگ، ورید، مجرای صفرا')}
  ${l(210, 320, 'کبد — کارخانه ۵۰۰ کارکردی بدن')}
`, '0 0 400 350');

/* ---------- زبان ---------- */
F.tongue = svg(`
  <path d="M180 40 C240 40 286 76 286 130 C286 186 246 226 190 230 C134 226 94 186 94 130 C94 76 120 40 180 40 Z" fill="#f87171" stroke="#b91c1c" stroke-width="2.4"/>
  <path d="M180 52 L180 220" stroke="#b91c1c" stroke-width="2.4" opacity=".7"/>
  ${(()=>{let s='';for(let i=0;i<3;i++){const y=76+i*52;[[-58,0],[58,0]].forEach(dx=>{s+=`<circle cx="${180+dx[0]}" cy="${y}" r="6" fill="#fbbf24"/>`;});}return s;})()}
  <g fill="#fecaca">${(()=>{let s='';for(let i=0;i<14;i++){const x=110+i*11;s+=`<circle cx="${x}" cy="${86+(i%2)*14}" r="2.4"/>`;s+=`<circle cx="${x+6}" cy="${150+(i%2)*16}" r="2.4"/>`;}return s;})()}</g>
  ${(()=>{let s='';[[180,58],[160,52],[200,52]].forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>`;});return s;})()}
  ${l(180, 262, 'جوانه‌های چشایی: پرز قارچی (زرد)، حلقوی (V پشت)، رشته‌ای (ریز)')}
  ${l(90, 200, 'حلقوی پشت')}
  ${l(300, 120, 'قارچی کنار')}
`, '0 0 380 290');

/* ---------- عضله ---------- */
F['muscle-fiber'] = svg(`
  <g>${(()=>{let s='';for(let i=0;i<3;i++){const y=40+i*70;s+=`<g><rect x="60" y="${y}" width="360" height="46" rx="20" fill="#f87171" opacity=".85"/><g stroke="#b91c1c" stroke-width="3">${(()=>{let t='';for(let j=0;j<14;j++){t+=`<line x1="${78+j*24}" y1="${y}" x2="${86+j*24}" y2="${y+46}"/>`;}return t;})()}</g></g>`;}return s;})()}</g>
  ${l(240, 30, 'عضله اسکلتی — رگه‌دار و ارادی')}
  ${l(240, 124, 'سلول‌های چندمغزه و بلند')}
  ${l(240, 194, 'خطوط مخطط = واحد انقباض (سارکومر)')}
  <g><rect x="60" y="240" width="360" height="44" rx="20" fill="#a78bfa" opacity=".85"/><g stroke="#6d28d9" stroke-width="2.6" fill="none"><path d="M80 262 C110 246 140 278 170 262 C200 246 230 278 260 262 C290 246 320 278 350 262 C370 252 396 252 404 262"/></g></g>
  ${l(240, 234, 'عضله قلبی — شاخه‌دار، خودکار، هم‌زمان می‌تپد')}
  <g><rect x="60" y="304" width="360" height="44" rx="20" fill="#fbbf24" opacity=".85"/></g>
  ${l(240, 298, 'عضله صاف — بی‌رگه، غیرارادی، بی‌خستگی')}
`, '0 0 480 370');

/* ---------- تولیدمثل زنانه ---------- */
F['repro-f'] = svg(`
  <path d="M200 120 C230 120 250 150 248 190 C246 232 228 268 200 284 C172 268 154 232 152 190 C150 150 170 120 200 120 Z" fill="#f472b6" opacity=".9" stroke="#9d174d" stroke-width="2.4"/>
  <path d="M200 200 C202 236 204 264 202 286 L198 286 C196 264 198 236 200 200 Z" fill="#9d174d" opacity=".5"/>
  ${l(200, 104, 'رحم')}
  ${l(120, 130, 'لوله رحمی (فالوپ)')}
  <path d="M152 160 C120 150 96 132 84 108" stroke="#f472b6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M248 160 C280 150 304 132 316 108" stroke="#f472b6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <g stroke="#f9a8d4" stroke-width="3" fill="none" stroke-linecap="round"><path d="M84 108 L70 96 M84 108 L82 90 M84 108 L98 96"/><path d="M316 108 L330 96 M316 108 L318 90 M316 108 L302 96"/></g>
  ${l(66, 84, 'قیف مژگانی')}
  <circle cx="76" cy="140" r="20" fill="#f9a8d4" opacity=".9" stroke="#be185d" stroke-width="2"/>
  <circle cx="324" cy="140" r="20" fill="#f9a8d4" opacity=".9" stroke="#be185d" stroke-width="2"/>
  <circle cx="70" cy="134" r="6" fill="#be185d"/><circle cx="318" cy="134" r="6" fill="#be185d"/>
  <circle cx="82" cy="148" r="4" fill="#be185d"/><circle cx="330" cy="148" r="4" fill="#be185d"/>
  ${l(76, 180, 'تخمدان')}
  ${l(200, 320, 'مهبل (کانال پایین‌رو)')}
  ${l(200, 348, 'لقاح معمولاً در لوله رحمی رخ می‌دهد')}
`, '0 0 400 370');

/* ---------- تولیدمثل مردانه ---------- */
F['repro-m'] = svg(`
  <ellipse cx="150" cy="240" rx="40" ry="28" fill="#f472b6" opacity=".9" stroke="#9d174d" stroke-width="2"/>
  <ellipse cx="210" cy="240" rx="40" ry="28" fill="#f472b6" opacity=".9" stroke="#9d174d" stroke-width="2"/>
  ${l(180, 292, 'بیضه‌ها (در کیسه بیضه)')}
  <path d="M150 214 C148 190 150 168 156 150" stroke="#be185d" stroke-width="5" fill="none"/>
  <path d="M156 150 C164 142 172 146 172 156 C172 166 162 172 154 168" stroke="#be185d" stroke-width="4" fill="none"/>
  ${l(96, 150, 'اپی‌دیدیم — لوله پیچ‌خورده ۶ متری')}
  <path d="M156 150 C120 130 100 110 104 84 C108 62 130 56 150 62" stroke="#be185d" stroke-width="5" fill="none"/>
  <path d="M210 214 C212 190 210 168 204 150" stroke="#be185d" stroke-width="5" fill="none"/>
  <path d="M204 150 C196 142 188 146 188 156 C188 166 198 172 206 168" stroke="#be185d" stroke-width="4" fill="none"/>
  <path d="M204 150 C240 130 260 110 256 84 C252 62 230 56 210 62" stroke="#be185d" stroke-width="5" fill="none"/>
  ${l(240, 150, 'مجرای وازدفران')}
  <rect x="164" y="60" width="32" height="40" rx="12" fill="#f9a8d4" opacity=".9" stroke="#9d174d" stroke-width="2"/>
  ${l(180, 42, 'پروستات')}
  <ellipse cx="236" cy="96" rx="26" ry="14" fill="#c084fc" opacity=".85" stroke="#7e22ce" stroke-width="2"/>
  ${l(300, 96, 'کیسه منوی')}
  ${l(180, 340, 'اسپرم: ۲ تا ۳ درجه خنکی لازم دارد — کیسه بیضه بیرون بدن است')}
`, '0 0 400 370');

})();
