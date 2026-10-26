/* ============================================================
   بدن‌نامه — منطق برنامه v2 (سه‌بعدی‌محور)
   رندر آتلاس واقعی BodyParts3D + محتوای فارسی + آزمون + جستجو
============================================================ */
(function(){
'use strict';

/* ---------- ابزارها ---------- */
const $  = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const app = $('#app');

const SYSTEMS = [...(window.SYSTEMS_A||[]), ...(window.SYSTEMS_B||[])];
const ORG_INDEX = {};
SYSTEMS.forEach(sys => sys.organs.forEach(o => { ORG_INDEX[o.id] = {o, sys}; }));
const BRAIN = window.BRAIN || {views:[],groups:[],parts:{}};
const FA_NAMES = window.FA_NAMES || {};
const FA_TYPES = window.FA_TYPES || [];
const ATLAS_SYS = [
  ['skeletal','اسکلتی','#cdd8e6'],['muscular','عضلانی','#e0685f'],['arterial','سرخرگ‌ها','#d84a4a'],
  ['venous','سیاهرگ‌ها','#5b8def'],['nervous','عصبی','#e8c15a'],['digestive','گوارشی','#f0a94b'],
  ['respiratory','تنفسی','#58b6d8'],['urinary','ادراری','#45c6d8'],['reproductive','تولیدمثل','#d873b8'],
  ['lymphatic','لنفاوی','#58c98a'],['endocrine','غدد درون‌ریز','#e084c8'],['sensory','حسی','#8ab8c8'],
  ['cardiac','قلب','#e05a5a'],['connective','بافت پیوندی','#9aa7b5'],['integumentary','پوست','#d9c9a8']
];
const ATLAS_SYS_FA = Object.fromEntries(ATLAS_SYS);

/* ---------- آیکون‌های خطی (جای ایموجی — سبک درود) ---------- */
const ICON = {
  skeletal:'<path d="M17 10c.7-.7 1.7 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .8.7 1.8 0 2.5l-7 7c-.7.7-1.7 0-2.5 0a2.5 2.5 0 1 0 0 5c.3 0 .5.2.5.5a2.5 2.5 0 1 0 5 0c0-.8-.7-1.8 0-2.5Z"/>',
  muscular:'<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  nervous:'<circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M4.2 4.2l5 5M14.8 14.8l5 5M19.8 4.2l-5 5M9.2 14.8l-5 5"/>',
  cardio:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  respiratory:'<path d="M12 3v8"/><path d="M9 11c0-2-1.5-3-3-3s-3 2-3 4.5C3 17 6 21 9 21c1.6 0 3-1.2 3-3"/><path d="M15 11c0-2 1.5-3 3-3s3 2 3 4.5C21 17 18 21 15 21c-1.6 0-3-1.2-3-3"/>',
  digestive:'<path d="M10 3v4c0 3-4 4-4 8a6 6 0 0 0 12 0c0-2-1-3.2-2.2-4.2"/><path d="M9.5 3h4"/>',
  urinary:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  endocrine:'<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5L14.2 10.4a2 2 0 0 1-.2-.9V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  lymphatic:'<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>',
  sensory:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  reproductive:'<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
  brain:'<path d="M9.5 3A2.5 2.5 0 0 1 12 5.5v13a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.5 16 2.5 2.5 0 0 1 3 12a2.5 2.5 0 0 1 1.5-4.58A2.5 2.5 0 0 1 9.5 3Z"/><path d="M14.5 3A2.5 2.5 0 0 0 12 5.5v13a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.5 16a2.5 2.5 0 0 0 1.5-4 2.5 2.5 0 0 0-1.5-4.58A2.5 2.5 0 0 0 14.5 3Z"/>',
  cube:'<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  clipboard:'<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  markers:'<circle cx="12" cy="12" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><circle cx="5" cy="7" r="2"/><circle cx="19" cy="7" r="2"/><path d="M12 14v-4M6.5 15.5 10 13.5M17.5 15.5 14 13.5M6.5 8.5 10 10.5M17.5 8.5 14 10.5"/>'
};
const icon = id => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[id]||ICON.target}</svg>`;

/* نام فارسی ساختار آتلاس */
function faStructName(name, asHtml){
  const base = (name||'').replace(/^(Left|Right)\s+/i,'').trim();
  const key = base.toLowerCase();
  if (FA_NAMES[key]) return FA_NAMES[key];
  for (const [re, t] of FA_TYPES){
    if (re.test(base)) return asHtml ? `${t} <span class="en">${base}</span>` : `${t} ${base}`;
  }
  return asHtml ? `<span class="en">${base}</span>` : base;
}
function atlasSysOf(sysId){ return ATLAS_SYS_FA[sysId] || sysId; }
function atlasColorOf(sysId){
  const f = ATLAS_SYS.find(s => s[0]===sysId);
  return f ? f[2] : '#8ab8c8';
}

/* نگاشت ساختارهای آتلاس به محتوای غنی فارسی سایت */
const PART_TO_ORGAN = {
  'heart':'heart','stomach':'stomach','liver':'liver','spleen':'spleen','pancreas':'pancreas',
  'parenchyma of pancreas':'pancreas','gallbladder':'gallbladder','appendix':'appendix',
  'esophagus':'esophagus','tongue':'tongue-taste','submandibular gland':'mouth','parotid gland':'mouth',
  'trachea':'trachea','lung':'lungs','left lung':'lungs','right lung':'lungs',
  'diaphragm':'diaphragm','left kidney':'kidneys','right kidney':'kidneys','kidney':'kidneys',
  'left ureter':'ureters','right ureter':'ureters','urinary bladder':'bladder','urethra':'urethra',
  'pituitary gland':'pituitary','pineal body':'pineal','left adrenal gland':'adrenal','right adrenal gland':'adrenal',
  'left lobe of thymus':'thymus','right lobe of thymus':'thymus',
  'clavicle':'clavicle','scapula':'scapula','femur':'femur','patella':'patella','tibia':'shank','fibula':'shank',
  'humerus':'humerus','radius':'forearm','ulna':'forearm',
  'hip bone':'pelvis',
  'testis':'male-repro','epididymis':'male-repro','prostate':'male-repro',
  'eyeball':'eye','cornea':'eye','lens':'eye','iris':'eye','retina':'eye','sclera':'eye',
  'external ear':'ear','tympanic membrane':'ear','cochlea':'ear'
};

function organIdForPart(part){
  if (part.system === 'cardiac') return 'heart';
  const base = part.name.replace(/^(Left|Right)\s+/i,'').trim().toLowerCase();
  const direct = PART_TO_ORGAN[base] || PART_TO_ORGAN[part.name.toLowerCase()];
  if (direct) return direct;
  /* عضلات خاص — ترتیب مهم است */
  if (/biceps femoris|semitendinosus|semimembranosus/.test(base)) return 'hamstrings';
  if (/triceps/.test(base)) return 'triceps';
  if (/biceps/.test(base)) return 'biceps';
  if (/deltoid/.test(base)) return 'deltoid';
  if (/pectoralis/.test(base)) return 'pectoral';
  if (/trapezius/.test(base)) return 'trapezius';
  if (/latissimus dorsi/.test(base)) return 'lats';
  if (/gluteus/.test(base)) return 'glutes';
  if (/quadriceps|vastus/.test(base)) return 'quads';
  if (/sartorius/.test(base)) return 'sartorius';
  if (/masseter/.test(base)) return 'masseter';
  if (/gastrocnemius|soleus/.test(base)) return 'calves';
  /* عصب‌های شناخته‌شده */
  if (/sciatic/.test(base)) return 'sciatic';
  if (/vagus/.test(base)) return 'vagus';
  /* دستگاه تنفسی — ریه‌ها به‌شکل درخت برونشیت مدل شده‌اند */
  if (/bronchial tree|lingular|lung/.test(base)) return 'lungs';
  if (/bronchus/.test(base)) return 'bronchi';
  /* کبد و مجاری صفراوی */
  if (/liver|hepatic|biliary/.test(base)) return 'liver';
  if (/cystic/.test(base)) return 'gallbladder';
  if (/spinal cord|cauda equina/.test(base)) return 'spinal-cord';
  /* عصب‌های سر → کاوشگر مغز */
  if (part.system === 'nervous'){
    const cy = (part.bounds[0][1] + part.bounds[1][1]) / 2;
    if (cy > 1.42) return /nerve|ganglion/i.test(base) ? 'cranial-nerves' : 'brain';
    if (/autonomic|sympathetic|parasympathetic/i.test(base)) return 'autonomic';
    return null;
  }
  /* جمجمه، ستون و لگن */
  if (/frontal bone|parietal bone|temporal bone|occipital bone|zygomatic|sphenoid|ethmoid|vomer|lacrimal bone|maxilla|mandible|hyoid/.test(base)) return 'skull';
  if (/atlas|axis|vertebra|sacrum|coccyx/.test(base)) return 'spine';
  if (/ilium|ischium|pubis|hip bone/.test(base)) return 'pelvis';
  if (/sternum|manubrium|xiphoid/.test(base)) return 'sternum';
  if (/vertebra/.test(base)) return 'spine';
  if (/ rib$/.test(base)) return 'ribs';
  if (/phalanx|metacarpal|carpal/i.test(base)) return 'hand';
  if (/metatarsal|tarsal|calcaneus|talus|navicular|cuboid|cuneiform/i.test(base)) return 'foot';
  if (/small intestine|jejunum|ileum|duodenum|colon|cecum|rectum|anal|mesentery|peritoneum|omentum/i.test(base)) return 'small-intestine';
  if (/artery/.test(base)) return 'aorta';
  if (/vein/.test(base)) return 'veins';
  if (/muscle/.test(base)) return 'muscle-types';
  if (/cartilage|ligament|tendon|retinaculum|aponeurosis|raphe|fascia/.test(base)) return 'joints';
  return null;
}

/* نگاشت ساختار آتلاس → داده مغز سایت */
const PART_TO_BRAIN = {
  'cerebellum':'cerebellum','hypothalamus':'hypothalamus','midbrain':'midbrain','pons':'pons',
  'medulla oblongata':'medulla','thalamus':'thalamus','hippocampus':'hippocampus','amygdala':'amygdala',
  'caudate nucleus':'basal-ganglia','putamen':'basal-ganglia','globus pallidus':'basal-ganglia',
  'internal capsule':'basal-ganglia','cingulate gyrus':'cingulate','insula':'insula',
  'corpus callosum':'corpus-callosum','optic chiasm':'pituitary','pituitary gland':'pituitary',
  'pineal body':'pineal','occipital lobe':'occipital-lobe','fourth ventricle':'ventricles',
  'mammillary body':'hypothalamus','optic nerve':'cranial-nerves'
};

function organIdForPart(part){
  if (part.system === 'cardiac') return 'heart';
  const base = part.name.replace(/^(Left|Right)\s+/i,'').trim().toLowerCase();
  const direct = PART_TO_ORGAN[base] || PART_TO_ORGAN[part.name.toLowerCase()];
  if (direct) return direct;
  if (/^(first|second|...)?\s*(cervical|thoracic|lumbar) vertebra/i.test(base) || /vertebra/i.test(base)) return 'spine';
  if (/ rib$/i.test(base)) return 'ribs';
  if (/phalanx/i.test(base)) return 'hand';
  if (/metacarpal/i.test(base)) return 'hand';
  if (/metatarsal|tarsal bone/i.test(base)) return 'foot';
  if (/intestine|jejunum|ileum|duodenum|colon|cecum|rectum|anal/i.test(base)) return 'small-intestine';
  if (/artery/i.test(base)) return 'aorta';
  if (/vein/i.test(base)) return 'veins';
  if (/nerve/i.test(base)) return 'sciatic';
  if (/muscle/i.test(base)) return 'muscle-types';
  if (/cartilage|ligament|tendon/i.test(base)) return 'joints';
  return null;
}
/* همه قطعات سه‌بعدی مرتبط با یک اندام سایت */
function relatedPartIds(organId, parts){
  return parts.filter(p => organIdForPart(p) === organId).map(p => p.id);
}
function brainIdForPart(part){
  const base = part.name.replace(/^(Left|Right)\s+/i,'').trim().toLowerCase();
  return PART_TO_BRAIN[base] || null;
}

/* ---------- ذخیره‌سازی ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};

/* ---------- تصاویر ویکی‌مدیا ---------- */
let IMG = {};
(async () => {
  try {
    const r = await fetch('assets/img/manifest.json');
    if (r.ok) IMG = await r.json();
  } catch(e){}
})();
function imgFor(organId){
  if (IMG[organId]) return IMG[organId];
  return null;
}

/* ---------- منتظر ماژول سه‌بعدی ---------- */
function ensure3D(cb){
  if (window.Body3D) return cb();
  let done = false;
  const t = setTimeout(() => {
    if (!done){ done = true; cb('timeout'); }
  }, 9000);
  window.addEventListener('v3d-ready', () => {
    if (!done){ done = true; clearTimeout(t); cb(); }
  }, { once:true });
}

const loaderHtml = () => `
  <div class="gl3d-loader">
    <svg class="beat" viewBox="0 0 32 32"><path fill="#1D4ED8" d="M16 27S4 19 4 11.5C4 7 7.5 4 11.5 4c2 0 3.6 1 4.5 2.5C16.9 5 18.5 4 20.5 4 24.5 4 28 7 28 11.5 28 19 16 27 16 27z"/></svg>
    <div>در حال باز کردن مدل واقعی بدن انسان…</div>
    <div class="bar"><i></i></div>
    <div class="pct small muted">۰٪</div>
    <div class="err" hidden></div>
  </div>`;
function bindLoader(host){
  const ld = $('.gl3d-loader', host);
  return {
    progress(p){ if (ld){ $('.bar i', ld).style.width = p+'%'; $('.pct', ld).textContent = fa(p)+'٪'; if (p>=100) setTimeout(()=>ld.classList.add('hide'), 350); } },
    fail(msg){ if (ld){ $('.err', ld).hidden = false; $('.err', ld).textContent = msg; $('.bar i', ld).style.width='0%'; $('.pct', ld).textContent=''; } }
  };
}

/* ---------- استیج سه‌بعدی (مشترک) ---------- */
let active3D = null;
function detach3D(){ if (active3D) active3D.detach(); }

function build3DStage(host, { brainOnly, onReset, systems, autoRotate } = {}){
  host.classList.add('stage3d');
  host.innerHTML = `
    <div class="gl3d-canvas"></div>
    <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
    ${loaderHtml()}
    <div class="hud top">
      <div style="display:flex;gap:7px;flex-wrap:wrap" id="hud-views">
        <button class="hud-pill on" data-view="front">روبه‌رو</button>
        <button class="hud-pill" data-view="side">از کنار</button>
        <button class="hud-pill" data-view="back">از پشت</button>
        <button class="hud-pill" data-view="persp">پرسپکتیو ¾</button>
      </div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end">
        <button class="hud-pill" id="hud-quality">⚡ کیفیت: متعادل</button>
        <button class="hud-pill" id="hud-rotate">⟳ چرخش خودکار</button>
        <button class="hud-pill" id="hud-reset">⟲ بازنشانی</button>
      </div>
    </div>
    <div class="hud bottom">
      <button class="hud-pill" id="hud-pan" title="با فعال‌سازی، کشیدن با دکمه چپ موس = جابه‌جایی صحنه">✥ جابه‌جایی</button>
      <button class="hud-pill" id="hud-zout" title="کوچک‌نمایی">－</button>
      <button class="hud-pill" id="hud-zin" title="بزرگ‌نمایی">＋</button>
      <button class="hud-pill" id="hud-isolate">جداسازی انتخاب‌شده</button>
      <button class="hud-pill" id="hud-arrange" title="اجزا کنار هم و مرتب چیده می‌شوند">چیدمان اجزا</button>
      <button class="hud-pill" id="hud-markers" title="نقطه‌های راهنما برای یافتن قطعات ریز">مارکرها</button>
      <label class="hud-pill" style="gap:10px">انفجار لایه‌ها
        <input type="range" id="hud-explode" min="0" max="100" value="0" style="accent-color:var(--acc);width:110px">
      </label>
      <span class="hud-note">کلیک = انتخاب · چرخ موس = زوم · راست‌کلیک-کشیدن = جابه‌جایی</span>
    </div>`;
  const ld = bindLoader(host);
  ensure3D(err => {
    if (err || !window.Body3D){ ld.fail('برای نمای سه‌بعدی، کتابخانه three.js از اینترنت (CDN) بارگذاری می‌شود — اتصال اینترنت لازم است. بقیه صفحات بدون اینترنت کار می‌کنند.'); return; }
    window.Body3D.create($('.gl3d-canvas', host), {
      onProgress: p => ld.progress(p),
      onSelect: (part) => handle3DSelect(part, host, brainOnly)
    }).then(inst => {
      active3D = inst;
      /* وضعیت پیش‌فرض هر صفحه (موتور ماندگار است) */
      inst.setArrange(false); inst.setIsolate(false); inst.select([]);
      inst.setExplode(0); inst.setMarkers(false); inst.setRotate(false);
      if (brainOnly){
        /* فقط سر: دستگاه‌هایی که در ناحیه سر ساختار دارند؛ جمجمه پیش‌فرض خاموش تا مغز دیده شود */
        const headSys = new Set();
        inst.parts.forEach(p => {
          const cy = (p.bounds[0][1] + p.bounds[1][1]) / 2;
          if (cy > 1.42 && ['nervous','sensory','arterial','venous','connective','skeletal'].includes(p.system)) headSys.add(p.system);
        });
        headSys.delete('skeletal');
        inst.setSystems(headSys);
        inst.setView('side');
        /* کلید جمجمه */
        const hud = $('.hud.bottom', host);
        const skullPill = document.createElement('button');
        skullPill.className = 'hud-pill'; skullPill.id = 'hud-skull';
        skullPill.textContent = 'نمایش جمجمه';
        hud.insertBefore(skullPill, hud.firstChild);
        skullPill.addEventListener('click', () => {
          skullPill.classList.toggle('on');
          const on = skullPill.classList.contains('on');
          const sys = new Set(active3D.visibleSystems);
          if (on) sys.add('skeletal'); else sys.delete('skeletal');
          active3D.setSystems(sys);
        });
      }
      else if (systems){
        inst.setSystems(systems);
        if (autoRotate) inst.setRotate(true);
      }
      else {
        inst.setSystems(ATLAS_SYS.map(x => x[0]));
      }
      $('#hud-views', host).addEventListener('click', e => {
        const b = e.target.closest('[data-view]'); if (!b || !active3D) return;
        $$('#hud-views .hud-pill').forEach(x => x.classList.toggle('on', x === b));
        active3D.setView(b.dataset.view);
      });
      $('#hud-rotate', host).addEventListener('click', e => {
        if (!active3D) return;
        e.currentTarget.classList.toggle('on');
        active3D.setRotate(e.currentTarget.classList.contains('on'));
      });
      $('#hud-reset', host).addEventListener('click', () => {
        if (!active3D) return;
        if (onReset){
          active3D.resetAll();
          onReset();
        } else {
          active3D.resetView();
        }
        const sl = $('#hud-explode', host);
        if (sl){ sl.value = 0; sl.disabled = false; }
      });
      $('#hud-explode', host).addEventListener('input', e => { if (active3D) active3D.setExplode(e.target.value/100); });
      $('#hud-pan', host).addEventListener('click', e => {
        if (!active3D) return;
        e.currentTarget.classList.toggle('on');
        active3D.setPan(e.currentTarget.classList.contains('on'));
      });
      $('#hud-zin', host).addEventListener('click', () => { if (active3D) active3D.zoomBy(.78); });
      $('#hud-zout', host).addEventListener('click', () => { if (active3D) active3D.zoomBy(1.28); });
      const qualities = [['mid','متعادل'],['high','بالا'],['low','کم']];
      let qi = 0;
      $('#hud-quality', host).addEventListener('click', e => {
        if (!active3D) return;
        qi = (qi + 1) % qualities.length;
        active3D.setQuality(qualities[qi][0]);
        e.currentTarget.textContent = '⚡ کیفیت: ' + qualities[qi][1];
      });
      $('#hud-arrange', host).addEventListener('click', e => {
        if (!active3D) return;
        e.currentTarget.classList.toggle('on');
        active3D.setArrange(e.currentTarget.classList.contains('on'));
      });
      $('#hud-markers', host).addEventListener('click', e => {
        if (!active3D) return;
        e.currentTarget.classList.toggle('on');
        active3D.setMarkers(e.currentTarget.classList.contains('on'));
      });
      $('#hud-isolate', host).addEventListener('click', e => {
        if (!active3D) return;
        e.currentTarget.classList.toggle('on');
        active3D.setIsolate(e.currentTarget.classList.contains('on'));
      });
      if (opts3D.onReady) opts3D.onReady(inst);
      /* همگام‌سازی همزمان دکمه‌ها با وضعیت واقعی صحنه */
      const isoBtn = $('#hud-isolate', host), sl = $('#hud-explode', host), arrBtn = $('#hud-arrange', host);
      inst.onStateChange = () => {
        const on = !!active3D && active3D.isolate;
        if (isoBtn) isoBtn.classList.toggle('on', on);
        if (sl) sl.disabled = on || (!!active3D && active3D.isArrange());
        if (arrBtn) arrBtn.classList.toggle('on', !!active3D && active3D.isArrange());
      };
      inst.onStateChange();
    }).catch(e => {
      ld.fail('بارگذاری مدل ناموفق بود: ' + (e && e.message ? e.message : e) + ' — مطمئن شوید سایت را با سرور محلی باز کرده‌اید (python -m http.server).');
    });
  });
  return ld;
}
let opts3D = {};

function brainDefaultSelection(){
  // در صفحه مغز به‌طور پیش‌فرض دستگاه عصبی سر برجسته باشد
  return [];
}

function handle3DSelect(part, host, brainOnly){
  const sid = organIdForPart(part);
  const bid = brainIdForPart(part);
  if (brainOnly && bid && BRAIN.parts[bid]){
    if (active3D){ active3D.select([part.id]); syncBrainSide(part, bid); }
    return;
  }
  if (active3D) active3D.select([part.id]);
  if (sid && ORG_INDEX[sid]){ openOrganModal(sid, part); return; }
  /* مودال ساده ساختار آتلاس — با توضیح واقعی اگر موجود باشد */
  const sysFa = atlasSysOf(part.system);
  const color = atlasColorOf(part.system);
  const base = part.name.replace(/^(Left|Right)\s+/i,'').trim().toLowerCase();
  const realDesc = window.FA_DESC && window.FA_DESC[base];
  openModal(`
    <button class="modal-close" aria-label="بستن">✕</button>
    <div class="modal-head" style="--mc:${color}">
      <div class="tag">${sysFa} · مدل واقعی بدن</div>
      <h2>${faStructName(part.name, true)}</h2>
      <div class="en">${part.name}</div>
    </div>
    <div class="modal-body">
      <p class="desc">${realDesc
        ? realDesc
        : 'این یک ساختار <b>واقعی</b> از آتلاس آناتومیک مرجع <span class="en">BodyParts3D</span> است که از تصاویر مقطعی بدن انسان بازسازی شده — مدل را بچرخانید و از همه جهت بررسی کنید.'}</p>
      <div class="facts">
        <div class="fact"><b>شناسه آناتومی:</b> <span class="en">${part.conceptId||part.id}</span></div>
        <div class="fact"><b>دستگاه:</b> ${sysFa}</div>
        <div class="fact"><b>مش سه‌بعدی:</b> ${fa(part.vertexCount.toLocaleString('en-US'))} رأس · ${fa(part.indexCount.toLocaleString('en-US'))} مثلث</div>
      </div>
      <div class="clinical" style="margin-top:14px"><b>🧩 قدم بعدی:</b> از جستجوی همین صفحه، اندام‌های اصلی (قلب، کلیه، معده…) را بنویسید تا <b>همه قطعات آن اندام</b> جداشده و با شرح کامل فارسی باز شوند.</div>
    </div>
  `);
  $('.modal-close').addEventListener('click', closeModal);
}
function syncBrainSide(part, bid){ /* در pageBrain بازنویسی می‌شود */ }
let brainSelectHook = null;

/* ---------- مودال ---------- */
function openModal(html, color){
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" style="--mc:${color||'var(--acc)'}">${html}</div></div>`;
  const bd = $('.modal-backdrop', root);
  bd.addEventListener('click', e => { if (e.target === bd) closeModal(); });
  document.body.style.overflow = 'hidden';
  return $('.modal', root);
}
function closeModal(){
  $('#modal-root').innerHTML = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){ closeModal(); closeSearch(); }
});

/* ---------- مودال اندام (محتوای غنی + تصویر واقعی) ---------- */
function openOrganModal(organId, part3d){
  const rec = ORG_INDEX[organId];
  if (!rec) return;
  const { o, sys } = rec;
  const img = imgFor(organId);
  const imgHtml = img ? `
    <div class="modal-img">
      <img src="assets/img/${img.file}" alt="${o.name}" loading="lazy">
      <div class="credit">تصویر: ${img.title||''} · ${img.license||''} — Wikimedia Commons</div>
    </div>` : '';
  const figHtml = o.figure && window.FIGS[o.figure]
    ? `<h4 class="sub">نمودار تفصیلی</h4><div class="modal-figure"><div class="js-figstage"></div></div>` : '';
  const partHtml = part3d ? `
    <div class="fact" style="margin-top:14px"><b>🔧 همین ساختار در مدل سه‌بعدی:</b> <span class="en">${part3d.name}</span> — <span class="en">${part3d.conceptId||part3d.id}</span></div>` : '';
  const partsHtml = o.parts && o.parts.length ? `
    <h4 class="sub">اجزا و زیربخش‌ها</h4>
    <div class="acc js-acc">${o.parts.map((p,i) => `
      <div class="acc-item${i===0?' open':''}" ${p.hot?`data-hot="${p.hot}"`:''}>
        <button class="acc-head" type="button">${p.name}${p.en?` <span class="en small muted">· ${p.en}</span>`:''}<span class="arrow">▾</span></button>
        <div class="acc-body"><div class="acc-body-inner">${p.desc}</div></div>
      </div>`).join('')}
    </div>` : '';
  const factsHtml = (o.facts && o.facts.length) ? `
    <h4 class="sub">نکات جذاب</h4>
    <div class="facts">${o.facts.map(f => `<div class="fact">${f}</div>`).join('')}</div>` : '';
  const clinHtml = o.clinical ? `<h4 class="sub">نگاه بالینی</h4><div class="clinical"><b>⚡ بالینی:</b> ${o.clinical}</div>` : '';
  const brainBtn = organId === 'brain'
    ? `<button class="btn go-brain" id="go-brain">🧠 رفتن به کاوشگر مغز</button>` : '';
  const modal = openModal(`
    <button class="modal-close" aria-label="بستن">✕</button>
    <div class="modal-head" style="--mc:${sys.color}">
      <div class="tag"><span class="chip-color" style="background:${sys.color}"></span>${sys.name}</div>
      <h2>${o.name}</h2>
      <div class="en">${o.en||''}</div>
    </div>
    <div class="modal-body">
      ${imgHtml}
      <p class="desc">${o.desc}</p>
      ${partHtml}
      ${figHtml}${partsHtml}${factsHtml}${clinHtml}${brainBtn}
    </div>
  `, sys.color);
  $('.modal-close', modal).addEventListener('click', closeModal);
  if (o.figure && window.FIGS[o.figure]){
    const fs = $('.js-figstage', modal);
    const st = mountStage(fs, window.FIGS[o.figure], {});
    fs.addEventListener('click', e => {
      const g = e.target.closest('[data-hot]');
      if (!g || !isClick(st)) return;
      const sel = g.dataset.hot;
      $$('[data-hot]', fs).forEach(el => {
        el.classList.toggle('selected-outline', el.dataset.hot === sel);
        el.classList.toggle('dim', el.dataset.hot !== sel);
      });
      const item = $(`.acc-item[data-hot="${sel}"]`, modal);
      if (item){ $$('.acc-item', modal).forEach(a => a.classList.remove('open')); item.classList.add('open'); }
    });
    $$('.acc-item', modal).forEach(item => {
      $('.acc-head', item).addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        $$('.acc-item', modal).forEach(a => a.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
        const sel = item.dataset.hot;
        if (sel && window.FIGS[o.figure].includes('data-hot')){
          $$('[data-hot]', fs).forEach(el => {
            el.classList.toggle('selected-outline', el.dataset.hot === sel);
            el.classList.toggle('dim', el.dataset.hot !== sel);
          });
        }
      });
    });
  }
  const gb = $('#go-brain', modal);
  if (gb) gb.addEventListener('click', () => { closeModal(); location.hash = '#/brain'; });
}

/* ---------- استیج دو بعدی (بکاپ) ---------- */
function mountStage(host, svgHtml, opts){
  opts = opts || {};
  host.classList.add('stage');
  host.innerHTML = `<div class="stage-viewport">${svgHtml}</div>
    <div class="zoom-bar" aria-hidden="true">
      <button data-z="in" title="بزرگ‌نمایی">+</button>
      <button data-z="out" title="کوچک‌نمایی">−</button>
      <button data-z="reset" title="بازنشانی">⟲</button>
    </div>
    ${opts.note ? `<div class="stage-note">${opts.note}</div>` : ''}`;
  const vp = $('.stage-viewport', host);
  const st = { scale:1, tx:0, ty:0, dragDist:0 };
  const apply = () => { vp.style.transform = `translate(${st.tx}px, ${st.ty}px) scale(${st.scale})`; };
  const clampScale = v => Math.min(8, Math.max(.55, v));
  host.addEventListener('wheel', e => {
    e.preventDefault();
    const r = host.getBoundingClientRect();
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    const ns = clampScale(st.scale * (e.deltaY < 0 ? 1.16 : 1/1.16));
    const k = ns / st.scale;
    st.tx = cx - (cx - st.tx) * k;
    st.ty = cy - (cy - st.ty) * k;
    st.scale = ns; apply();
  }, { passive:false });
  /* چند-لمس: یک انگشت پن، دو انگشت پینچ‌زوم */
  const pts = new Map();
  let pinch0 = 0, scale0 = 1;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    vp.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    st.dragDist = 0; vp.classList.add('dragging');
    if (pts.size === 2){ const a=[...pts.values()]; pinch0 = Math.hypot(a[0].x-a[1].x, a[0].y-a[1].y); scale0 = st.scale; }
  });
  vp.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const p = pts.get(e.pointerId);
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    st.dragDist += Math.abs(dx) + Math.abs(dy);
    if (pts.size === 1){ st.tx += dx; st.ty += dy; apply(); }
    else if (pts.size === 2 && pinch0){
      const a=[...pts.values()];
      const d = Math.hypot(a[0].x-a[1].x, a[0].y-a[1].y);
      st.scale = Math.min(8, Math.max(.55, scale0 * d / pinch0)); apply();
    }
  });
  ['pointerup','pointercancel'].forEach(ev => vp.addEventListener(ev, e => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch0 = 0;
    if (!pts.size) vp.classList.remove('dragging');
  }));
  const zoomBtn = f => {
    const r = host.getBoundingClientRect();
    const cx = r.width/2, cy = r.height/2;
    const ns = clampScale(st.scale * f);
    const k = ns / st.scale;
    st.tx = cx - (cx - st.tx) * k; st.ty = cy - (cy - st.ty) * k;
    st.scale = ns; apply();
  };
  $('.zoom-bar', host).addEventListener('click', e => {
    const z = e.target.dataset && e.target.dataset.z;
    if (z === 'in') zoomBtn(1.3);
    if (z === 'out') zoomBtn(1/1.3);
    if (z === 'reset'){ st.scale = 1; st.tx = 0; st.ty = 0; apply(); }
  });
  vp.addEventListener('dblclick', e => {
    if (e.target.closest('.hot')) return;
    st.scale = 1; st.tx = 0; st.ty = 0; apply();
  });
  st.apply = apply;
  st.vp = vp;
  return st;
}
const isClick = st => st.dragDist < 8;

/* ---------- صفحات ---------- */
function pageHome(){
  const nOrgans = Object.keys(ORG_INDEX).length;
  const nQuiz = (window.QUIZ||[]).length;
  app.innerHTML = `
  <div class="container">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <span class="eyebrow"><span class="dot-live"></span>مدل واقعی BodyParts3D · ۲۲۳۴ ساختار آناتومیک</span>
          <h1>بدن‌نامه</h1>
          <p class="lede">بدن انسان را <b>لایه‌به‌لایه، سه‌بعدی و از هر جهت</b> کاوش کن — هر عضو واقعی را بردار و جدا بررسی کن، شرح فارسی هر ساختار را بخوان و با آزمون محک بزن.</p>
    <div class="hero-cta">
      <a class="btn" href="#/body">کاوش سه‌بعدی بدن</a>
      <a class="btn ghost" href="#/brain">کاوشگر مغز</a>
    </div>
    <span class="dedication">تقدیم به <b>گلسا</b> 🌷</span>
          <div class="stats">
            <div class="stat"><b>۲۲۳۴</b><span>مش سه‌بعدی واقعی</span></div>
            <div class="stat"><b>${fa(SYSTEMS.length)}</b><span>دستگاه بدن</span></div>
            <div class="stat"><b>${fa(nOrgans + Object.keys(BRAIN.parts).length)}</b><span>شرح فارسی</span></div>
            <div class="stat"><b>${fa(nQuiz)}</b><span>سوال آزمون</span></div>
          </div>
        </div>
        <div class="hero-visual-wrap">
          <div class="stage3d" id="hero-3d" style="min-height:560px"></div>
        </div>
      </div>
    </section>

    <div class="section-head"><h2>چه چیزی در انتظار توست</h2></div>
    <div class="grid cols-4">
      <div class="card reveal"><div class="feat"><div class="f-ic">${icon('cube')}</div><div><h4>مدل واقعی سه‌بعدی</h4><p>آناتومی مرجع BodyParts3D — نه نقاشی کارتونی؛ هر رگ، هر استخوان و هر عصب جدا و قابل انتخاب.</p></div></div></div>
      <div class="card reveal"><div class="feat"><div class="f-ic amber">${icon('target')}</div><div><h4>جداسازی و چیدمان</h4><p>ساختار انتخابی را جدا کن، با اسلایدر انفجار لایه‌ها را باز کن و با «چیدمان اجزا» همه را مرتب کنار هم ببین.</p></div></div></div>
      <div class="card reveal"><div class="feat"><div class="f-ic">${icon('book')}</div><div><h4>شرح فارسی عمیق</h4><p>زیربخش‌ها، نکات کلیدی و نگاه بالینی به زبان فارسی روان برای هر اندام.</p></div></div></div>
      <div class="card reveal"><div class="feat"><div class="f-ic amber">${icon('clipboard')}</div><div><h4>آزمون هوشمند</h4><p>۷۵ سوال دسته‌بندی‌شده با توضیح پاسخ و ثبت بهترین رکورد.</p></div></div></div>
    </div>

    <div class="section-head"><h2>۱۱ دستگاه بدن</h2><span class="muted">روی هر دستگاه کلیک کن</span></div>
    <div class="grid cols-4" id="home-systems"></div>

    <div class="dedication-band reveal" style="margin-top:44px">
      <div>
        <h3>تقدیم به گلسا 🌷</h3>
        <p>این اطلس با عشق ساخته شده تا یادگیری آناتومی به زبان فارسی، آسان و زیبا باشد — امید که هر کلیک، یک کشف تازه باشد.</p>
      </div>
      <div class="heart">❤</div>
    </div>
  </div>`;
  $('#home-systems').innerHTML = SYSTEMS.map(sys => `
    <a class="card hoverable reveal" href="#/systems/${sys.id}" style="--sc:${sys.color}">
      <span class="count">${fa(sys.organs.length)} عضو</span>
      <span class="sys-icon">${sys.icon}</span>
      <h3>${sys.name}</h3>
      <span class="en">${sys.en}</span>
      <p>${sys.short}</p>
    </a>`).join('');
  /* هیروی سه‌بعدی */
  detach3D();
  const heroHost = $('#hero-3d');
  heroHost.innerHTML = `
    <div class="gl3d-canvas"></div>
    <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
    ${loaderHtml()}
    <div class="hud bottom"><span class="hud-note">مدل واقعی بدن — بچرخان و بزرگ کن · برای کاوش کامل کلیک کن</span></div>`;
  const ld = bindLoader(heroHost);
  ensure3D(err => {
    if (err || !window.Body3D){ ld.fail('برای مدل سه‌بعدی، اتصال اینترنت لازم است (CDN).'); return; }
    window.Body3D.create($('.gl3d-canvas', heroHost), {
      onProgress: p => ld.progress(p),
      onSelect: () => { location.hash = '#/body'; }
    }).then(inst => {
      active3D = inst;
      inst.setArrange(false); inst.setIsolate(false); inst.select([]);
      inst.setExplode(0); inst.setMarkers(false);
      inst.setSystems(ATLAS_SYS.map(x => x[0]));
      inst.setRotate(true);
    }).catch(e => ld.fail('بارگذاری ناموفق: ' + (e&&e.message||e)));
  });
  bindReveal();
}

function systemCard(sys){
  return `<a class="card hoverable reveal" href="#/systems/${sys.id}" style="--sc:${sys.color}">
    <span class="count">${fa(sys.organs.length)} عضو</span>
    <span class="sys-icon" style="background:color-mix(in srgb, ${sys.color} 12%, #fff);color:${sys.color};border-color:color-mix(in srgb, ${sys.color} 35%, #fff)">${icon(sys.id)}</span>
    <h3>${sys.name}</h3>
    <span class="en">${sys.en}</span><p>${sys.short}</p></a>`;
}

function pageSystems(){
  app.innerHTML = `<div class="container">
    <span class="eyebrow" style="margin-top:12px;display:inline-flex">دستگاه‌های بدن</span>
    <div class="section-head" style="margin-top:6px"><h2>یازده دستگاه، یک بدن</h2><span class="muted">روی هرکدام کلیک کن تا نقشه و اعضایش را ببینی</span></div>
    <div class="grid cols-4">${SYSTEMS.map(systemCard).join('')}</div>
  </div>`;
  bindReveal();
}

/* نگاشت دستگاه‌های سایت به دستگاه‌های آتلاس سه‌بعدی */
const SYS_TO_ATLAS = {
  skeletal:['skeletal'], muscular:['muscular'], nervous:['nervous'],
  cardio:['cardiac','arterial','venous'], respiratory:['respiratory'],
  digestive:['digestive'], urinary:['urinary'], endocrine:['endocrine'],
  lymphatic:['lymphatic'], sensory:['sensory'], reproductive:['reproductive']
};

function pageSystem(id){
  const sys = SYSTEMS.find(s => s.id === id);
  if (!sys){ location.hash = '#/systems'; return; }
  const fig = window.FIGS[sys.figure];
  const atlasSystems = SYS_TO_ATLAS[sys.id] || null;
  const femaleLink = sys.id === 'reproductive'
    ? `<a class="chip" href="#/female" style="border-color:var(--amber);color:var(--amber-dark)">دستگاه تولیدمثل زنانه — تفصیلی با اجزا</a>` : '';
  app.innerHTML = `<div class="container">
    <a class="small muted" href="#/systems">← همه دستگاه‌ها</a>
    <div class="section-head" style="margin-top:8px">
      <h2><span class="sys-icon" style="--sc:${sys.color};display:inline-grid;width:46px;height:46px;vertical-align:middle;margin-inline-end:10px;background:color-mix(in srgb, ${sys.color} 12%, #fff);color:${sys.color};border-color:color-mix(in srgb, ${sys.color} 35%, #fff)">${icon(sys.id)}</span> ${sys.name}</h2>
      <span class="en muted">${sys.en}</span>
    </div>
    <p class="muted" style="max-width:78ch">${sys.overview}</p>
    <div class="chips">${sys.facts.map(f => `<span class="chip" style="cursor:default"><b style="color:${sys.color}">${f.t}</b> ${f.d}</span>`).join('')}${femaleLink}</div>
    ${atlasSystems ? `
      <div class="view-tabs" id="sys-mode" style="margin:6px 0 12px">
        <button class="chip active" data-m="3d">سه‌بعدی واقعی</button>
        ${fig ? `<button class="chip" data-m="2d">نمودار ۲بعدی</button>` : ''}
        <span class="small muted" style="margin-inline-start:6px">کلیک روی هر قطعه = نام و شرح · مارکرها قطعات ریز را نشان می‌دهند</span>
      </div>
      <div id="sys-3d-wrap"><div class="js-sys3d stage-xl"></div></div>
      ${fig ? `<div id="sys-2d-wrap" hidden><div class="js-sysfig stage-lg"></div><p class="small muted">${sys.figureNote||''}</p></div>` : ''}
    ` : (fig ? `<div class="js-sysstage" style="height:560px;margin:18px 0 8px"></div><p class="small muted">${sys.figureNote||''}</p>` : '')}
    <div class="section-head"><h2>اعضای این دستگاه</h2><span class="muted">دکمه ⌖ = جداسازی همان عضو در مدل سه‌بعدی</span></div>
    <div class="organ-list">
      ${sys.organs.map(o => {
        const img = imgFor(o.id);
        return `<div class="organ-row" data-organ="${o.id}" style="--oc:${sys.color};cursor:default">
          ${img?`<img src="assets/img/${img.file}" alt="" loading="lazy">`:''}
          <button class="organ-open" data-organ="${o.id}" style="flex:1;text-align:start;background:none;border:none;color:inherit;font:inherit;cursor:pointer;padding:0">
            <b>${o.name}</b><span>${o.en||''}</span>
          </button>
          ${atlasSystems?`<button class="icon-btn organ-iso" data-iso="${o.id}" title="جداسازی در مدل سه‌بعدی" style="width:34px;height:34px;border-radius:9px">${icon('target')}</button>`:''}
        </div>`;
      }).join('')}
    </div>
  </div>`;

  const wire = () => {
    $$('.organ-open').forEach(b => b.addEventListener('click', () => openOrganModal(b.dataset.organ)));
    $$('.organ-iso').forEach(b => {
      if (!relatedPartIds(b.dataset.iso, ATLAS_PARTS_CACHE || []).length){ b.remove(); return; }
      b.addEventListener('click', async e => {
        e.stopPropagation();
        if (!active3D) return;
        const ids = relatedPartIds(b.dataset.iso, ATLAS_PARTS_CACHE || []);
        if (!ids.length) return;
        active3D.setSystems([...new Set(ATLAS_PARTS_CACHE.filter(p => ids.includes(p.id)).map(p => p.system))]);
        active3D.select(ids);
        active3D.setIsolate(true);
        const sysWrap = $('#sys-3d-wrap');
        if (sysWrap && sysWrap.hidden){ $('#sys-mode [data-m="3d"]')?.click(); }
        closeModal();
      });
    });
  };

  if (atlasSystems){
    detach3D();
    build3DStage($('.js-sys3d'), {
      systems: atlasSystems, autoRotate: true,
      onReset: () => { if (active3D) active3D.setSystems(atlasSystems); }
    });
    atlasData().then(a => { ATLAS_PARTS_CACHE = a ? a.parts : []; wire(); });
    let stage2dMounted = false;
    $('#sys-mode').addEventListener('click', e => {
      const b = e.target.closest('[data-m]'); if (!b) return;
      const is3d = b.dataset.m === '3d';
      $$('#sys-mode .chip[data-m]').forEach(c => c.classList.toggle('active', c === b));
      $('#sys-3d-wrap').hidden = !is3d;
      if ($('#sys-2d-wrap')) $('#sys-2d-wrap').hidden = is3d;
      if (!is3d){
        detach3D();
        if (!stage2dMounted && fig){
          stage2dMounted = true;
          const st = mountStage($('.js-sysfig'), fig, {});
          $('.js-sysfig').addEventListener('click', ev => {
            const g = ev.target.closest('.hot[data-organ]');
            if (g && isClick(st)) openOrganModal(g.dataset.organ);
          });
        }
      }
    });
  } else if (fig){
    const st = mountStage($('.js-sysstage'), fig, {});
    $('.js-sysstage').addEventListener('click', e => {
      const g = e.target.closest('.hot[data-organ]');
      if (g && isClick(st)) openOrganModal(g.dataset.organ);
    });
  }
  if (!atlasSystems) wire();
  bindReveal();
}

/* ---------- کاوش سه‌بعدی بدن ---------- */
let atlasPromise = null;
let ATLAS_PARTS_CACHE = [];
function atlasData(){
  if (!atlasPromise) atlasPromise = fetch('assets/models/atlas.json').then(r => r.json()).then(a => { ATLAS_PARTS_CACHE = a.parts; return a; }).catch(() => null);
  return atlasPromise;
}
const ATLAS_COUNTS = {};
function pageBody(){
  app.innerHTML = `<div class="container">
    <span class="eyebrow" style="margin-top:12px;display:inline-flex"><span class="dot-live"></span>مدل واقعی BodyParts3D · CC-BY 4.0</span>
    <div class="section-head" style="margin-top:6px"><h2>کاوش سه‌بعدی بدن</h2><span class="muted">۲۲۳۴ ساختار واقعی · ۱۵ دستگاه</span></div>
    <div class="chips" id="sex-toggle" style="margin-top:0">
      <button class="chip active" data-sex="male">♂ مرد (مدل مرجع)</button>
      <button class="chip" data-sex="female">♀ زن</button>
      <a class="chip" href="#/female" style="cursor:pointer">🌸 دستگاه تولیدمثل زنانه — تفصیلی</a>
    </div>
    <div id="female-note" class="brain-hint" hidden>♀ در حالت زن، بخش تولیدمثل مردانه از مدل کنار گذاشته می‌شود؛ دستگاه تولیدمثل زنانه را با <a href="#/female">۱۰ بخش تفصیلی و اجزا</a> ببینید. (مدل مرجع BodyParts3D مردانه است)</div>
    <div class="body3d-layout">
      <aside class="brain-side" style="position:sticky;top:calc(var(--topbar-h) + 14px)">
        <div class="brain-detail" style="padding:14px">
          <input id="p3d-search" placeholder="جستجو در ۲۲۳۴ ساختار…" style="width:100%;background:rgba(148,163,184,.08);border:1px solid var(--line);border-radius:10px;padding:9px 13px;color:var(--tx);font-family:inherit;outline:none" autocomplete="off">
          <div id="p3d-results" style="max-height:220px;overflow-y:auto;margin-top:8px"></div>
        </div>
        <div id="p3d-systems">
          ${ATLAS_SYS.map(([id, fa2, col]) => {
            const n = ATLAS_COUNTS[id] || 0;
            return `<label class="bpart" style="width:100%;margin-bottom:6px;border-radius:12px;padding:8px 13px">
              <input type="checkbox" checked data-sys3d="${id}" style="accent-color:${col};width:15px;height:15px">
              <span class="dot" style="background:${col};box-shadow:0 0 8px ${col}"></span>
              <span style="flex:1">${fa2}</span>
              <span class="en small muted">${fa(n)}</span>
            </label>`;
          }).join('')}
        </div>
        <div class="brain-detail" id="p3d-detail" style="min-height:90px">
          <div class="small muted">یک ساختار را از مدل انتخاب کن…</div>
        </div>
      </aside>
      <div>
        <div class="stage3d stage-xl" id="p3d-stage"></div>
        <p class="small muted" style="margin-top:10px">💡 با اسلایدر «انفجار لایه‌ها» بدن باز می‌شود و هر دستگاه به سمت خودش می‌رود. با «جداسازی» فقط ساختار انتخابی می‌ماند و دوربین به آن زوم می‌کند.</p>
      </div>
    </div>
  </div>`;
  build3DStage($('#p3d-stage'), { onReset: () => {
    $$('#p3d-systems input[data-sys3d]').forEach(cb => { cb.checked = true; });
    if (active3D) active3D.setSystems(Object.keys(SYS_COLORS));
    $('#sex-toggle [data-sex="male"]').classList.add('active');
    $('#sex-toggle [data-sex="female"]').classList.remove('active');
    $('#female-note').hidden = true;
  } });
  wireExplorerExtras();
  $('#sex-toggle').addEventListener('click', e => {
    const b = e.target.closest('[data-sex]'); if (!b || !active3D) return;
    const female = b.dataset.sex === 'female';
    $$('#sex-toggle .chip[data-sex]').forEach(c => c.classList.toggle('active', c === b));
    $('#female-note').hidden = !female;
    const cur = new Set(active3D.visibleSystems);
    if (female){ cur.delete('reproductive'); active3D.setSystems([...cur]); }
    else { cur.add('reproductive'); active3D.setSystems([...cur]); }
  });
}
const ATLAS_COUNTS_READY = {};
async function wireExplorerExtras(){
  const a = await atlasData();
  if (a && !ATLAS_COUNTS_READY.done){
    a.parts.forEach(p => ATLAS_COUNTS[p.system] = (ATLAS_COUNTS[p.system]||0)+1);
    ATLAS_COUNTS_READY.done = true;
  }
  $$('#p3d-systems input[data-sys3d]').forEach(cb => {
    const en = cb.parentElement.querySelector('.en');
    const id = cb.dataset.sys3d;
    if (en && id && ATLAS_COUNTS[id]) en.textContent = fa(ATLAS_COUNTS[id]);
  });
  const input = $('#p3d-search'), box = $('#p3d-results');
  if (!input || !a) return;
  /* انتخاب همه قطعات یک اندام + جداسازی + مودال */
  const focusOrgan = (organId) => {
    box.innerHTML = ''; input.value = '';
    if (!active3D){ openOrganModal(organId); return; }
    const ids = relatedPartIds(organId, a.parts);
    if (ids.length){
      const sysIds = [...new Set(a.parts.filter(p => ids.includes(p.id)).map(p => p.system))];
      active3D.setSystems(sysIds);
      $$('#p3d-systems input[data-sys3d]').forEach(cb => cb.checked = sysIds.includes(cb.dataset.sys3d));
      active3D.select(ids);
      $('#hud-isolate').classList.add('on');
      active3D.setIsolate(true);
    }
    openOrganModal(organId);
  };
  window.__focusOrgan = focusOrgan;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2){ box.innerHTML = ''; return; }
    /* ۱) تطابق سطح اندام (محتوای فارسی سایت) */
    const organHits = Object.entries(ORG_INDEX)
      .filter(([id, {o}]) => o.name.includes(q) || (o.en||'').toLowerCase().includes(q))
      .slice(0, 6);
    /* ۲) تطابق سطح قطعه (نام آتلاس یا ترجمه فارسی) */
    const partHits = a.parts
      .filter(p => p.name.toLowerCase().includes(q) || faStructName(p.name).includes(q))
      .filter(p => !organHits.some(([id]) => organIdForPart(p) === id))
      .slice(0, 12);
    box.innerHTML =
      organHits.map(([id, {o, sys}]) => `
        <div class="sr-item" data-organ="${id}">
          <span class="sr-ic">${sys.icon}</span>
          <span style="min-width:0"><b style="font-size:13px;display:block">${o.name}</b><span style="font-size:10.5px">${sys.name} · انتخاب همه قطعات سه‌بعدی</span></span>
        </div>`).join('')
      + partHits.map(p => `<div class="sr-item" data-pid="${p.id}">
          <span class="dot" style="width:8px;height:8px;border-radius:99px;background:${atlasColorOf(p.system)}"></span>
          <span style="min-width:0"><b style="font-size:12.8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">${faStructName(p.name)}</b><span class="en" style="font-size:10.5px">${p.name}</span></span>
        </div>`).join('')
      || '<div class="sr-empty small">پیدا نشد</div>';
    $$('.sr-item[data-organ]', box).forEach(el => el.addEventListener('click', () => focusOrgan(el.dataset.organ)));
    $$('.sr-item[data-pid]', box).forEach(el => el.addEventListener('click', () => {
      const p = a.parts.find(x => x.id === el.dataset.pid);
      if (!p || !active3D) return;
      active3D.select([p.id]);
      active3D.setSystems([p.system]);
      $$('#p3d-systems input[data-sys3d]').forEach(cb => cb.checked = cb.dataset.sys3d === p.system);
      $('#hud-isolate').classList.add('on');
      active3D.setIsolate(true);
      handle3DSelect(p, $('#p3d-stage'), false);
      box.innerHTML = '';
      input.value = '';
    }));
  });
  $('#p3d-systems').addEventListener('change', () => {
    if (!active3D) return;
    const ids = $$('#p3d-systems input[data-sys3d]').filter(cb => cb.checked).map(cb => cb.dataset.sys3d);
    active3D.setSystems(ids);
  });
}

/* ---------- مغز سه‌بعدی ---------- */
const brainState = { sel:null, bid:null, isolate:false };
function pageBrain(){
  const partIds = Object.keys(BRAIN.parts);
  app.innerHTML = `<div class="container">
    <span class="eyebrow" style="margin-top:12px;display:inline-flex"><span class="dot-live"></span>مدل واقعی مغز — قابل چرخش و جداسازی</span>
    <div class="section-head" style="margin-top:6px"><h2>کاوشگر مغز</h2>
      <div class="view-tabs" style="margin:0" id="brain-modebar">
        <button class="chip active" data-bmode="3d">سه‌بعدی واقعی</button>
        <button class="chip" data-bmode="2d">نماهای تشریحی 2D</button>
      </div>
    </div>
    <div class="brain-hint">💡 ساختار مغز را از فهرست انتخاب کن یا روی مدل کلیک کن؛ با «جداسازی» بقیه کم می‌شوند و دوربین روی همان بخش زوم می‌کند — دقیقاً مثل برداشتن آن از مغز واقعی.</div>
    <div id="brain-3d-wrap">
      <div class="body3d-layout">
        <aside class="brain-side" style="position:sticky;top:calc(var(--topbar-h) + 14px)">
          ${BRAIN.groups.map(g => `
            <div class="bgroup"><h4>${g.name}</h4><div class="bparts">
              ${g.parts.filter(pid => BRAIN.parts[pid]).map(pid => {
                const p = BRAIN.parts[pid];
                return `<button class="bpart" data-bpart="${pid}"><span class="dot" style="background:${p.color}"></span>${p.name}</button>`;
              }).join('')}
            </div></div>`).join('')}
          <div class="brain-detail" id="b3d-detail" style="min-height:140px">
            <div class="small muted">یک ساختار انتخاب کن…</div>
          </div>
        </aside>
        <div class="stage3d stage-xl" id="b3d-stage"></div>
      </div>
    </div>
    <div id="brain-2d-wrap" hidden>
      <div class="view-tabs" id="brain-views">
        ${BRAIN.views.map(v => `<button class="chip${v.id==='lateral'?' active':''}" data-view="${v.id}">${v.name}</button>`).join('')}
      </div>
      <div class="brain-layout">
        <div>
          <div class="js-brainstage stage-xl"></div>
          <div class="legend" id="brain-legend"></div>
        </div>
        <aside class="brain-side">
          <div class="brain-detail" id="brain-detail2d" style="min-height:140px">
            <div class="small muted">یک ساختار انتخاب کن…</div>
          </div>
        </aside>
      </div>
    </div>
  </div>`;

  /* --- حالت سه‌بعدی --- */
  brainSelectHook = (part, bid) => {
    const p = BRAIN.parts[bid];
    const box = $('#b3d-detail');
    if (!box) return;
    if (window.innerWidth <= 1040) box.scrollIntoView({ behavior:'smooth', block:'nearest' });
    box.innerHTML = `
      <h3><span class="chip-color" style="background:${p.color}"></span>${p.name}</h3>
      <div class="en">${p.en||''} · <span class="en">${part.name}</span></div>
      ${p.where ? `<div class="where">📍 ${p.where}</div>` : ''}
      <p>${p.desc}</p>
      ${p.details ? `<ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      ${p.facts ? `<div class="facts">${p.facts.map(f => `<div class="fact">${f}</div>`).join('')}</div>` : ''}`;
  };
  build3DStage($('#b3d-stage'), { brainOnly:true });
  $$('.bpart').forEach(b => b.addEventListener('click', () => {
    const pid = b.dataset.bpart;
    $$('.bpart').forEach(x => x.classList.toggle('sel', x === b));
    if (!active3D) return;
    /* ساختارهای آتلاس که به این مفهوم مغزی مپ می‌شوند */
    const ids = active3D.parts.filter(pp => brainIdForPart(pp) === pid).map(pp => pp.id);
    if (ids.length){
      active3D.setSystems(['nervous','arterial','venous','skeletal','connective','sensory']);
      active3D.select(ids);
      $('#hud-isolate').classList.add('on');
      active3D.setIsolate(true);
      const fake = active3D.parts.find(pp => pp.id === ids[0]);
      brainSelectHook(fake, pid);
    } else {
      const p = BRAIN.parts[pid];
      $('#b3d-detail').innerHTML = `
        <h3><span class="chip-color" style="background:${p.color}"></span>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="clinical"><b>ℹ️ این ساختار در مدل مرجع به‌صورت مجزا مدل نشده</b> — اما نماهای تشریحی ۲D آن را کامل نشان می‌دهند.</div>`;
    }
  }));
  $$('#b3d-detail-wrap [data-bpart]') ;
  /* --- حالت ۲D --- */
  const st2 = { view:'lateral' };
  const renderStage = () => {
    const v = BRAIN.views.find(x => x.id === st2.view);
    mountStage($('.js-brainstage'), window.BRAIN_VIEWS[v.svg], { note:v.note });
    applySel2D();
  };
  const applySel2D = () => {
    $$('.bp', app).forEach(g => g.classList.toggle('sel', g.dataset.part === st2.sel));
  };
  const renderDetail2D = () => {
    const box = $('#brain-detail2d');
    const pid = st2.sel;
    if (!pid){ box.innerHTML = '<div class="small muted">یک ساختار انتخاب کن…</div>'; return; }
    const p = BRAIN.parts[pid];
    const inView = (p.views||[]).includes(st2.view);
    box.innerHTML = `
      <h3><span class="chip-color" style="background:${p.color}"></span>${p.name}</h3>
      <div class="en">${p.en||''}</div>
      ${!inView ? `<div class="clinical" style="margin-top:8px"><b>👁 در نمای فعلی دیده نمی‌شود</b> — نمای دیگری را امتحان کن.</div>` : ''}
      <p>${p.desc}</p>
      ${p.details ? `<ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      ${p.facts ? `<div class="facts">${p.facts.map(f => `<div class="fact">${f}</div>`).join('')}</div>` : ''}`;
  };
  const legIds = () => BRAIN.groups.flatMap(g => g.parts).filter(pid => BRAIN.parts[pid] && (BRAIN.parts[pid].views||[]).includes(st2.view));
  const renderLegend = () => {
    $('#brain-legend').innerHTML = legIds().map(pid => `<span class="lg" data-part="${pid}"><span class="dot" style="background:${BRAIN.parts[pid].color}"></span>${BRAIN.parts[pid].name}</span>`).join('');
  };
  $('#brain-views').addEventListener('click', e => {
    const b = e.target.closest('[data-view]'); if (!b) return;
    st2.view = b.dataset.view;
    $$('#brain-views .chip').forEach(c => c.classList.toggle('active', c === b));
    renderStage(); renderLegend(); renderDetail2D();
  });
  $('#brain-legend').addEventListener('click', e => {
    const g = e.target.closest('[data-part]'); if (!g) return;
    st2.sel = g.dataset.part; applySel2D(); renderDetail2D();
  });
  /* --- تب‌ها --- */
  let stage2dMounted = false;
  $('#brain-modebar').addEventListener('click', e => {
    const b = e.target.closest('[data-bmode]'); if (!b) return;
    const is3d = b.dataset.bmode === '3d';
    $$('#brain-modebar .chip').forEach(c => c.classList.toggle('active', c === b));
    $('#brain-3d-wrap').hidden = !is3d;
    $('#brain-2d-wrap').hidden = is3d;
    if (!is3d){
      detach3D();
      if (!stage2dMounted){ stage2dMounted = true; renderStage(); renderLegend(); }
    }
  });
}
function syncBrainSide(part, bid){
  if (brainSelectHook) brainSelectHook(part, bid);
  const b = $(`.bpart[data-bpart="${bid}"]`);
  if (b){ $$('.bpart').forEach(x => x.classList.toggle('sel', x === b)); }
}

/* ---------- دستگاه تولیدمثل زنانه (تفصیلی) ---------- */
function pageFemale(){
  const F = window.FEMALE || { parts: [], intro: '', note: '' };
  const imgU = IMG['uterus'], imgF = IMG['female-repro'];
  app.innerHTML = `<div class="container">
    <a class="small muted" href="#/body">← کاوش سه‌بعدی</a>
    <span class="eyebrow" style="display:inline-flex;margin-top:10px">🌸 اختصاصی · با جزئیات کامل</span>
    <div class="section-head" style="margin-top:6px"><h2>دستگاه تولیدمثل زنانه</h2><span class="en muted">Female Reproductive System</span></div>
    <p class="muted" style="max-width:80ch">${F.intro||''}</p>
    <div class="brain-hint">ℹ️ ${F.note||''}</div>
    <div class="grid cols-2">
      ${imgU ? `<div class="card"><div class="card-img"><img src="assets/img/${imgU.file}" alt="رحم" style="height:240px;object-fit:contain;background:#fff"></div><h3>رحم، لوله‌ها و تخمدان‌ها</h3><p class="small muted">تصویر: ${imgU.title||''} · ${imgU.license||''} — Wikimedia Commons</p></div>` : ''}
      ${imgF ? `<div class="card"><div class="card-img"><img src="assets/img/${imgF.file}" alt="دستگاه تولیدمثل زنانه" style="height:240px;object-fit:contain;background:#fff"></div><h3>نمای کلی دستگاه</h3><p class="small muted">تصویر: ${imgF.title||''} · ${imgF.license||''} — Wikimedia Commons</p></div>` : ''}
    </div>
    ${window.FIGS['repro-f'] ? `<div class="js-fstage" style="height:440px;margin:20px 0 6px"></div><p class="small muted">نمودار تعاملی — روی اجزا کلیک کنید و زوم کنید.</p>` : ''}
    <div class="section-head"><h2>۱۰ بخش، تک‌تک با اجزا و شرح کامل</h2></div>
    <div id="female-acc">
      ${F.parts.map((p, i) => `
        <div class="card" style="margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <span class="sys-icon" style="--sc:#e879f9;width:42px;height:42px;font-size:20px;margin:0">${fa(i+1)}</span>
            <div><h3>${p.name}</h3><span class="en small muted">${p.en||''}</span></div>
          </div>
          <p class="muted" style="font-size:14px">${p.desc}</p>
          <h4 class="sub" style="margin:16px 0 8px">اجزا</h4>
          <div class="acc">
            ${p.parts.map(pp => `
              <div class="acc-item">
                <button class="acc-head" type="button">${pp.name}<span class="arrow">▾</span></button>
                <div class="acc-body"><div class="acc-body-inner">${pp.desc}</div></div>
              </div>`).join('')}
          </div>
          ${p.facts ? `<h4 class="sub" style="margin:16px 0 8px">نکات جذاب</h4><div class="facts">${p.facts.map(f => `<div class="fact">${f}</div>`).join('')}</div>` : ''}
          ${p.clinical ? `<div class="clinical" style="margin-top:12px"><b>⚡ بالینی:</b> ${p.clinical}</div>` : ''}
        </div>`).join('')}
    </div>
    <div class="card" style="margin-top:8px">
      <h3>⚖️ مقایسه زن و مرد — خلاصه تفاوت‌ها</h3>
      <div class="facts" style="margin-top:12px">
        <div class="fact"><b>لگن:</b> زنانه پهن‌تر و کم‌عمق‌تر با قوس شرمگاهی ~۸۵ درجه (مرد ~۷۰ درجه) — برای مسیر زایمان.</div>
        <div class="fact"><b>هورمون:</b> زن: استروژن و پروژسترون با چرخه ۲۸ روزه · مرد: تستوسترون با ثبات تقریباً یکنواخت.</div>
        <div class="fact"><b>گامت:</b> زن: ~۴۰۰ تخمک در کل عمر (تولد با ذخیره کامل) · مرد: میلیون‌ها اسپرم روزانه (تولید مستمر).</div>
        <div class="fact"><b>گردش خون:</b> خون‌رسانی اندام لگنی زنانه با شاخه‌های رحمی و تخمدانی ویژه‌ای پوشش داده شده که در مدل مردانه وجود ندارند.</div>
      </div>
    </div>
  </div>`;
  if (window.FIGS['repro-f']){
    const st = mountStage($('.js-fstage'), window.FIGS['repro-f'], {});
    void st;
  }
  $$('#female-acc .acc-head').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));
  bindReveal();
}

/* ---------- آزمون ---------- */
const quizState = { scope:'all' };
function shuffle(a){ const r = a.slice(); for (let i=r.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }
function bestKey(scope){ return 'bn-best-' + scope; }
function scopeName(scope){
  if (scope === 'all') return 'همه موضوعات';
  if (scope === 'brain') return 'مغز و اعصاب';
  const s = SYSTEMS.find(x => x.id === scope);
  return s ? s.name : scope;
}
function poolFor(scope){
  const all = window.QUIZ || [];
  if (scope === 'all') return all;
  if (scope === 'brain') return all.filter(q => q.sys === 'brain' || q.sys === 'nervous');
  return all.filter(q => q.sys === scope);
}
function pageQuiz(){
  app.innerHTML = `<div class="container"><div class="quiz-wrap" id="quiz-root"></div></div>`;
  const root = $('#quiz-root');
  const best = store.get(bestKey(quizState.scope), null);
  root.innerHTML = `
    <span class="eyebrow" style="margin-top:12px;display:inline-flex">خودت را محک بزن</span>
    <div class="section-head" style="margin-top:6px"><h2>آزمون آناتومی</h2></div>
    <div class="quiz-card quiz-setup">
      <div>
        <h4 style="margin-bottom:10px">۱) موضوع</h4>
        <div class="chips" id="q-scope">
          <button class="chip${quizState.scope==='all'?' active':''}" data-scope="all">همه</button>
          <button class="chip${quizState.scope==='brain'?' active':''}" data-scope="brain">🧠 مغز و اعصاب</button>
          ${SYSTEMS.map(s => `<button class="chip${quizState.scope===s.id?' active':''}" data-scope="${s.id}"><span class="dot" style="--dot:${s.color}"></span>${s.name}</button>`).join('')}
        </div>
      </div>
      <div>
        <h4 style="margin-bottom:10px">۲) تعداد سوال</h4>
        <div class="chips" id="q-count">
          ${[5,10,15,20].map(n => `<button class="chip${n===10?' active':''}" data-n="${n}">${fa(n)} سوال</button>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <button class="btn" id="q-start">شروع آزمون</button>
        ${best ? `<span class="muted small">🏆 بهترین رکورد «${scopeName(quizState.scope)}»: ${fa(best.score)} از ${fa(best.total)}</span>` : ''}
      </div>
    </div>`;
  let count = 10;
  $('#q-scope').addEventListener('click', e => {
    const b = e.target.closest('[data-scope]'); if (!b) return;
    quizState.scope = b.dataset.scope;
    pageQuiz();
  });
  $('#q-count').addEventListener('click', e => {
    const b = e.target.closest('[data-n]'); if (!b) return;
    count = +b.dataset.n;
    $$('#q-count .chip').forEach(c => c.classList.toggle('active', c === b));
  });
  $('#q-start').addEventListener('click', () => startQuiz(count));

  function startQuiz(n){
    const pool = shuffle(poolFor(quizState.scope)).slice(0, n);
    if (!pool.length){ root.innerHTML = '<div class="quiz-card">سوالی برای این موضوع پیدا نشد؛ موضوع دیگری انتخاب کن.</div>'; return; }
    const qs = pool, review = []; let idx = 0, score = 0;
    renderQuestion();
    function renderQuestion(){
      const q = qs[idx];
      root.innerHTML = `
        <div class="quiz-card">
          <div class="q-progress"><i style="width:${(idx/qs.length)*100}%"></i></div>
          <div class="q-meta"><span>سوال ${fa(idx+1)} از ${fa(qs.length)}</span><span>امتیاز: ${fa(score)}</span></div>
          <div class="q-text">${q.q}</div>
          <div class="q-opts">${q.opts.map((o,i) => `<button class="q-opt" data-i="${i}"><span class="k">${fa(i+1)}</span>${o}</button>`).join('')}</div>
          <div class="q-js-extra"></div>
          <div class="q-footer">
            <span class="muted small">${scopeName(quizState.scope)}</span>
            <button class="btn" id="q-next" style="display:none">سوال بعدی ←</button>
          </div>
        </div>`;
      $$('.q-opt', root).forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
      function answer(i){
        const correct = i === q.a;
        if (correct) score++;
        review.push({ q:q.q, ok:correct, right:q.opts[q.a], why:q.why });
        $$('.q-opt', root).forEach((b,bi) => {
          b.disabled = true;
          if (bi === q.a) b.classList.add('correct');
          else if (bi === i) b.classList.add('wrong');
        });
        $('.q-js-extra', root).innerHTML = `<div class="q-explain">${correct?'✅ <b>درست!</b> ':'❌ <b>اشتباه بود.</b> '}${q.why}</div>`;
        const next = $('#q-next', root); next.style.display = 'inline-flex';
        next.textContent = idx === qs.length-1 ? 'دیدن نتیجه 🏁' : 'سوال بعدی ←';
        next.focus();
        next.addEventListener('click', () => { idx++; if (idx < qs.length) renderQuestion(); else renderResult(); });
      }
    }
    function renderResult(){
      const total = qs.length;
      const pct = Math.round(score/total*100);
      const prev = store.get(bestKey(quizState.scope), null);
      const isBest = !prev || score > prev.score;
      if (isBest) store.set(bestKey(quizState.scope), { score, total });
      const msg = pct >= 90 ? 'فوق‌العاده! تو یک آناتومیست بالقوه‌ای 🏆' : pct >= 70 ? 'خیلی خوب بود! کمی مرور و کامل می‌شود 💪' : pct >= 50 ? 'شروع خوبی است؛ بخش‌های ضعیف را مرور کن 📖' : 'اشکالی ندارد؛ به صفحات دستگاه‌ها سر بزن و دوباره امتحان کن 🌱';
      root.innerHTML = `
        <div class="quiz-card">
          <div class="score-big">${fa(score)} / ${fa(total)}</div>
          <p style="text-align:center" class="muted">${fa(pct)}٪ درست · ${isBest?'🎉 رکورد جدید!':'🏆 رکورد: '+fa(Math.max(prev?prev.score:0, score))}</p>
          <p style="text-align:center;font-weight:700">${msg}</p>
          <div style="display:flex;justify-content:center;gap:10px;margin-top:16px">
            <button class="btn" id="q-retry">آزمون دوباره</button>
            <a class="btn ghost" href="#/systems">مرور دستگاه‌ها</a>
          </div>
        </div>
        <div class="quiz-card" style="margin-top:14px">
          <h4 style="margin-bottom:6px">مرور پاسخ‌ها</h4>
          ${review.map((r,i) => `
            <div class="review-item ${r.ok?'ok':'bad'}">
              <b>${r.ok?'✅':'❌'} ${fa(i+1)}. ${r.q}</b>
              <span class="muted">پاسخ درست: ${r.right}</span>
              <div class="small muted">${r.why}</div>
            </div>`).join('')}
        </div>`;
      $('#q-retry').addEventListener('click', () => pageQuiz());
    }
  }
}

/* ---------- جستجو ---------- */
let searchIndex = null;
function buildSearchIndex(){
  searchIndex = [];
  SYSTEMS.forEach(s => searchIndex.push({ icon:s.icon, title:s.name, sub:'دستگاه بدن', go:() => { location.hash = '#/systems/'+s.id; } }));
  Object.values(ORG_INDEX).forEach(({o, sys}) => searchIndex.push({ icon:sys.icon, title:o.name, sub:sys.name + ' · نمایش سه‌بعدی', go:() => {
    const jump = () => setTimeout(() => { if (window.__focusOrgan) window.__focusOrgan(o.id); else openOrganModal(o.id); }, 400);
    if (location.hash === '#/body') jump();
    else { location.hash = '#/body'; setTimeout(jump, 1200); }
  } }));
  Object.keys(BRAIN.parts).forEach(pid => {
    const p = BRAIN.parts[pid];
    searchIndex.push({ icon:'🧠', title:p.name, sub:'مغز · '+(p.en||''), go:() => { location.hash = '#/brain'; setTimeout(() => { const b = $(`.bpart[data-bpart="${pid}"]`); if (b) b.click(); }, 80); } });
  });
}
async function searchAtlas(q){
  const a = await atlasData();
  return (a ? a.parts : []).filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
}
function openSearch(){
  if (!searchIndex) buildSearchIndex();
  const root = $('#search-root');
  root.innerHTML = `<div class="search-backdrop"><div class="search-box">
    <div class="search-input-row">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="search-input" placeholder="جستجو در ساختارهای بدن… (مثلاً قلب، هیپوکامپ، femur)" autocomplete="off">
    </div>
    <div class="search-results" id="search-results"></div>
    <div class="sr-hint"><span>Enter = نتیجه اول</span><span>Esc = بستن</span></div>
  </div></div>`;
  const input = $('#search-input');
  const results = $('#search-results');
  let current = [];
  const renderResults = async q => {
    q = (q||'').trim().toLowerCase();
    let items = [];
    if (!q){
      items = searchIndex.slice(0, 8);
    } else {
      items = searchIndex.filter(it => (it.title + ' ' + (it.sub||'')).toLowerCase().includes(q)).slice(0, 8);
      const parts = await searchAtlas(q);
      parts.forEach(p => items.push({
        icon:'🧬', title:faStructName(p.name), sub:'مدل سه‌بعدی · '+atlasSysOf(p.system),
        go:() => { location.hash = '#/body'; setTimeout(() => {
          const inp = $('#p3d-search'); if (inp){ inp.value = p.name; inp.dispatchEvent(new Event('input')); } }, 120); }
      }));
    }
    current = items.slice(0, 14);
    results.innerHTML = current.length ? current.map((it,i) => `
      <div class="sr-item" data-i="${i}"><span class="sr-ic">${it.icon}</span><span><b>${it.title}</b><span>${it.sub||''}</span></span></div>`).join('')
      : '<div class="sr-empty">چیزی پیدا نشد؛ عبارت دیگری امتحان کن.</div>';
    $$('.sr-item', results).forEach(el => el.addEventListener('click', () => pick(+el.dataset.i)));
  };
  renderResults('');
  const pick = i => { if (current[i]){ closeSearch(); current[i].go(); } };
  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && current.length) pick(0);
  });
  $('.search-backdrop', root).addEventListener('click', e => { if (e.target.classList.contains('search-backdrop')) closeSearch(); });
  setTimeout(() => input.focus(), 40);
}
function closeSearch(){ $('#search-root').innerHTML = ''; }
$('#open-search').addEventListener('click', openSearch);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); openSearch(); }
});

/* ---------- روتر ---------- */
function route(){
  const hash = location.hash.replace(/^#\/?/, '');
  const [seg, param] = hash.split('/');
  closeModal(); closeSearch(); detach3D();
  window.scrollTo({ top:0 });
  if (seg === 'systems' && param){ pageSystem(param); }
  else if (seg === 'body'){ pageBody(); }
  else if (seg === 'brain'){ pageBrain(); }
  else if (seg === 'female'){ pageFemale(); }
  else if (seg === 'systems'){ pageSystems(); }
  else if (seg === 'quiz'){ pageQuiz(); }
  else if (seg === ''){ pageHome(); }
  else { pageHome(); }
  $$('.nav a').forEach(a => {
    const r = a.dataset.route;
    a.classList.toggle('active', r === (seg || ''));
  });
}
window.addEventListener('hashchange', route);

/* ---------- پوسته (تم روشن رسمی) ---------- */

/* ---------- منوی موبایل ---------- */
$('#menu-toggle').addEventListener('click', () => $('#main-nav').classList.toggle('open'));
$('#main-nav').addEventListener('click', e => { if (e.target.closest('a')) $('#main-nav').classList.remove('open'); });

/* ---------- انیمیشن ورود ---------- */
let io = null;
function bindReveal(){
  if (!('IntersectionObserver' in window)){ $$('.reveal').forEach(el => el.classList.add('in')); return; }
  if (!io) io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold:.12 });
  $$('.reveal:not(.in)').forEach(el => io.observe(el));
}

route();
})();
