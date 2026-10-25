/* ============================================================
   بدن‌نامه — گرافیک: نقشه بدن + نمودار دستگاه‌ها (SVG دست‌ساز)
   همه گروه‌های .hot با data-organ کلیک‌پذیرند.
============================================================ */
(function(){
'use strict';

const V = '0 0 360 780';
const svg = (inner, vb) => `<svg viewBox="${vb||V}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
const hot = (id, sys, inner, extra) => `<g class="hot" data-organ="${id}" data-sys="${sys}" ${extra||''}>${inner}</g>`;
const lbl = (x, y, t, anchor) => `<text class="lbl" x="${x}" y="${y}" text-anchor="${anchor||'middle'}">${t}</text>`;
const lt  = (x, y, t, anchor) => `<text class="lbl lbl-t" x="${x}" y="${y}" text-anchor="${anchor||'middle'}">${t}</text>`;
const lead = (d) => `<path class="leader" d="${d}"/>`;

/* ---------- پایه بدن (سیلوئت) ---------- */
const SIL = `
<g fill="#151f2d">
  <ellipse cx="145" cy="70" rx="7" ry="10"/><ellipse cx="215" cy="70" rx="7" ry="10"/>
  <ellipse cx="180" cy="62" rx="35" ry="45"/>
  <rect x="163" y="94" width="34" height="40" rx="13"/>
  <circle cx="127" cy="163" r="17"/><circle cx="233" cy="163" r="17"/>
  <path d="M118 158 Q180 136 242 158 L238 272 Q234 340 236 442 L124 442 Q126 340 122 272 Z"/>
  <path d="M122 170 C102 212 92 292 96 394" stroke="#151f2d" stroke-width="27" stroke-linecap="round" fill="none"/>
  <path d="M238 170 C258 212 268 292 264 394" stroke="#151f2d" stroke-width="27" stroke-linecap="round" fill="none"/>
  <ellipse cx="96" cy="408" rx="12" ry="17"/><ellipse cx="264" cy="408" rx="12" ry="17"/>
  <path d="M152 436 C149 530 152 632 158 740" stroke="#151f2d" stroke-width="37" stroke-linecap="round" fill="none"/>
  <path d="M208 436 C211 530 208 632 202 740" stroke="#151f2d" stroke-width="37" stroke-linecap="round" fill="none"/>
  <ellipse cx="153" cy="754" rx="15" ry="9"/><ellipse cx="207" cy="754" rx="15" ry="9"/>
</g>`;
const SIL_BACK = `
<g fill="#151f2d">
  <ellipse cx="180" cy="62" rx="35" ry="45"/>
  <rect x="163" y="94" width="34" height="40" rx="13"/>
  <circle cx="127" cy="163" r="17"/><circle cx="233" cy="163" r="17"/>
  <path d="M118 158 Q180 136 242 158 L238 272 Q234 340 236 442 L124 442 Q126 340 122 272 Z"/>
  <path d="M122 170 C102 212 92 292 96 394" stroke="#151f2d" stroke-width="27" stroke-linecap="round" fill="none"/>
  <path d="M238 170 C258 212 268 292 264 394" stroke="#151f2d" stroke-width="27" stroke-linecap="round" fill="none"/>
  <ellipse cx="96" cy="408" rx="12" ry="17"/><ellipse cx="264" cy="408" rx="12" ry="17"/>
  <path d="M152 436 C149 530 152 632 158 740" stroke="#151f2d" stroke-width="37" stroke-linecap="round" fill="none"/>
  <path d="M208 436 C211 530 208 632 202 740" stroke="#151f2d" stroke-width="37" stroke-linecap="round" fill="none"/>
  <ellipse cx="153" cy="754" rx="15" ry="9"/><ellipse cx="207" cy="754" rx="15" ry="9"/>
</g>`;

/* ---------- اجزای آناتومیک (کوتاه) ---------- */
const O = {
  brain: hot('brain','nervous',`<path d="M180 24 C201 24 212 41 210 62 C208 81 197 94 180 96 C163 94 152 81 150 62 C148 41 159 24 180 24 Z" fill="#a78bfa" opacity=".92"/><path d="M180 26 L180 94" stroke="#5b21b6" stroke-width="1.4" opacity=".6"/><path d="M160 42 C168 38 176 40 180 46 M200 50 C194 46 188 48 184 54 M158 70 C166 74 174 72 178 66" stroke="#5b21b6" stroke-width="1.2" fill="none" opacity=".5"/>`),
  eyes: hot('eye','sensory',`<ellipse cx="166" cy="64" rx="5.5" ry="4.5" fill="#f1f5f9"/><ellipse cx="194" cy="64" rx="5.5" ry="4.5" fill="#f1f5f9"/><circle cx="166" cy="64" r="2.2" fill="#0ea5e9"/><circle cx="194" cy="64" r="2.2" fill="#0ea5e9"/>`),
  thyroid: hot('thyroid','endocrine',`<path d="M169 116 C164 116 161 125 163 134 C165 142 174 143 176 134 L176 127 L184 127 L184 134 C186 143 195 142 197 134 C199 125 196 116 191 116 C187 116 184 121 180 121 C176 121 173 116 169 116 Z" fill="#f472b6"/>`),
  trachea: hot('trachea','respiratory',`<rect x="175" y="106" width="10" height="54" rx="5" fill="#38bdf8"/><path d="M180 156 L164 180 M180 156 L196 180" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" fill="none"/>`),
  lungs: hot('lungs','respiratory',`
    <path d="M168 170 C150 170 137 191 135 222 C133 252 141 273 157 275 C171 277 177 264 177 242 L177 186 Z" fill="#38bdf8" opacity=".82"/>
    <path d="M192 170 C210 170 223 191 225 222 C227 250 221 270 207 275 C199 277 195 268 197 254 C199 240 201 228 199 214 L192 186 Z" fill="#38bdf8" opacity=".82"/>
    <path d="M150 178 C142 200 138 236 142 262 M212 178 C220 200 224 236 220 262" stroke="#0284c7" stroke-width="1.6" fill="none" opacity=".7"/>`),
  heart: hot('heart','cardio',`<path d="M177 205 C173 193 186 183 198 189 C212 195 217 211 211 230 C206 246 195 258 186 267 C182 257 171 243 169 229 C167 219 171 210 177 205 Z" fill="#f43f5e"/><path d="M180 212 C183 222 190 228 196 236" stroke="#be123c" stroke-width="1.4" fill="none" opacity=".7"/>`),
  liver: hot('liver','digestive',`<path d="M131 286 C152 275 192 273 208 284 C217 290 215 303 204 309 C182 319 151 319 137 311 C127 305 125 294 131 286 Z" fill="#b45309"/><path d="M176 280 C172 292 168 302 160 310" stroke="#78350f" stroke-width="1.6" fill="none" opacity=".8"/>`),
  gallbladder: hot('gallbladder','digestive',`<ellipse cx="191" cy="315" rx="7" ry="10" fill="#16a34a" transform="rotate(18 191 315)"/>`),
  stomach: hot('stomach','digestive',`<path d="M206 290 C224 285 239 296 241 314 C243 331 234 345 220 347 C207 349 199 340 202 328 C206 323 213 324 215 316 C213 303 202 299 206 290 Z" fill="#f59e0b"/>`),
  spleen: hot('spleen','lymphatic',`<ellipse cx="245" cy="297" rx="9" ry="13" fill="#ef4444" transform="rotate(-14 245 297)"/>`),
  pancreas: hot('pancreas','digestive',`<path d="M198 338 C215 331 233 335 243 343" stroke="#fca5a5" stroke-width="10" stroke-linecap="round" fill="none"/>`),
  kidneys: hot('kidneys','urinary',`<ellipse cx="138" cy="327" rx="12" ry="19" fill="#22d3ee" transform="rotate(-10 138 327)"/><ellipse cx="222" cy="327" rx="12" ry="19" fill="#22d3ee" transform="rotate(10 222 327)"/>`),
  si: hot('small-intestine','digestive',`<path d="M150 366 C135 385 140 406 157 409 C173 412 181 396 168 388 C155 380 162 366 177 366 C193 366 199 381 188 393 C177 405 159 415 149 425 C142 433 151 445 166 443 C180 441 191 430 186 418" stroke="#fbbf24" stroke-width="12" stroke-linecap="round" fill="none"/>`),
  li: hot('large-intestine','digestive',`<rect x="126" y="352" width="21" height="96" rx="10" fill="#d97706"/><rect x="127" y="342" width="110" height="21" rx="10" fill="#d97706"/><rect x="213" y="352" width="21" height="96" rx="10" fill="#d97706"/><path d="M223 448 C223 462 208 468 197 464 C187 461 181 470 179 480" stroke="#d97706" stroke-width="16" stroke-linecap="round" fill="none"/>`),
  appendix: hot('appendix','digestive',`<path d="M137 450 C130 458 127 466 131 473" stroke="#d97706" stroke-width="7" stroke-linecap="round" fill="none"/>`),
  bladder: hot('bladder','urinary',`<ellipse cx="180" cy="464" rx="17" ry="13" fill="#38bdf8"/>`),
  esophagus: hot('esophagus','digestive',`<path d="M181 136 C182 180 184 230 188 284" stroke="#fbbf24" stroke-width="7" stroke-linecap="round" fill="none" opacity=".9"/>`),
  ureters: hot('ureters','urinary',`<path d="M144 344 C150 386 164 428 172 456 M216 344 C210 386 196 428 188 456" stroke="#22d3ee" stroke-width="5" stroke-linecap="round" fill="none"/>`),
  urethra: hot('urethra','urinary',`<path d="M180 476 L180 496" stroke="#22d3ee" stroke-width="5" stroke-linecap="round"/>`),
  spinalCord: hot('spinal-cord','nervous',`<path d="M180 100 L180 452" stroke="#a78bfa" stroke-width="7" stroke-linecap="round"/><g stroke="#a78bfa" stroke-width="2.4" opacity=".8">${(()=>{let s='';for(let y=130;y<=440;y+=31){s+=`<path d="M180 ${y} L164 ${y+8} M180 ${y} L196 ${y+8}"/>`;}return s;})()}</g>`),
  sciatic: hot('sciatic','nervous',`<path d="M146 472 C140 524 146 584 156 644 M214 472 C220 524 214 584 204 644" stroke="#fbbf24" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M156 644 C158 672 158 700 156 724 M204 644 C202 672 202 700 204 724" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round" fill="none"/>`),
  vagus: hot('vagus','nervous',`<path d="M174 138 C168 180 162 240 166 300 C168 330 176 360 188 384" stroke="#c084fc" stroke-width="4" stroke-linecap="round" fill="none" stroke-dasharray="7 5"/>`),
  cranialN: hot('cranial-nerves','nervous',`<g stroke="#c084fc" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M180 88 L164 102 M180 88 L196 102 M180 92 L156 112 M180 92 L204 112 M180 96 L170 118 M180 96 L190 118"/></g>`)
};

/* ---------- استخوان‌ها (نمای روبه‌رو) ---------- */
const B = {
  skull: hot('skull','skeletal',`<path d="M180 22 C203 22 214 40 212 62 C210 82 199 96 180 98 C161 96 150 82 148 62 C146 40 157 22 180 22 Z" fill="#cbd5e1" opacity=".55"/><path d="M164 84 C170 92 190 92 196 84" stroke="#475569" stroke-width="2" fill="none" opacity=".8"/>`),
  spine: hot('spine','skeletal',`<g fill="#cbd5e1" opacity=".6">${(()=>{let s='';const regs=[[104,30,4.2,'#7dd3fc'],[134,72,4.8,'#a5b4fc'],[206,40,5.4,'#c4b5fd']];regs.forEach(r=>{for(let i=0;i<Math.round(r[1]/9);i++){s+=`<rect x="${180-r[2]}" y="${r[0]+i*9}" width="${r[2]*2}" height="6.4" rx="2" fill="${r[3]}" opacity=".55"/>`;}});s+=`<path d="M170 246 L190 246 L186 286 L174 286 Z" fill="#cbd5e1" opacity=".5"/>`;s+=`<path d="M176 286 L184 286 L182 302 L178 302 Z" fill="#cbd5e1" opacity=".5"/>`;return s;})()}</g>`),
  ribs: hot('ribs','skeletal',`<g stroke="#94a3b8" stroke-width="3" fill="none" opacity=".55">${(()=>{let s='';for(let i=0;i<4;i++){const y=176+i*21;s+=`<path d="M177 ${y} C152 ${y+3} 138 ${y+14} 136 ${y+27}"/><path d="M183 ${y} C208 ${y+3} 222 ${y+14} 224 ${y+27}"/>`;}return s;})()}</g>`),
  sternum: hot('sternum','skeletal',`<rect x="175.5" y="164" width="9" height="66" rx="4" fill="#cbd5e1" opacity=".75"/>`),
  clavicle: hot('clavicle','skeletal',`<path d="M177 160 C158 151 141 151 129 159 M183 160 C202 151 219 151 231 159" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round" fill="none" opacity=".75"/>`),
  scapula: hot('scapula','skeletal',`<path d="M124 176 L156 166 L152 232 Z M236 176 L204 166 L208 232 Z" fill="#cbd5e1" opacity=".38"/>`),
  pelvis: hot('pelvis','skeletal',`<path d="M130 436 C132 464 154 478 180 478 C206 478 228 464 230 436 L222 436 C218 456 202 466 180 466 C158 466 142 456 138 436 Z" fill="#cbd5e1" opacity=".55"/>`),
  femur: hot('femur','skeletal',`<path d="M158 480 C154 542 155 578 160 610 M202 480 C206 542 205 578 200 610" stroke="#cbd5e1" stroke-width="11" stroke-linecap="round" fill="none" opacity=".65"/>`),
  patella: hot('patella','skeletal',`<circle cx="159" cy="617" r="8" fill="#cbd5e1" opacity=".7"/><circle cx="201" cy="617" r="8" fill="#cbd5e1" opacity=".7"/>`),
  shank: hot('shank','skeletal',`<path d="M161 628 C163 668 161 700 157 726 M199 628 C197 668 199 700 203 726" stroke="#cbd5e1" stroke-width="8" stroke-linecap="round" fill="none" opacity=".65"/><path d="M170 632 C172 668 171 700 168 724 M190 632 C188 668 189 700 192 724" stroke="#cbd5e1" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".5"/>`),
  humerus: hot('humerus','skeletal',`<path d="M125 176 C112 218 108 248 110 276 M235 176 C248 218 252 248 250 276" stroke="#cbd5e1" stroke-width="10" stroke-linecap="round" fill="none" opacity=".65"/>`),
  forearm: hot('forearm','skeletal',`<path d="M110 288 C105 330 102 362 100 386 M250 288 C255 330 258 362 260 386" stroke="#cbd5e1" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/><path d="M118 292 C114 332 112 364 111 386 M242 292 C246 332 248 364 249 386" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" fill="none" opacity=".5"/>`),
  hand: hot('hand','skeletal',`<ellipse cx="97" cy="406" rx="10" ry="14" fill="#cbd5e1" opacity=".55"/><ellipse cx="263" cy="406" rx="10" ry="14" fill="#cbd5e1" opacity=".55"/>`),
  foot: hot('foot','skeletal',`<ellipse cx="153" cy="752" rx="13" ry="8" fill="#cbd5e1" opacity=".6"/><ellipse cx="207" cy="752" rx="13" ry="8" fill="#cbd5e1" opacity=".6"/>`)
};

/* ---------- عضلات ---------- */
const M = {
  deltoid: hot('deltoid','muscular',`<circle cx="127" cy="164" r="18" fill="#f87171" opacity=".9"/><circle cx="233" cy="164" r="18" fill="#f87171" opacity=".9"/>`),
  pectoral: hot('pectoral','muscular',`<path d="M176 168 C160 162 142 164 132 172 C130 186 136 200 150 206 C164 210 174 200 176 188 Z M184 168 C200 162 218 164 228 172 C230 186 224 200 210 206 C196 210 186 200 184 188 Z" fill="#f87171" opacity=".9"/>`),
  biceps: hot('biceps','muscular',`<ellipse cx="112" cy="228" rx="14" ry="30" fill="#f87171" opacity=".85" transform="rotate(8 112 228)"/><ellipse cx="248" cy="228" rx="14" ry="30" fill="#f87171" opacity=".85" transform="rotate(-8 248 228)"/>`),
  abs: hot('abs','muscular',`<g fill="#f87171" opacity=".9">${(()=>{let s='';for(let i=0;i<3;i++){const y=214+i*44;s+=`<rect x="160" y="${y}" width="18" height="38" rx="8"/><rect x="182" y="${y}" width="18" height="38" rx="8"/>`;}return s;})()}</g>`),
  obliques: hot('obliques','muscular',`<path d="M132 210 C136 254 142 300 152 340 C144 344 134 330 128 296 C123 266 124 232 132 210 Z M228 210 C224 254 218 300 208 340 C216 344 226 330 232 296 C237 266 236 232 228 210 Z" fill="#f87171" opacity=".8"/>`),
  quads: hot('quads','muscular',`<ellipse cx="143" cy="530" rx="17" ry="62" fill="#f87171" opacity=".85"/><ellipse cx="168" cy="530" rx="12" ry="58" fill="#f87171" opacity=".75"/><ellipse cx="217" cy="530" rx="17" ry="62" fill="#f87171" opacity=".85"/><ellipse cx="192" cy="530" rx="12" ry="58" fill="#f87171" opacity=".75"/>`),
  sartorius: hot('sartorius','muscular',`<path d="M160 470 C168 500 178 540 190 580" stroke="#fca5a5" stroke-width="7" stroke-linecap="round" fill="none" opacity=".9"/>`),
  calvesF: hot('calves','muscular',`<ellipse cx="160" cy="672" rx="13" ry="30" fill="#f87171" opacity=".8"/><ellipse cx="200" cy="672" rx="13" ry="30" fill="#f87171" opacity=".8"/>`),
  trapezius: hot('trapezius','muscular',`<path d="M120 154 C152 140 208 140 240 154 C226 176 200 186 180 186 C160 186 134 176 120 154 Z" fill="#f87171" opacity=".9"/>`),
  lats: hot('lats','muscular',`<path d="M124 196 C130 248 142 300 164 334 C152 340 136 322 128 288 C121 258 119 224 124 196 Z M236 196 C230 248 218 300 196 334 C208 340 224 322 232 288 C239 258 241 224 236 196 Z" fill="#f87171" opacity=".85"/>`),
  triceps: hot('triceps','muscular',`<ellipse cx="99" cy="240" rx="12" ry="34" fill="#f87171" opacity=".8" transform="rotate(10 99 240)"/><ellipse cx="261" cy="240" rx="12" ry="34" fill="#f87171" opacity=".8" transform="rotate(-10 261 240)"/>`),
  glutes: hot('glutes','muscular',`<ellipse cx="148" cy="472" rx="27" ry="25" fill="#f87171" opacity=".9"/><ellipse cx="212" cy="472" rx="27" ry="25" fill="#f87171" opacity=".9"/>`),
  hams: hot('hamstrings','muscular',`<ellipse cx="153" cy="566" rx="17" ry="46" fill="#f87171" opacity=".8"/><ellipse cx="207" cy="566" rx="17" ry="46" fill="#f87171" opacity=".8"/>`),
  calves: hot('calves','muscular',`<ellipse cx="157" cy="672" rx="14" ry="32" fill="#f87171" opacity=".8"/><ellipse cx="203" cy="672" rx="14" ry="32" fill="#f87171" opacity=".8"/>`),
  masseter: hot('masseter','muscular',`<ellipse cx="164" cy="76" rx="7" ry="13" fill="#f87171" opacity=".85"/><ellipse cx="196" cy="76" rx="7" ry="13" fill="#f87171" opacity=".85"/>`)
};

/* ---------- عروق ---------- */
const C = {
  arteries: hot('aorta','cardio',`<g stroke="#ef4444" fill="none" stroke-linecap="round"><path d="M196 214 C202 196 196 178 180 172" stroke-width="9"/><path d="M180 172 C170 166 160 162 148 162 M180 172 C186 160 196 156 206 158" stroke-width="6"/><path d="M172 166 C168 152 166 140 166 130 M190 164 C192 150 192 140 191 130" stroke-width="4.4"/><path d="M148 162 C128 168 112 190 106 236 C102 268 100 320 100 380" stroke-width="7"/><path d="M206 162 C226 168 242 190 248 236 C252 268 254 320 254 380" stroke-width="7"/><path d="M186 268 C186 300 182 330 180 372" stroke-width="9"/><path d="M180 372 C170 420 164 480 158 540 C155 590 156 640 159 690" stroke-width="8"/><path d="M180 372 C192 420 198 480 204 540 C207 590 206 640 203 690" stroke-width="8"/></g>`),
  veins: hot('veins','cardio',`<g stroke="#38bdf8" fill="none" stroke-linecap="round" opacity=".85"><path d="M112 386 C112 322 116 270 126 240" stroke-width="6"/><path d="M248 386 C248 322 244 270 234 240" stroke-width="6"/><path d="M160 132 C158 146 158 158 160 166 M200 132 C202 146 202 158 200 166" stroke-width="4"/><path d="M156 694 C152 640 150 580 154 530 C158 486 168 440 176 404" stroke-width="6"/><path d="M206 694 C210 640 212 580 208 530 C204 486 194 440 186 404" stroke-width="6"/><path d="M100 388 C100 330 102 286 110 250" stroke-width="5.4"/><path d="M260 388 C260 330 258 286 250 250" stroke-width="5.4"/></g>`),
  capillaries: hot('capillaries','cardio',`<g fill="#f87171" opacity=".8">${(()=>{let s='';[[150,200],[210,200],[150,300],[210,300],[140,560],[220,560],[120,230],[240,230]].forEach(p=>{for(let i=0;i<4;i++){s+=`<circle cx="${p[0]+(i%2)*6-3}" cy="${p[1]+Math.floor(i/2)*6-3}" r="2.1"/>`;}});return s;})()}</g>`)
};

/* ---------- نقشه بدن: نمای روبه‌رو ---------- */
const FRONT_BODY = SIL
  + B.skull + B.spine + B.ribs + B.sternum + B.clavicle + B.humerus + B.forearm + B.hand
  + B.pelvis + B.femur + B.patella + B.shank + B.foot
  + O.brain + O.eyes + O.thyroid + O.trachea
  + O.lungs + O.heart + O.liver + O.gallbladder + O.stomach + O.spleen + O.pancreas
  + O.kidneys + O.si + O.li + O.appendix + O.bladder
  + lbl(30, 250, 'قلب','middle')
  + lead('M44 246 L166 232')
  + lbl(330, 240, 'ریه‌ها','middle') + lead('M316 236 L226 220')
  + lbl(42, 380, 'کبد','middle') + lead('M56 376 L134 306')
  + lbl(322, 372, 'روده باریک','middle') + lead('M308 368 L192 396')
  + lbl(322, 470, 'مثانه','middle') + lead('M310 466 L198 462')
  + lbl(180, 775, 'نمای روبه‌رو','middle');

/* ---------- نمای پشت ---------- */
const BACK_BODY = SIL_BACK
  + B.spine + B.scapula + B.pelvis + B.femur + B.patella + B.shank
  + O.brain + O.spinalCord + O.kidneys + O.ureters + O.bladder + O.sciatic
  + M.trapezius + M.lats + M.glutes + M.hams + M.calves + M.triceps
  + lbl(64, 210, 'نخاع','middle') + lead('M78 206 L176 206')
  + lbl(300, 320, 'کلیه‌ها','middle') + lead('M288 316 L236 320')
  + lbl(56, 470, 'عصب سیاتیک','middle') + lead('M74 466 L142 480')
  + lbl(180, 775, 'نمای پشت','middle');

window.BODY_FIGS = {
  front: svg(`<g>${FRONT_BODY}</g>`),
  back: svg(`<g>${BACK_BODY}</g>`)
};

/* ---------- نمودار دستگاه اسکلتی ---------- */
window.FIGS = window.FIGS || {};
window.FIGS.skeleton = svg(SIL
  + B.skull + B.spine + B.ribs + B.sternum + B.clavicle + B.scapula + B.humerus + B.forearm + B.hand
  + B.pelvis + B.femur + B.patella + B.shank + B.foot
  + lt(40, 60, 'جمجمه') + lead('M52 56 L150 50')
  + lt(320, 150, 'ترقوه') + lead('M306 146 L232 156')
  + lt(320, 420, 'لگن') + lead('M306 416 L232 432')
  + lt(40, 560, 'ران (فمور)') + lead('M54 556 L152 548')
  + lt(320, 620, 'کشکک') + lead('M306 616 L212 616')
  + lt(320, 700, 'ساق پا') + lead('M306 696 L212 690')
  + lt(40, 300, 'بازو') + lead('M54 296 L106 282')
  + lt(320, 760, 'مچ پا'), V);

/* ---------- دستگاه عضلانی ---------- */
window.FIGS['muscles-front'] = svg(SIL
  + M.masseter + M.deltoid + M.pectoral + M.biceps + M.abs + M.obliques
  + M.quads + M.sartorius + M.calvesF
  + lt(60, 76, 'جویده‌ای') + lead('M74 74 L156 74')
  + lt(320, 190, 'سینه‌ای بزرگ') + lead('M306 186 L232 184')
  + lt(320, 470, 'چهارسر رانی') + lead('M306 466 L236 500')
  + lt(40, 640, 'خیاطه') + lead('M56 636 L182 560'), V);

/* ---------- دستگاه عصبی ---------- */
window.FIGS['nervous-system'] = svg(SIL
  + O.brain + O.cranialN + O.vagus
  + `<ellipse cx="196" cy="88" rx="13" ry="8" fill="#22d3ee" opacity=".9" transform="rotate(-12 196 88)"/>`
  + `<path d="M180 96 C180 106 178 112 176 118" stroke="#ef4444" stroke-width="6" stroke-linecap="round" fill="none"/>`
  + O.spinalCord
  + `<g stroke="#a78bfa" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85">
      <path d="M168 170 C140 176 120 196 112 240 C108 274 106 330 106 380"/>
      <path d="M192 170 C220 176 240 196 248 240 C252 274 254 330 254 380"/>
      <path d="M160 260 C150 300 146 340 148 380"/>
      <path d="M200 260 C210 300 214 340 212 380"/>
     </g>`
  + O.sciatic
  + lt(320, 60, 'مغز و مخچه') + lead('M306 58 L212 60')
  + lt(40, 120, 'عصب‌های جمجمه‌ای') + lead('M56 116 L162 104')
  + lt(320, 210, 'نخاع') + lead('M306 206 L190 206')
  + lt(40, 400, 'شبکه بازویی') + lead('M56 396 L108 384')
  + lt(56, 560, 'عصب سیاتیک') + lead('M70 556 L148 540'), V);

/* ---------- گردش خون ---------- */
window.FIGS.circulatory = svg(SIL
  + `<g opacity=".9">${C.veins}</g>` + O.heart + C.arteries + C.capillaries
  + lt(320, 180, 'شاهرگ (آئورت)') + lead('M306 176 L198 196')
  + lt(40, 320, 'سیاهرگ‌ها (آبی)') + lead('M56 316 L114 300')
  + lt(320, 480, 'سرخرگ‌ها (قرمز)') + lead('M306 476 L186 430')
  + lt(56, 620, 'مویرگ‌ها') + lead('M72 616 L142 580'), V);

/* ---------- تنفسی ---------- */
window.FIGS.respiratory = svg(SIL
  + hot('nose','respiratory',`<path d="M180 30 C188 34 190 44 186 52 L174 52 C170 44 172 34 180 30 Z" fill="#7dd3fc"/>`)
  + hot('pharynx','respiratory',`<path d="M180 56 L180 104" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" opacity=".8"/>`)
  + hot('larynx','respiratory',`<rect x="172" y="104" width="16" height="18" rx="6" fill="#0ea5e9"/>`)
  + O.trachea + O.lungs
  + hot('diaphragm','respiratory',`<path d="M128 286 C152 264 208 264 232 286" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none" opacity=".9"/>`)
  + hot('alveoli','respiratory',`<g fill="#7dd3fc" opacity=".9"><circle cx="152" cy="262" r="3.4"/><circle cx="160" cy="268" r="3.4"/><circle cx="146" cy="270" r="3.4"/><circle cx="210" cy="264" r="3.4"/><circle cx="218" cy="270" r="3.4"/><circle cx="204" cy="270" r="3.4"/></g>`)
  + lt(320, 60, 'حفره بینی') + lead('M306 58 L192 46')
  + lt(320, 110, 'حنجره') + lead('M306 108 L190 112')
  + lt(320, 230, 'ریه‌ها') + lead('M306 226 L226 220')
  + lt(40, 310, 'دیافراگم') + lead('M56 306 L136 290')
  + lt(40, 250, 'نای') + lead('M56 246 L172 200'), V);

/* ---------- گوارشی ---------- */
window.FIGS.digestive = svg(SIL
  + hot('mouth','digestive',`<ellipse cx="180" cy="84" rx="10" ry="6" fill="#fbbf24"/>`)
  + O.esophagus + O.stomach + O.liver + O.gallbladder + O.pancreas + O.si + O.li + O.appendix
  + hot('mouth','digestive',`<g fill="#fbbf24"><circle cx="146" cy="76" r="4"/><circle cx="214" cy="76" r="4"/></g>`)
  + lt(320, 130, 'مری') + lead('M306 126 L184 180')
  + lt(320, 300, 'معده') + lead('M306 296 L236 308')
  + lt(40, 300, 'کبد') + lead('M56 296 L134 300')
  + lt(320, 380, 'روده باریک') + lead('M306 376 L196 386')
  + lt(40, 380, 'روده بزرگ') + lead('M56 376 L132 380')
  + lt(46, 470, 'آپاندیس') + lead('M60 466 L134 460'), V);

/* ---------- ادراری ---------- */
window.FIGS.urinary = svg(SIL_BACK
  + O.kidneys + O.ureters + O.bladder + O.urethra
  + lt(320, 320, 'کلیه‌ها') + lead('M306 316 L236 322')
  + lt(320, 420, 'حالب‌ها') + lead('M306 416 L214 414')
  + lt(46, 470, 'مثانه') + lead('M62 466 L162 462')
  + lt(320, 510, 'مجرای ادرار') + lead('M306 506 L186 490'), V);

/* ---------- غدد ---------- */
window.FIGS.endocrine = svg(SIL
  + O.brain
  + hot('pineal','endocrine',`<circle cx="180" cy="58" r="5" fill="#c4b5fd"/>`)
  + hot('pituitary','endocrine',`<circle cx="180" cy="88" r="5" fill="#e879f9"/>`)
  + O.thyroid
  + hot('thymus','endocrine',`<path d="M168 172 C164 184 168 196 180 198 C192 196 196 184 192 172 C186 168 174 168 168 172 Z" fill="#fca5a5" opacity=".9"/>`)
  + hot('adrenal','endocrine',`<path d="M124 306 C130 300 142 300 148 306 M212 306 C218 300 230 300 236 306" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" fill="none"/>`)
  + hot('pancreatic-islets','endocrine',`<path d="M198 338 C215 331 233 335 243 343" stroke="#fbbf24" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"/>`)
  + hot('gonads','endocrine',`<circle cx="164" cy="436" r="6" fill="#e879f9"/><circle cx="196" cy="436" r="6" fill="#e879f9"/>`)
  + lt(320, 54, 'صنوبری') + lead('M306 52 L186 56')
  + lt(320, 92, 'هیپوفیز') + lead('M306 90 L187 88')
  + lt(40, 130, 'تیروئید') + lead('M56 128 L166 128')
  + lt(320, 190, 'تیموس') + lead('M306 186 L194 186')
  + lt(40, 310, 'آدرنال') + lead('M56 306 L126 306')
  + lt(320, 340, 'لوزالمعده') + lead('M306 336 L238 340')
  + lt(46, 440, 'غدد جنسی') + lead('M64 436 L156 436'), V);

/* ---------- لنفاوی ---------- */
window.FIGS.lymphatic = svg(SIL
  + hot('tonsils','lymphatic',`<circle cx="168" cy="98" r="4.4" fill="#4ade80"/><circle cx="192" cy="98" r="4.4" fill="#4ade80"/>`)
  + hot('lymph-nodes','lymphatic',`<g fill="#4ade80">${(()=>{let s='';const cl=[[136,150],[224,150],[100,240],[260,240],[130,470],[230,470]];cl.forEach(p=>{for(let i=0;i<4;i++){s+=`<circle cx="${p[0]+(i%2)*9-4}" cy="${p[1]+Math.floor(i/2)*9-4}" r="3.6"/>`;}});return s;})()}</g>`)
  + hot('thymus','lymphatic',`<path d="M168 172 C164 184 168 196 180 198 C192 196 196 184 192 172 C186 168 174 168 168 172 Z" fill="#4ade80" opacity=".9"/>`)
  + hot('spleen','lymphatic',`<ellipse cx="245" cy="297" rx="9" ry="13" fill="#4ade80" transform="rotate(-14 245 297)"/>`)
  + hot('bone-marrow-imm','lymphatic',`<g stroke="#4ade80" stroke-width="4" stroke-linecap="round" fill="none" opacity=".85"><path d="M160 480 C156 540 156 600 160 660"/><path d="M200 480 C204 540 204 600 200 660"/></g>`)
  + `<g stroke="#4ade80" stroke-width="2" fill="none" opacity=".5"><path d="M168 98 C150 130 132 180 124 240 M192 98 C210 130 228 180 236 240 M124 244 C120 320 124 400 132 466 M236 244 C240 320 236 400 228 466 M180 198 C170 260 150 340 134 466 M180 198 C190 260 210 340 226 466"/></g>`
  + lt(320, 96, 'لوزه‌ها') + lead('M306 94 L196 96')
  + lt(40, 152, 'گره‌های لنفی') + lead('M58 150 L132 152')
  + lt(320, 190, 'تیموس') + lead('M306 186 L194 186')
  + lt(320, 300, 'طحال') + lead('M306 296 L256 298')
  + lt(46, 560, 'مغز استخوان') + lead('M62 556 L158 550'), V);

/* ---------- حسی (ترکیبی) ---------- */
window.FIGS.sensory = svg(`
  <g class="hot" data-organ="eye" data-sys="sensory">
    <path d="M60 150 C110 96 210 96 260 150 C210 204 110 204 60 150 Z" fill="#151f2d" stroke="#fb923c" stroke-width="2.4"/>
    <circle cx="160" cy="150" r="44" fill="#1e293b" stroke="#fb923c" stroke-width="2"/>
    <circle cx="160" cy="150" r="21" fill="#0c4a6e"/>
    <circle cx="160" cy="150" r="9" fill="#020617"/>
    <circle cx="169" cy="141" r="4" fill="#e0f2fe" opacity=".9"/>
    ${lt(160, 236, 'چشم — مرکز بینایی')}
  </g>
  <g class="hot" data-organ="ear" data-sys="sensory">
    <path d="M380 110 C360 78 410 60 430 92 C446 116 440 150 428 170 C418 188 424 204 438 210" fill="none" stroke="#fb923c" stroke-width="7" stroke-linecap="round"/>
    <circle cx="424" cy="150" r="9" fill="#0c4a6e"/>
    <path d="M420 220 C450 232 470 244 478 262" stroke="#fb923c" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M478 262 C506 246 522 272 508 292 C498 306 480 306 470 296" stroke="#22d3ee" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${lt(430, 336, 'گوش — شنوایی و تعادل')}
  </g>
  <g class="hot" data-organ="nose-smell" data-sys="sensory">
    <path d="M84 280 C92 262 116 262 124 280 C130 294 122 306 104 306 C86 306 78 294 84 280 Z" fill="#151f2d" stroke="#fb923c" stroke-width="2.4"/>
    ${lt(104, 340, 'بویایی')}
  </g>
  <g class="hot" data-organ="tongue-taste" data-sys="sensory">
    <path d="M240 268 C240 250 268 246 280 258 C296 250 322 254 322 272 C322 296 300 312 281 312 C262 312 240 294 240 268 Z" fill="#f87171" stroke="#fb923c" stroke-width="2.4"/>
    <g fill="#fbbf24"><circle cx="264" cy="282" r="3"/><circle cx="280" cy="290" r="3"/><circle cx="296" cy="284" r="3"/></g>
    ${lt(281, 340, 'چشایی')}
  </g>
  <g class="hot" data-organ="skin-touch" data-sys="sensory">
    <rect x="420" y="262" width="150" height="52" rx="10" fill="#151f2d" stroke="#fb923c" stroke-width="2.4"/>
    <g stroke="#fbbf24" stroke-width="2" opacity=".8"><path d="M440 274 L560 274"/><path d="M440 306 L560 306"/></g>
    ${lt(495, 340, 'پوست — لمس')}
  </g>
`, '0 0 640 380');

})();
