/* ============================================================
   بدن‌نامه — گرافیک: نماهای چهارگانه مغز
   هر ناحیه: <g class="hot" data-part="..."> — رنگ‌ها از data-brain.js
============================================================ */
(function(){
'use strict';
window.BRAIN_VIEWS = window.BRAIN_VIEWS || {};
const P = window.BRAIN.parts;
const col = id => (P[id] && P[id].color) || '#94a3b8';
const hotP = (id, inner) => `<g class="hot bp" data-part="${id}" fill="${col(id)}">${inner}</g>`;
const svg = (inner, vb) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
const l = (x, y, t, anchor) => `<text class="lbl" x="${x}" y="${y}" text-anchor="${anchor||'middle'}">${t}</text>`;

/* ============ نمای جانبی (رو به چپ) ============ */
window.BRAIN_VIEWS['brain-lateral'] = svg(`
  ${hotP('temporal-lobe', `<path d="M175 214 C205 202 258 190 305 178 L352 244 C344 268 318 288 284 296 C248 304 212 296 190 276 C176 262 168 234 175 214 Z"/>`)}
  ${hotP('occipital-lobe', `<path d="M400 186 C424 190 440 208 438 230 C436 250 420 264 398 262 L352 244 C362 222 380 200 400 186 Z"/>`)}
  ${hotP('parietal-lobe', `<path d="M305 72 C350 80 385 102 402 134 C410 152 408 170 400 186 L305 178 Z"/>`)}
  ${hotP('frontal-lobe', `<path d="M150 210 C118 168 130 104 190 80 C230 64 274 62 305 72 L305 175 C260 188 205 202 175 214 C164 218 156 216 150 210 Z"/>`)}
  <g fill="none" stroke="rgba(2,6,23,.4)" stroke-width="2.2">
    <path d="M305 74 L303 176"/><path d="M160 208 C210 196 260 184 306 176"/>
    <path d="M190 96 C200 120 200 150 192 176 M225 84 C232 110 232 146 226 172 M262 78 C266 106 266 146 262 176"/>
    <path d="M330 96 C338 122 338 152 332 176 M368 108 C374 130 374 156 368 178"/>
    <path d="M196 226 C220 218 250 212 276 210 M200 254 C226 246 254 242 282 242 M210 280 C236 274 260 270 284 270"/>
    <path d="M352 246 C372 250 388 262 396 280 M356 262 C374 266 388 276 394 292 M352 278 C368 282 380 290 386 302"/>
  </g>
  ${hotP('cerebellum', `<path d="M352 244 C386 258 396 282 386 308 C374 334 342 348 312 338 C292 330 282 312 286 292 C292 268 316 250 352 244 Z"/>
    <path d="M322 274 C344 268 366 272 380 284 M318 292 C342 288 364 292 378 302 M324 310 C344 308 362 312 374 320" stroke="rgba(2,6,23,.45)" stroke-width="2.2" fill="none"/>`)}
  ${hotP('midbrain', `<path d="M292 232 C286 244 284 252 286 260 L312 258 C312 248 310 238 306 230 Z"/>`)}
  ${hotP('pons', `<path d="M286 260 C282 276 284 290 292 298 C302 306 314 304 320 294 C326 284 324 268 318 256 Z"/>`)}
  ${hotP('medulla', `<path d="M294 300 C288 312 284 326 286 338 C288 348 296 350 302 344 C310 336 314 318 316 302 Z"/>`)}
  ${hotP('motor-cortex', `<path d="M297 92 C292 122 292 150 299 174 L313 176 C307 148 307 118 312 94 Z" fill="none" stroke="#f97316" stroke-width="2.6" stroke-dasharray="5 4"/>`)}
  ${hotP('somatosensory', `<path d="M318 94 C314 122 314 150 320 174 L334 172 C328 148 328 118 332 96 Z" fill="none" stroke="#84cc16" stroke-width="2.6" stroke-dasharray="5 4"/>`)}
  ${hotP('broca', `<ellipse cx="205" cy="232" rx="26" ry="17" fill="none" stroke="#38bdf8" stroke-width="2.6" stroke-dasharray="5 4"/>`)}
  ${hotP('wernicke', `<ellipse cx="322" cy="208" rx="27" ry="16" fill="none" stroke="#c084fc" stroke-width="2.6" stroke-dasharray="5 4"/>`)}
  ${hotP('visual-cortex', `<ellipse cx="422" cy="224" rx="16" ry="22" fill="none" stroke="#a78bfa" stroke-width="2.6" stroke-dasharray="5 4"/>`)}
  ${hotP('insula', `<ellipse cx="258" cy="222" rx="20" ry="14" fill="none" stroke="#fda4af" stroke-width="2.2" stroke-dasharray="4 4" opacity=".9"/>`)}
  ${l(206, 62, 'لوب پیشانی')}
  ${l(352, 60, 'لوب آهیانه‌ای')}
  ${l(452, 180, 'پس‌سری')}
  ${l(150, 306, 'گیجگاهی')}
  ${l(392, 342, 'مخچه')}
  ${l(300, 366, 'ساقه مغز')}
  ${l(140, 130, 'جلو')}
`, '0 0 560 440');

/* ============ برش میانی (ساژیتال) ============ */
window.BRAIN_VIEWS['brain-medial'] = svg(`
  <defs><clipPath id="mdCort"><ellipse cx="280" cy="185" rx="168" ry="132"/></clipPath></defs>
  <ellipse cx="280" cy="185" rx="168" ry="132" fill="#475569" opacity=".28"/>
  <g clip-path="url(#mdCort)">
    ${hotP('frontal-lobe', `<rect x="100" y="40" width="130" height="280" transform="rotate(-8 165 180)"/>`)}
    ${hotP('parietal-lobe', `<rect x="230" y="30" width="120" height="160" transform="rotate(4 290 110)"/>`)}
    ${hotP('occipital-lobe', `<rect x="345" y="150" width="120" height="180" transform="rotate(14 405 240)"/>`)}
    ${hotP('temporal-lobe', `<ellipse cx="255" cy="282" rx="78" ry="34"/>`)}
  </g>
  ${hotP('cingulate', `<path d="M150 176 C180 116 268 92 342 112 C372 120 396 138 406 158 C348 130 236 132 178 196 Z"/>`)}
  <g fill="none" stroke="rgba(2,6,23,.35)" stroke-width="2">
    <path d="M170 140 C210 104 280 92 340 100 M160 176 C220 130 300 118 366 128 M176 214 C240 168 330 158 396 172"/>
  </g>
  ${hotP('corpus-callosum', `<path d="M172 196 C200 138 300 118 362 146 C398 162 410 186 404 206 C366 178 252 174 190 210 Z"/>`)}
  ${hotP('ventricles', `<path d="M196 192 C224 140 306 128 352 150 C344 160 300 168 258 178 C232 184 212 190 200 198 Z"/>
    <path d="M298 208 L306 208 L308 246 L296 246 Z"/>`)}
  ${hotP('thalamus', `<ellipse cx="288" cy="210" rx="44" ry="30"/>`)}
  ${hotP('hypothalamus', `<ellipse cx="278" cy="248" rx="24" ry="15"/>`)}
  ${hotP('pineal', `<circle cx="348" cy="192" r="9"/>`)}
  ${hotP('pituitary', `<path d="M276 262 L278 272 M268 276 C264 286 268 294 278 294 C288 294 292 286 288 276 Z"/>`)}
  ${hotP('midbrain', `<path d="M266 262 C276 258 300 258 310 262 C316 268 316 278 310 284 C298 288 280 288 270 282 C264 276 262 268 266 262 Z"/>`)}
  ${hotP('pons', `<path d="M264 284 C258 300 260 318 272 326 C286 334 306 330 312 318 C318 306 314 292 306 282 Z"/>`)}
  ${hotP('medulla', `<path d="M272 326 C268 340 268 354 274 364 C280 372 290 370 294 362 C298 352 298 336 298 326 Z"/>`)}
  ${hotP('cerebellum', `<circle cx="386" cy="300" r="50"/>
    <path d="M386 262 C378 288 378 316 386 340 M370 272 C362 292 362 312 370 330 M402 272 C410 292 410 312 402 330 M356 284 C350 298 350 312 356 324 M416 284 C422 298 422 312 416 324" stroke="rgba(2,6,23,.4)" stroke-width="2" fill="none"/>`)}
  ${hotP('hippocampus', `<path d="M330 254 C344 250 352 258 348 268 C344 276 334 276 330 268 C328 262 330 256 336 254" fill="none" stroke="#4ade80" stroke-width="5" stroke-linecap="round"/>`)}
  ${hotP('amygdala', `<circle cx="308" cy="266" r="8"/>`)}
  ${hotP('basal-ganglia', `<ellipse cx="238" cy="206" rx="26" ry="18"/>`)}
  ${l(148, 88, 'پیشانی')}
  ${l(420, 96, 'سینگولات')}
  ${l(462, 236, 'پس‌سری')}
  ${l(140, 300, 'گیجگاهی')}
  ${l(446, 336, 'مخچه')}
  ${l(238, 380, 'ساقه مغز و بصل‌النخاع')}
  ${l(180, 220, 'جسم پینه‌ای')}
  ${l(340, 300, 'تالاموس')}
`, '0 0 560 440');

/* ============ نمای زیرین (از پایین) ============ */
window.BRAIN_VIEWS['brain-inferior'] = svg(`
  ${hotP('occipital-lobe', `<ellipse cx="280" cy="342" rx="86" ry="42" opacity=".9"/>`)}
  ${hotP('temporal-lobe', `<ellipse cx="118" cy="222" rx="62" ry="82"/>
    <ellipse cx="442" cy="222" rx="62" ry="82"/>`)}
  ${hotP('frontal-lobe', `<ellipse cx="196" cy="104" rx="88" ry="62"/>
    <ellipse cx="364" cy="104" rx="88" ry="62"/>`)}
  ${hotP('midbrain', `<path d="M252 186 C262 176 298 176 308 186 C314 194 314 208 308 216 C296 224 264 224 252 216 C246 208 246 194 252 186 Z"/>`)}
  ${hotP('pons', `<ellipse cx="280" cy="248" rx="52" ry="30"/>`)}
  ${hotP('medulla', `<ellipse cx="280" cy="306" rx="38" ry="24"/>
    <path d="M268 296 L268 318 M292 296 L292 318" stroke="rgba(2,6,23,.4)" stroke-width="2.4" fill="none"/>`)}
  ${hotP('cerebellum', `<ellipse cx="196" cy="348" rx="56" ry="36"/><ellipse cx="364" cy="348" rx="56" ry="36"/>
    <ellipse cx="280" cy="352" rx="18" ry="30"/><path d="M270 336 L290 336 M268 348 L292 348 M270 360 L290 360" stroke="rgba(2,6,23,.35)" stroke-width="2" fill="none"/>`)}
  <g stroke="#f8fafc" stroke-width="4" fill="none" stroke-linecap="round">
    <path d="M236 62 L268 118"/><path d="M324 62 L292 118"/>
    <path d="M268 118 C276 128 284 128 292 118"/>
    <path d="M280 118 L280 140"/>
  </g>
  <circle cx="236" cy="56" r="8" fill="#f1f5f9" stroke="#94a3b8"/><circle cx="324" cy="56" r="8" fill="#f1f5f9" stroke="#94a3b8"/>
  ${hotP('pituitary', `<circle cx="280" cy="160" r="11"/>`)}
  ${hotP('hypothalamus', `<circle cx="266" cy="188" r="7"/><circle cx="294" cy="188" r="7"/>`)}
  <g stroke="#c084fc" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9">
    <path d="M252 74 L258 122 M308 74 L302 122"/>
  </g>
  <g stroke="#c084fc" stroke-width="2.6" fill="none" stroke-linecap="round">
    <path d="M314 216 L340 236 M246 216 L220 236 M316 240 L342 254 M244 240 L218 254"/>
  </g>
  ${l(196, 40, 'لوب‌های پیشانی (سطح چشمی)')}
  ${l(64, 140, 'گیجگاهی')}
  ${l(496, 140, 'گیجگاهی')}
  ${l(280, 410, 'مخچه')}
  ${l(430, 160, 'عصب بینایی و تقاطع')}
  ${l(430, 196, 'هیپوفیز')}
  ${l(430, 246, 'عصب‌های جمجمه‌ای')}
  ${l(196, 428, 'عقب')}
  ${l(386, 428, 'جلو')}
`, '0 0 560 450');

/* ============ نمای بالایی (از بالا) ============ */
window.BRAIN_VIEWS['brain-superior'] = svg(`
  <defs>
    <clipPath id="hemL"><ellipse cx="165" cy="215" rx="112" ry="178"/></clipPath>
    <clipPath id="hemR"><ellipse cx="395" cy="215" rx="112" ry="178"/></clipPath>
  </defs>
  <g clip-path="url(#hemL)">
    ${hotP('frontal-lobe', `<rect x="40" y="20" width="250" height="128"/>`)}
    ${hotP('parietal-lobe', `<rect x="40" y="148" width="250" height="118"/>`)}
    ${hotP('occipital-lobe', `<rect x="40" y="266" width="250" height="140"/>`)}
  </g>
  <g clip-path="url(#hemR)">
    ${hotP('frontal-lobe', `<rect x="270" y="20" width="250" height="128"/>`)}
    ${hotP('parietal-lobe', `<rect x="270" y="148" width="250" height="118"/>`)}
    ${hotP('occipital-lobe', `<rect x="270" y="266" width="250" height="140"/>`)}
  </g>
  <g fill="none" stroke="rgba(2,6,23,.4)" stroke-width="2.2">
    ${(()=>{let s='';for(let i=0;i<6;i++){const x=70+i*20;s+=`<path d="M${x} 40 C${x+16} 80 ${x-10} 120 ${x+10} 160 C${x-8} 200 ${x+12} 240 ${x-6} 280 C${x+10} 320 ${x-8} 350 ${x+8} 380"/>`;s+=`<path d="M${x+230} 40 C${x+246} 80 ${x+220} 120 ${x+240} 160 C${x+222} 200 ${x+242} 240 ${x+224} 280 C${x+240} 320 ${x+222} 350 ${x+238} 380"/>`;}return s;})()}
    <path d="M58 152 C110 162 220 164 272 154" stroke-width="4"/>
    <path d="M288 152 C340 162 450 164 502 154" stroke-width="4"/>
  </g>
  <path d="M277 20 L277 400" stroke="rgba(2,6,23,.6)" stroke-width="7"/>
  ${l(165, 30, 'نیمکره راست بدن')}
  ${l(395, 30, 'نیمکره چپ بدن')}
  ${l(48, 150, 'پیشانی')}
  ${l(46, 224, 'آهیانه‌ای')}
  ${l(48, 300, 'پس‌سری')}
  ${l(280, 428, 'شیار مرکزی: مرز لوب پیشانی و آهیانه‌ای')}
  ${l(288, 30, 'جلو')}
`, '0 0 560 450');

})();
