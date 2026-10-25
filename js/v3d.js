/* ============================================================
   بدن‌نامه — موتور سه‌بعدی
   بارگذاری و رندر آتلاس واقعی BodyParts3D (۲,۲۳۴ مش آناتومیک)
   فرمت: chunks باینری (positions Float32 + normals Int16 + indices Uint32)
============================================================ */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const SYS_COLORS = {
  skeletal:'#cdd8e6', muscular:'#e0685f', arterial:'#d84a4a', venous:'#5b8def',
  nervous:'#e8c15a', digestive:'#f0a94b', respiratory:'#58b6d8', urinary:'#45c6d8',
  reproductive:'#d873b8', lymphatic:'#58c98a', endocrine:'#e084c8', integumentary:'#d9c9a8',
  connective:'#9aa7b5', sensory:'#8ab8c8', cardiac:'#e05a5a'
};

async function decompressGzip(buf){
  if (!(buf[0] === 0x1f && buf[1] === 0x8b)) return buf; /* سرور خودش باز کرده است */
  if (typeof DecompressionStream === 'undefined') throw new Error('مرورگر شما DecompressionStream ندارد؛ از کروم/اج/فایرفاکس جدید استفاده کنید.');
  const ds = new DecompressionStream('gzip');
  const stream = new Blob([buf]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

window.Body3D = {
  async create(host, opts){
    opts = opts || {};
    const BASE = opts.base || 'assets/models/';
    /* ---------- آتلاس ---------- */
    const atlas = await (await fetch(BASE + 'atlas.json')).json();
    const parts = atlas.parts;
    const N = parts.length;
    const width = THREE.MathUtils.ceilPowerOfTwo(N);
    const state = new Float32Array(width * 4);
    const selTex = new Uint8Array(width * 4);
    const partTexture = new THREE.DataTexture(state, width, 1, THREE.RGBAFormat, THREE.FloatType);
    const selectionTexture = new THREE.DataTexture(selTex, width, 1, THREE.RGBAFormat);
    [partTexture, selectionTexture].forEach(t => {
      t.minFilter = t.magFilter = THREE.NearestFilter;
      t.needsUpdate = true;
    });
    const centers = parts.map(p => new THREE.Vector3().fromArray(p.bounds[0]).add(new THREE.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5));
    const bounds = parts.map(p => new THREE.Box3(new THREE.Vector3().fromArray(p.bounds[0]), new THREE.Vector3().fromArray(p.bounds[1])));

    /* ---------- رندرر ---------- */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    } catch(e){
      throw new Error('مرورگر شما WebGL را پشتیبانی نمی‌کند یا غیرفعال است.');
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setPixelRatio(Math.min(devicePixelRatio, host.clientWidth < 768 ? 1.25 : 1.5));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .005, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = .08;
    controls.minDistance = .06; controls.maxDistance = 70;
    controls.maxPolarAngle = Math.PI * .97;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    controls.target.set(0, .85, 0);
    camera.position.set(.6, 1.05, 3.7);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, .04).texture;
    room.dispose(); pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x0a0f16, .85));
    const key = new THREE.DirectionalLight(0xfff2e0, 2.0); key.position.set(-2, 4, 3); scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fd4ff, 1.7); rim.position.set(2.4, 2, -3); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xff9a8a, .45); fill.position.set(0, -2.4, -1.5); scene.add(fill);

    /* زمین: دیسک درخشان و حلقه امضا */
    const glowTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const g = c.getContext('2d').createRadialGradient(128,128,0,128,128,128);
      g.addColorStop(0,'rgba(45,212,191,.32)'); g.addColorStop(.5,'rgba(45,212,191,.08)'); g.addColorStop(1,'rgba(45,212,191,0)');
      const ctx = c.getContext('2d'); ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
      const t = new THREE.CanvasTexture(c); return t;
    })();
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map:glowTex, transparent:true, depthWrite:false }));
    glow.rotation.x = -Math.PI/2; glow.position.y = -.03; scene.add(glow);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.72, .735, 128), new THREE.MeshBasicMaterial({ color:0x2dd4bf, transparent:true, opacity:.38, side:THREE.DoubleSide }));
    ring.rotation.x = -Math.PI/2; ring.position.y = -.012; scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(.60, .604, 128), new THREE.MeshBasicMaterial({ color:0x38bdf8, transparent:true, opacity:.16, side:THREE.DoubleSide }));
    ring2.rotation.x = -Math.PI/2; ring2.position.y = -.012; scene.add(ring2);

    /* ---------- متریال با وضعیت GPU برای هر part ---------- */
    const materials = [];
    const materialFor = (hex, isSkin) => {
      const m = new THREE.MeshStandardMaterial({
        color: hex, metalness:.06, roughness:.5, side:THREE.DoubleSide,
        transparent: isSkin, opacity: isSkin ? .09 : 1, depthWrite: !isSkin
      });
      m.onBeforeCompile = shader => {
        shader.uniforms.partState = { value: partTexture };
        shader.uniforms.selectionState = { value: selectionTexture };
        shader.uniforms.stateWidth = { value: width };
        shader.uniforms.uIsolate = { value: 0 };
        shader.vertexShader = 'attribute float partIndex; uniform sampler2D partState; uniform sampler2D selectionState; uniform float stateWidth; varying float partVisible; varying float partSelected;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\nvec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5); vec4 st = texture2D(partState, stateUv); transformed += st.xyz; partVisible = st.w; partSelected = texture2D(selectionState, stateUv).r;');
        shader.fragmentShader = 'varying float partVisible; varying float partSelected; uniform float uIsolate;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>',
          '#include <clipping_planes_fragment>\nif (partVisible < 0.5) discard;');
        shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>',
          '#include <color_fragment>\nfloat selAmt = partSelected * mix(1.0, 0.12, uIsolate);\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.05, 0.72, 0.63), selAmt);\nfloat rimGlow = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.5);\ndiffuseColor.rgb += vec3(0.02,0.30,0.26) * rimGlow * selAmt;\n#ifdef USE_EMISSIVEMAP\n#else\ntotalEmissiveRadiance += vec3(0.0,0.35,0.30) * selAmt * 0.35;\n#endif');
        m.userData.shader = shader;
      };
      materials.push(m);
      return m;
    };
    const mats = new Map();
    for (const sys in SYS_COLORS) mats.set(sys, materialFor(SYS_COLORS[sys], sys === 'integumentary'));

    /* ---------- بارگذاری chunkها ---------- */
    const geometries = [];
    const pickers = []; /* مش نامرئی تک‌قطعه‌ای برای picking دقیق و سریع */
    let loaded = 0, disposed = false;
    const loadChunk = async ci => {
      const chunk = atlas.chunks[ci];
      const res = await fetch(BASE + chunk.gzip.split('/').pop());
      if (!res.ok) throw new Error('دریافت مدل ناموفق بود (HTTP ' + res.status + ')');
      const gz = new Uint8Array(await res.arrayBuffer());
      const buffer = await decompressGzip(gz);
      if (disposed) return;
      const buffer2 = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      const groups = new Map();
      parts.forEach((p, i) => {
        if (p.chunk !== ci) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer2, p.positions, p.vertexCount * 3), 3));
        g.setAttribute('normal', new THREE.BufferAttribute(new Int16Array(buffer2, p.normals, p.vertexCount * 3), 3, true));
        g.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer2, p.indices, p.indexCount), 1));
        g.setAttribute('partIndex', new THREE.BufferAttribute(new Float32Array(p.vertexCount).fill(i), 1));
        g.boundingBox = bounds[i].clone();
        g.computeBoundingSphere();
        const pk = new THREE.Mesh(g);
        pk.matrixAutoUpdate = false;
        pickers[i] = pk;
        const list = groups.get(p.system) || [];
        list.push(g);
        groups.set(p.system, list);
        geometries.push(g);
      });
      groups.forEach((gs, system) => {
        const merged = mergeGeometries(gs, false);
        if (!merged) return;
        geometries.push(merged);
        const mesh = new THREE.Mesh(merged, mats.get(system));
        mesh.frustumCulled = false;
        mesh.userData.system = system;
        scene.add(mesh);
      });
      loaded++;
      if (opts.onProgress) opts.onProgress(Math.round(loaded / atlas.chunks.length * 100));
    };
    await (async () => {
      let cursor = 0, err = null;
      await Promise.all(Array.from({ length: 3 }, async () => {
        while (cursor < atlas.chunks.length){
          const i = cursor++;
          try { await loadChunk(i); } catch(e){ if (!err) err = e; cursor = atlas.chunks.length; }
        }
      }));
      if (err) throw err;
    })();

    /* ---------- وضعیت و تعامل ---------- */
    const inst = {
      parts, atlas,
      visibleSystems: new Set(Object.keys(SYS_COLORS)),
      selected: [],
      isolate: false, explodeT: 0,
      _view: 'front', _rotate: false, _resetTick: 0,
      _pan: false, _arrange: false, _grid: null,
      onSelect: opts.onSelect || (() => {}),
      onHover: opts.onHover || null
    };
    let lastKey = '', amount = 0, arr = 0, dirty = true, ready = true;

    const applyState = () => {
      const key = [...inst.visibleSystems].sort().join(',') + '|' + inst.selected.join(',')
        + '|' + (inst.isolate ? 1 : 0) + '|' + inst.explodeT.toFixed(3) + '|' + arr.toFixed(2) + '|' + (inst._arrange ? 1 : 0);
      if (key === lastKey) return;
      lastKey = key;
      const sel = new Set(inst.selected);
      const grid = inst._arrange && inst._grid ? inst._grid.map : null;
      parts.forEach((p, i) => {
        const c = centers[i];
        const vis = inst.isolate ? sel.has(p.id) : (inst.visibleSystems.has(p.system) || sel.has(p.id));
        let dx = 0, dy = 0, dz = 0;
        if (grid && grid.has(i)){
          const g = grid.get(i);
          dx = g.x * arr; dy = g.y * arr; dz = g.z * arr;
        } else if (!inst.isolate && inst.explodeT > 0){
          const t = inst.explodeT;
          const groupIdx = Object.keys(SYS_COLORS).indexOf(p.system);
          const angle = groupIdx / 15 * Math.PI * 2;
          dx = Math.sin(angle) * t * .55;
          dy = (c.y - .85) * t * .34;
          dz = Math.cos(angle) * t * .55;
        }
        state.set([dx, dy, dz, vis ? 1 : 0], i * 4);
        selTex[i*4] = sel.has(p.id) ? 255 : 0;
        selTex[i*4+1] = selTex[i*4+2] = selTex[i*4+3] = 0;
        const pk = pickers[i];
        if (pk){ pk.position.set(dx, dy, dz); pk.updateMatrix(); pk.updateMatrixWorld(true); }
      });
      partTexture.needsUpdate = true;
      selectionTexture.needsUpdate = true;
      materials.forEach(m => { if (m.userData.shader) m.userData.shader.uniforms.uIsolate.value = inst.isolate ? 1 : 0; });
      dirty = true;
      if (inst.onStateChange) inst.onStateChange();
    };

    const fitView = (view) => {
      const mobile = host.clientWidth < 768;
      const dist = mobile ? 4.6 : 3.9;
      const dir = view === 'front' ? new THREE.Vector3(0, .02, 1)
        : view === 'back' ? new THREE.Vector3(0, .02, -1)
        : view === 'side' ? new THREE.Vector3(1, .02, 0)
        : new THREE.Vector3(.4, .08, 1).normalize();
      controls.target.set(0, .85, 0);
      camera.position.copy(controls.target).addScaledVector(dir, dist);
      controls.update();
      dirty = true;
    };
    const fitToSelection = () => {
      const box = new THREE.Box3();
      const sel = new Set(inst.selected);
      parts.forEach((p, i) => { if (sel.has(p.id)) box.union(bounds[i]); });
      if (box.isEmpty()) return;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const dist = Math.max(.5, (maxDim / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 2.4);
      controls.target.copy(center);
      camera.position.copy(center).add(new THREE.Vector3(.3, .22, 1).normalize().multiplyScalar(dist));
      controls.update();
      dirty = true;
    };

    /* ---------- picking سریع: پیش‌فیلتر کادر محیطی روی ۲۲۳۴ قطعه ---------- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const tmpBox = new THREE.Box3();
    const tmpPoint = new THREE.Vector3();
    let downPos = null;
    const hoverTip = document.createElement('div');
    hoverTip.className = 'part-hover';
    document.body.appendChild(hoverTip);
    const pickAt = (cx, cy) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set((cx - rect.left) / rect.width * 2 - 1, -((cy - rect.top) / rect.height * 2 - 1));
      raycaster.setFromCamera(pointer, camera);
      let hasSolid = false;
      for (let i = 0; i < parts.length; i++){
        if (state[i*4+3] > .5 && parts[i].system !== 'integumentary'){ hasSolid = true; break; }
      }
      let best = -1, nearest = Infinity;
      for (let i = 0; i < parts.length; i++){
        if (state[i*4+3] < .5) continue;
        const p = parts[i];
        if (p.system === 'integumentary' && hasSolid) continue;
        const pk = pickers[i];
        if (!pk) continue;
        tmpBox.copy(bounds[i]).translate(pk.position);
        if (!raycaster.ray.intersectBox(tmpBox, tmpPoint)) continue;
        const hits = raycaster.intersectObject(pk, false);
        if (hits[0] && hits[0].distance < nearest){ nearest = hits[0].distance; best = i; }
      }
      return best;
    };
    let pendingMove = null;
    const doHover = e => {
      const hit = pickAt(e.clientX, e.clientY);
      if (hit >= 0){
        hoverTip.textContent = inst.parts[hit].name;
        hoverTip.classList.add('show');
        hoverTip.style.left = (e.clientX + 14) + 'px';
        hoverTip.style.top = (e.clientY + 16) + 'px';
        renderer.domElement.style.cursor = 'pointer';
      } else {
        hoverTip.classList.remove('show');
        renderer.domElement.style.cursor = 'grab';
      }
    };
    renderer.domElement.addEventListener('pointermove', e => {
      if (e.buttons){ hoverTip.classList.remove('show'); pendingMove = null; return; }
      pendingMove = e;
    });
    renderer.domElement.addEventListener('pointerdown', e => { downPos = [e.clientX, e.clientY]; });
    renderer.domElement.addEventListener('pointerup', e => {
      if (!downPos) return;
      const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
      downPos = null;
      if (moved > 7) return;
      const hit = pickAt(e.clientX, e.clientY);
      if (hit >= 0) inst.onSelect(inst.parts[hit], hit);
    });
    renderer.domElement.addEventListener('pointerleave', () => hoverTip.classList.remove('show'));

    /* حلقه رندر */
    const clock = new THREE.Clock();
    const resize = () => {
      const w = Math.max(60, host.clientWidth || 0);
      const h = Math.max(60, host.clientHeight || 0);
      if (!w || !h) return;
      renderer.setSize(w, h, false); /* استایل را CSS کنترل می‌کند (۱۰۰٪) */
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    /* تیک‌های تضمینی برای لِی‌اوت‌های دیرهنگام (فونت/گرید/CDN) */
    requestAnimationFrame(resize);
    setTimeout(resize, 300);
    setTimeout(resize, 1000);
    setTimeout(resize, 2500);

    const animate = () => {
      if (disposed) return;
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), .05);
      const arrTarget = inst._arrange ? 1 : 0;
      if (Math.abs(arr - arrTarget) > .001){ arr = THREE.MathUtils.damp(arr, arrTarget, 4, dt); dirty = true; }
      applyState();
      if (pendingMove){ doHover(pendingMove); pendingMove = null; }
      controls.autoRotate = inst._rotate;
      controls.autoRotateSpeed = .8;
      if (controls.autoRotate) dirty = true;
      controls.update();
      if (dirty){ renderer.render(scene, camera); dirty = false; }
      void ready; void dt;
    };
    animate();

    inst.setView = v => { inst._view = v; fitView(v); };
    inst.setRotate = on => { inst._rotate = !!on; dirty = true; };
    inst.setSystems = set => { inst.visibleSystems = new Set(set); if (inst._arrange) computeArrange(); lastKey=''; applyState(); };
    inst.select = ids => { inst.selected = ids || []; if (inst._arrange) computeArrange(); lastKey=''; applyState(); if (inst.isolate && inst.selected.length) fitToSelection(); };
    inst.setIsolate = on => {
      on = !!on;
      if (on && !inst.selected.length) on = false; /* بدون انتخاب، جداسازی بی‌معنی است */
      inst.isolate = on; if (inst._arrange) computeArrange(); lastKey=''; applyState();
      if (on && inst.selected.length) fitToSelection(); else fitView(inst._view);
    };
    inst.setExplode = t => { inst.explodeT = Math.max(0, Math.min(1, t)); lastKey=''; applyState(); };
    inst.resetView = () => { inst.setIsolate(false); inst.select([]); fitView(inst._view); };
    inst.resetAll = () => {
      inst.setSystems(Object.keys(SYS_COLORS));
      inst.select([]);
      inst.setIsolate(false);
      inst.setExplode(0);
      inst.setView('front');
    };
    inst.setPan = on => { inst._pan = !!on; controls.mouseButtons.LEFT = on ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE; };
    inst.zoomBy = f => {
      const v = camera.position.clone().sub(controls.target).multiplyScalar(f);
      const d = v.length();
      if (d < controls.minDistance || d > controls.maxDistance) return;
      camera.position.copy(controls.target).add(v);
      controls.update(); dirty = true;
    };
    inst.setQuality = q => {
      const map = { high: Math.min(devicePixelRatio, 2), mid: Math.min(devicePixelRatio, 1.5), low: 1 };
      renderer.setPixelRatio(map[q] || Math.min(devicePixelRatio, 1.5));
      resize(); dirty = true;
    };
    const computeArrange = () => {
      inst._grid = null;
      if (!inst._arrange) return;
      const order = Object.keys(SYS_COLORS);
      const vis = [];
      parts.forEach((p, i) => {
        const v = inst.isolate ? inst.selected.includes(p.id)
          : (inst.visibleSystems.has(p.system) || inst.selected.includes(p.id));
        if (v) vis.push(i);
      });
      if (!vis.length) return;
      vis.sort((a, b) => {
        const sa = order.indexOf(parts[a].system), sb = order.indexOf(parts[b].system);
        return sa !== sb ? sa - sb : parts[a].name.localeCompare(parts[b].name);
      });
      const cols = Math.max(1, Math.ceil(Math.sqrt(vis.length * 1.4)));
      const rows = Math.ceil(vis.length / cols);
      const cell = Math.max(.14, Math.min(.55, 15 / Math.max(cols, rows)));
      const map = new Map();
      vis.forEach((pi, k) => {
        const col = k % cols, row = Math.floor(k / cols);
        const gx = (col - (cols - 1) / 2) * cell;
        const gy = .9 + ((rows - 1) / 2 - row) * cell;
        map.set(pi, new THREE.Vector3(gx - centers[pi].x, gy - centers[pi].y, -centers[pi].z));
      });
      inst._grid = { map, width: cols * cell, height: rows * cell };
    };
    const fitArrange = () => {
      if (!inst._grid) return;
      const size = Math.max(inst._grid.width, inst._grid.height);
      const dist = Math.max(1.2, (size / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.5);
      controls.maxDistance = Math.max(70, dist * 1.8);
      controls.target.set(0, .9, 0);
      camera.position.set(0, .95, dist);
      controls.update(); dirty = true;
    };
    inst.setArrange = on => {
      inst._arrange = !!on;
      computeArrange();
      lastKey = '';
      if (on && inst._grid) fitArrange(); else fitView(inst._view);
      applyState();
    };
    inst.isArrange = () => !!inst._arrange;
    window.__debugPick = (cx, cy) => ({ hit: pickAt(cx, cy), name: pickAt(cx,cy) >= 0 ? parts[pickAt(cx,cy)].name : null });
    inst.dispose = () => {
      disposed = true;
      ro.disconnect();
      hoverTip.remove();
      controls.dispose();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      partTexture.dispose(); selectionTexture.dispose(); glowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    return inst;
  }
};
window.dispatchEvent(new Event('v3d-ready'));
