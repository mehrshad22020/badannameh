/* ============================================================
   بدن‌نامه — موتور سه‌بعدی v2
   آتلاس واقعی BodyParts3D + کنترلر دوربین دست‌ساز
   (چرخش/زوم/پن/پینچ بدون وابستگی — همیشه پاسخ‌گو)
============================================================ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const SYS_COLORS = {
  skeletal:'#8fa3bd', muscular:'#d95f57', arterial:'#c74040', venous:'#4a74d8',
  nervous:'#d8a91f', digestive:'#e89a2f', respiratory:'#4aa8cc', urinary:'#2fb3c4',
  reproductive:'#c45fa8', lymphatic:'#3fb56f', endocrine:'#d066b4', integumentary:'#cbb896',
  connective:'#8d9bb0', sensory:'#6fa8bc', cardiac:'#d64f4f'
};
const SYS_ORDER = Object.keys(SYS_COLORS);

async function decompressGzip(buf){
  if (!(buf[0] === 0x1f && buf[1] === 0x8b)) return buf; /* سرور خودش باز کرده است */
  if (typeof DecompressionStream === 'undefined') throw new Error('مرورگر شما DecompressionStream ندارد؛ از کروم/اج/فایرفاکس جدید استفاده کنید.');
  const ds = new DecompressionStream('gzip');
  const stream = new Blob([buf]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

window.Body3D = {
  async create(host, opts){
    /* موتور ماندگار: یک‌بار ساخته می‌شود و بین صفحات فقط جابه‌جا می‌شود */
    const prev = window.__BADAN3D_ENGINE;
    if (prev){
      prev.attach(host);
      prev.onSelect = opts.onSelect || (() => {});
      if (opts.onProgress) opts.onProgress(100);
      return prev;
    }
    const BASE = opts.base || 'assets/models/';
    const atlas = await (await fetch(BASE + 'atlas.json')).json();
    const parts = atlas.parts;
    const N = parts.length;
    const width = THREE.MathUtils.ceilPowerOfTwo(N);
    const state = new Float32Array(width * 4);
    const selTex = new Uint8Array(width * 4);
    const partTexture = new THREE.DataTexture(state, width, 1, THREE.RGBAFormat, THREE.FloatType);
    const selectionTexture = new THREE.DataTexture(selTex, width, 1, THREE.RGBAFormat);
    [partTexture, selectionTexture].forEach(t => { t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; });
    const centers = parts.map(p => new THREE.Vector3().fromArray(p.bounds[0]).add(new THREE.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5));
    const bounds = parts.map(p => new THREE.Box3(new THREE.Vector3().fromArray(p.bounds[0]), new THREE.Vector3().fromArray(p.bounds[1])));
    /* قطعات ریز — کاندید مارکر */
    const smallPart = parts.map(p => {
      const s = p.bounds[1].map((v, k) => v - p.bounds[0][k]);
      return Math.max(s[0], s[1], s[2]) < .12;
    });

    /* ---------- رندرر ---------- */
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance', logarithmicDepthBuffer:true }); }
    catch(e){ throw new Error('مرورگر شما WebGL را پشتیبانی نمی‌کند یا غیرفعال است.'); }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setPixelRatio(Math.min(devicePixelRatio, host.clientWidth < 768 ? 1.25 : 1.5));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .01, 300);
    camera.position.set(0, 1.1, 3.9);
    camera.lookAt(0, .85, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, .04).texture;
    room.dispose(); pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xffffff, 0xaebfd4, 1.0));
    const key = new THREE.DirectionalLight(0xfff6e8, 1.8); key.position.set(-2, 4, 3); scene.add(key);
    const rim = new THREE.DirectionalLight(0xdfeaff, 1.3); rim.position.set(2.4, 2, -3); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffe8dd, .3); fill.position.set(0, -2.4, -1.5); scene.add(fill);

    /* سکو */
    const glowTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const g = c.getContext('2d').createRadialGradient(128,128,0,128,128,128);
      g.addColorStop(0,'rgba(29,78,216,.20)'); g.addColorStop(.5,'rgba(29,78,216,.05)'); g.addColorStop(1,'rgba(29,78,216,0)');
      const ctx = c.getContext('2d'); ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
      return new THREE.CanvasTexture(c);
    })();
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map:glowTex, transparent:true, depthWrite:false }));
    glow.rotation.x = -Math.PI/2; glow.position.y = -.03; scene.add(glow);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.72, .735, 128), new THREE.MeshBasicMaterial({ color:0x1D4ED8, transparent:true, opacity:.32, side:THREE.DoubleSide }));
    ring.rotation.x = -Math.PI/2; ring.position.y = -.012; scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(.60, .604, 128), new THREE.MeshBasicMaterial({ color:0x93b4f5, transparent:true, opacity:.16, side:THREE.DoubleSide }));
    ring2.rotation.x = -Math.PI/2; ring2.position.y = -.012; scene.add(ring2);

    /* مارکر قطعات ریز */
    const markerPositions = new Float32Array(parts.length * 3);
    const markerGeometry = new THREE.BufferGeometry();
    markerGeometry.setAttribute('position', new THREE.BufferAttribute(markerPositions, 3));
    const markerMaterial = new THREE.PointsMaterial({ color:0x1D4ED8, size:6, sizeAttenuation:false, transparent:true, opacity:.5, depthTest:false });
    markerMaterial.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>',
        '#include <clipping_planes_fragment>\nif (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;');
    };
    const markers = new THREE.Points(markerGeometry, markerMaterial);
    markers.frustumCulled = false; markers.renderOrder = 10; markers.visible = false;
    scene.add(markers);

    /* ---------- متریال با وضعیت GPU هر قطعه ---------- */
    const materials = [];
    const materialFor = (hex, isSkin) => {
      const m = new THREE.MeshStandardMaterial({
        color: hex, metalness:.05, roughness:.52, side:THREE.DoubleSide,
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
          '#include <color_fragment>\nfloat selAmt = partSelected * mix(1.0, 0.12, uIsolate);\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.11, 0.30, 0.85), selAmt);\nfloat rimGlow = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.5);\ndiffuseColor.rgb += vec3(0.10,0.28,0.85) * rimGlow * selAmt * 0.5;\n#ifdef USE_EMISSIVEMAP\n#else\ntotalEmissiveRadiance += vec3(0.05,0.15,0.45) * selAmt * 0.3;\n#endif');
        m.userData.shader = shader;
      };
      materials.push(m);
      return m;
    };
    const mats = new Map();
    for (const sys in SYS_COLORS) mats.set(sys, materialFor(SYS_COLORS[sys], sys === 'integumentary'));

    /* ---------- بارگذاری chunkها ---------- */
    const geometries = [];
    const pickers = [];
    const sysMeshes = new Map();
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
        sysMeshes.set(system, mesh);
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

    /* ---------- کنترلر دوربین دست‌ساز (چرخش/زوم/پن/پینچ) ---------- */
    const ctl = {
      target: new THREE.Vector3(0, .85, 0),
      radius: 3.9, theta: 0, phi: 1.45,
      min: .05, max: 90,
      autoRotate: false
    };
    const sph = new THREE.Spherical();
    const ctlApply = () => {
      ctl.phi = Math.max(.04, Math.min(Math.PI - .04, ctl.phi));
      ctl.radius = Math.max(ctl.min, Math.min(ctl.max, ctl.radius));
      sph.set(ctl.radius, ctl.phi, ctl.theta);
      camera.position.setFromSpherical(sph).add(ctl.target);
      camera.lookAt(ctl.target);
      dirty = true;
    };
    const panBy = (dx, dy) => {
      const right = new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
      const k = ctl.radius * .0011;
      ctl.target.addScaledVector(right, -dx * k).addScaledVector(up, dy * k);
      ctlApply();
    };
    const VIEWS = { front:{t:0,p:1.47}, side:{t:Math.PI/2,p:1.47}, back:{t:Math.PI,p:1.47}, persp:{t:.5,p:1.42} };
    const fitView = view => {
      const v = VIEWS[view] || VIEWS.front;
      ctl.target.set(0, .85, 0);
      ctl.theta = v.t; ctl.phi = v.p;
      ctl.radius = host.clientWidth < 768 ? 4.7 : 3.9;
      ctlApply();
    };
    const fitToSelection = () => {
      const box = new THREE.Box3();
      const sel = new Set(inst.selected);
      parts.forEach((p, i) => { if (sel.has(p.id)) box.union(bounds[i]); });
      if (box.isEmpty()) return;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      ctl.target.copy(center);
      ctl.radius = Math.max(.5, (maxDim / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.45);
      ctlApply();
    };
    const fitArrange = () => {
      if (!inst._grid) return;
      const size = Math.max(inst._grid.width, inst._grid.height);
      ctl.target.set(0, .9, 0);
      ctl.theta = 0; ctl.phi = 1.45;
      ctl.radius = Math.max(1.2, (size / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.45);
      ctl.max = Math.max(90, ctl.radius * 2);
      ctlApply();
    };

    /* ---------- وضعیت ---------- */
    const inst = {
      parts, atlas,
      visibleSystems: new Set(SYS_ORDER),
      selected: [],
      isolate: false, explodeT: 0,
      _view: 'front', _rotate: false,
      _pan: false, _arrange: false, _grid: null, _partFilter: null,
      onSelect: opts.onSelect || (() => {}),
      onHover: null, onStateChange: null
    };
    let lastKey = '', arr = 0, dirty = true;

    const applyState = () => {
      const key = [...inst.visibleSystems].sort().join(',') + '|' + inst.selected.join(',')
        + '|' + (inst.isolate ? 1 : 0) + '|' + inst.explodeT.toFixed(3) + '|' + arr.toFixed(2) + '|' + (inst._arrange ? 1 : 0);
      if (key === lastKey) return;
      lastKey = key;
      const sel = new Set(inst.selected);
      const grid = inst._arrange && inst._grid ? inst._grid.map : null;
      const sysAny = {};
      parts.forEach((p, i) => {
        const c = centers[i];
        const vis = inst.isolate ? sel.has(p.id)
          : (inst._partFilter ? inst._partFilter(p) : (inst.visibleSystems.has(p.system) || sel.has(p.id)));
        let dx = 0, dy = 0, dz = 0;
        if (grid && grid.has(i)){
          const g = grid.get(i);
          dx = g.x * arr; dy = g.y * arr; dz = g.z * arr;
        } else if (!inst.isolate && inst.explodeT > 0){
          const t = inst.explodeT;
          const angle = SYS_ORDER.indexOf(p.system) / 15 * Math.PI * 2;
          dx = Math.sin(angle) * t * 1.05;
          dy = (c.y - .85) * t * .55;
          dz = Math.cos(angle) * t * 1.05;
        }
        state.set([dx, dy, dz, vis ? 1 : 0], i * 4);
        selTex[i*4] = sel.has(p.id) ? 255 : 0;
        markerPositions.set(vis && smallPart[i] ? [c.x + dx, c.y + dy, c.z + dz] : [1e6, 1e6, 1e6], i * 3);
        const pk = pickers[i];
        if (pk){ pk.position.set(dx, dy, dz); pk.updateMatrix(); pk.updateMatrixWorld(true); }
        if (vis) sysAny[p.system] = true;
      });
      partTexture.needsUpdate = true;
      selectionTexture.needsUpdate = true;
      markerGeometry.attributes.position.needsUpdate = true;
      sysMeshes.forEach((mesh, sys) => { mesh.visible = !!sysAny[sys]; });
      materials.forEach(m => { if (m.userData.shader) m.userData.shader.uniforms.uIsolate.value = inst.isolate ? 1 : 0; });
      dirty = true;
      if (inst.onStateChange) inst.onStateChange();
    };

    /* ---------- picking سریع ---------- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const tmpBox = new THREE.Box3();
    const tmpPoint = new THREE.Vector3();
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
      if (best < 0){
        /* فالبک: نزدیک‌ترین مرکز پروژه‌شده */
        let bd = 26, bi = -1;
        const v = new THREE.Vector3();
        for (let i = 0; i < parts.length; i++){
          if (state[i*4+3] < .5) continue;
          const p = parts[i];
          if (p.system === 'integumentary' && hasSolid) continue;
          v.set(centers[i].x, centers[i].y, centers[i].z).project(camera);
          if (v.z < -1 || v.z > 1) continue;
          const sx = (v.x + 1) / 2 * rect.width + rect.x, sy = (1 - v.y) / 2 * rect.height + rect.y;
          const d = Math.hypot(sx - cx, sy - cy);
          if (d < bd){ bd = d; bi = i; }
        }
        best = bi;
      }
      return best;
    };

    /* ---------- تعامل موس/لمس (کاملاً دست‌ساز) ---------- */
    const canvas = renderer.domElement;
    const hoverTip = document.createElement('div');
    hoverTip.className = 'part-hover';
    document.body.appendChild(hoverTip);
    const pointers = new Map();
    let pinchD = 0, downPos = null, pendingMove = null;

    const doHover = e => {
      if (pointers.size) { hoverTip.classList.remove('show'); return; }
      const hit = pickAt(e.clientX, e.clientY);
      if (hit >= 0){
        hoverTip.textContent = inst.parts[hit].name;
        hoverTip.classList.add('show');
        hoverTip.style.left = (e.clientX + 14) + 'px';
        hoverTip.style.top = (e.clientY + 16) + 'px';
        canvas.style.cursor = 'pointer';
      } else {
        hoverTip.classList.remove('show');
        canvas.style.cursor = 'grab';
      }
    };
    canvas.addEventListener('pointerdown', e => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      downPos = [e.clientX, e.clientY];
      hoverTip.classList.remove('show');
      if (pointers.size === 2){
        const arr2 = [...pointers.values()];
        pinchD = Math.hypot(arr2[0].x - arr2[1].x, arr2[0].y - arr2[1].y);
      }
    });
    canvas.addEventListener('pointermove', e => {
      if (pointers.has(e.pointerId)){
        const p = pointers.get(e.pointerId);
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        p.x = e.clientX; p.y = e.clientY;
        if (pointers.size === 1){
          if (inst._pan || e.buttons === 2){ panBy(dx, dy); }
          else { ctl.theta -= dx * .0055; ctl.phi -= dy * .0055; ctlApply(); }
        } else if (pointers.size === 2){
          const a = [...pointers.values()];
          const d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          if (pinchD > 0){ ctl.radius = Math.max(ctl.min, Math.min(ctl.max, ctl.radius * pinchD / d)); ctlApply(); }
          pinchD = d;
        }
      }
      pendingMove = e;
    });
    const endPointer = e => {
      if (pointers.has(e.pointerId) && downPos){
        const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
        if (moved < 7 && pointers.size === 1){
          const hit = pickAt(e.clientX, e.clientY);
          (window.__clicks = window.__clicks || []).unshift({ cx: e.clientX, cy: e.clientY, hit, name: hit >= 0 ? inst.parts[hit].name : null });
          if (hit >= 0){ window.__lastSelect = inst.parts[hit].name; inst.onSelect(inst.parts[hit], hit); if (opts.onSelect) opts._userSelected = true; } else { window.__lastSelect = null; }
        }
      }
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchD = 0;
    };
    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', e => { pointers.delete(e.pointerId); pinchD = 0; });
    canvas.addEventListener('pointerleave', () => { hoverTip.classList.remove('show'); });
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      ctl.radius = Math.max(ctl.min, Math.min(ctl.max, ctl.radius * Math.pow(1.0013, e.deltaY)));
      ctlApply();
    }, { passive:false });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('dblclick', e => {
      if (pickAt(e.clientX, e.clientY) < 0){ inst.resetAll(); }
    });

    /* ---------- حلقه رندر ---------- */
    const clock = new THREE.Clock();
    let curHost = host;
    const resize = () => {
      const w = Math.max(60, curHost.clientWidth || 0), h = Math.max(60, curHost.clientHeight || 0);
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    requestAnimationFrame(resize);
    setTimeout(resize, 300); setTimeout(resize, 1200); setTimeout(resize, 3000);

    const animate = () => {
      if (disposed) return;
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), .05);
      const arrTarget = inst._arrange ? 1 : 0;
      if (Math.abs(arr - arrTarget) > .001){ arr = THREE.MathUtils.damp(arr, arrTarget, 4, dt); dirty = true; }
      if (ctl.autoRotate && !pointers.size){ ctl.theta -= dt * .35; dirty = true; }
      ctlApply();
      applyState();
      if (pendingMove){ doHover(pendingMove); pendingMove = null; }
      if (dirty && !inst._detached){ renderer.render(scene, camera); dirty = false; }
    };
    animate();

    /* اتصال/جدا شدن بین صفحات — کانواس و کانتکست یکسان می‌ماند */
    const parking = (() => {
      let p = document.getElementById('gl3d-parking');
      if (!p){
        p = document.createElement('div');
        p.id = 'gl3d-parking';
        p.style.cssText = 'position:absolute;left:-200px;top:-200px;width:10px;height:10px;overflow:hidden;opacity:0;pointer-events:none';
        document.body.appendChild(p);
      }
      return p;
    })();
    inst.attach = newHost => {
      if (curHost === newHost){ resize(); return; }
      newHost.appendChild(renderer.domElement);
      curHost = newHost;
      ro.disconnect(); ro.observe(curHost);
      inst._detached = false;
      resize();
    };
    inst.detach = () => {
      parking.appendChild(renderer.domElement);
      curHost = parking;
      inst._detached = true;
    };

    /* ---------- API عمومی ---------- */
    inst.setView = v => { inst._view = v; fitView(v); };
    inst.setRotate = on => { ctl.autoRotate = !!on; };
    inst.setSystems = set => { inst.visibleSystems = new Set(set); if (inst._arrange) computeArrange(); lastKey = ''; applyState(); };
    inst.select = ids => { inst.selected = ids || []; if (inst._arrange) computeArrange(); lastKey = ''; applyState(); if (inst.isolate && inst.selected.length) fitToSelection(); };
    inst.setIsolate = on => {
      on = !!on;
      if (on && !inst.selected.length) on = false;
      inst.isolate = on;
      if (inst._arrange) computeArrange();
      lastKey = ''; applyState();
      if (on && inst.selected.length) fitToSelection(); else fitView(inst._view);
    };
    inst.setExplode = t => { inst.explodeT = Math.max(0, Math.min(1, t)); lastKey = ''; applyState(); };
    inst.resetView = () => { inst.setIsolate(false); inst.select([]); fitView(inst._view); };
    inst.resetAll = () => {
      inst.setArrange(false);
      inst.setSystems(SYS_ORDER);
      inst.select([]);
      inst.setIsolate(false);
      inst.setExplode(0);
      inst.setView('front');
    };
    inst.setPan = on => { inst._pan = !!on; };
    inst.zoomBy = f => { ctl.radius = Math.max(ctl.min, Math.min(ctl.max, ctl.radius * f)); ctlApply(); };
    inst.setQuality = q => {
      const map = { high: Math.min(devicePixelRatio, 2), mid: Math.min(devicePixelRatio, 1.5), low: 1 };
      renderer.setPixelRatio(map[q] || Math.min(devicePixelRatio, 1.5));
      resize(); dirty = true;
    };
    const computeArrange = () => {
      inst._grid = null;
      if (!inst._arrange) return;
      const vis = [];
      parts.forEach((p, i) => {
        const v = inst.isolate ? inst.selected.includes(p.id)
          : (inst.visibleSystems.has(p.system) || inst.selected.includes(p.id));
        if (v) vis.push(i);
      });
      if (!vis.length) return;
      vis.sort((a, b) => {
        const sa = SYS_ORDER.indexOf(parts[a].system), sb = SYS_ORDER.indexOf(parts[b].system);
        return sa !== sb ? sa - sb : parts[a].name.localeCompare(parts[b].name);
      });
      const cols = Math.max(1, Math.ceil(Math.sqrt(vis.length * 1.4)));
      const rows = Math.ceil(vis.length / cols);
      const cell = Math.max(.16, Math.min(.6, 16 / Math.max(cols, rows)));
      const map = new Map();
      vis.forEach((pi, k) => {
        const col = k % cols, row = Math.floor(k / cols);
        const gx = (col - (cols - 1) / 2) * cell;
        const gy = .9 + ((rows - 1) / 2 - row) * cell;
        map.set(pi, new THREE.Vector3(gx - centers[pi].x, gy - centers[pi].y, -centers[pi].z));
      });
      inst._grid = { map, width: cols * cell, height: rows * cell };
    };
    inst.setArrange = on => {
      inst._arrange = !!on;
      computeArrange();
      lastKey = '';
      if (on && inst._grid) fitArrange(); else fitView(inst._view);
      applyState();
    };
    inst.focusBrain = () => {
      ctl.target.set(0, 1.5, 0);
      ctl.theta = Math.PI / 2;
      ctl.phi = 1.45;
      ctl.radius = 1.7;
      ctlApply();
    };
    inst.isArrange = () => !!inst._arrange;
    inst.setMarkers = on => { markers.visible = !!on; dirty = true; };
    inst.isMarkers = () => markers.visible;
    inst.dispose = () => {
      disposed = true;
      ro.disconnect();
      hoverTip.remove();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      partTexture.dispose(); selectionTexture.dispose(); glowTex.dispose();
      markerGeometry.dispose(); markerMaterial.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      renderer.domElement.remove();
    };
    window.__debugPick = (cx, cy) => ({ hit: pickAt(cx, cy), name: pickAt(cx, cy) >= 0 ? parts[pickAt(cx, cy)].name : null });
    window.__zoomProbe = () => ({ dist: +camera.position.distanceTo(ctl.target).toFixed(3), min: ctl.min, max: +ctl.max.toFixed(1), theta: +ctl.theta.toFixed(2), phi: +ctl.phi.toFixed(2) });
    window.__dbg = {
      cam: () => ({ pos: camera.position.toArray().map(x=>+x.toFixed(2)), target: ctl.target.toArray().map(x=>+x.toFixed(2)) }),
      project: name => {
        const i = parts.findIndex(p => p.name === name);
        if (i < 0) return 'no-part ' + name;
        const v = new THREE.Vector3(centers[i].x, centers[i].y, centers[i].z).project(camera);
        const r = renderer.domElement.getBoundingClientRect();
        return { i, name: parts[i].name, sys: parts[i].system, w: state[i*4+3], sx: Math.round((v.x+1)/2*r.width + r.x), sy: Math.round((1-v.y)/2*r.height + r.y) };
      },
      pick: (cx, cy) => { const h = pickAt(cx, cy); return { hit: h, name: h >= 0 ? parts[h].name : null }; }
    }; ({ dist: +camera.position.distanceTo(ctl.target).toFixed(3), min: ctl.min, max: +ctl.max.toFixed(1), theta: +ctl.theta.toFixed(2) });
    return inst;
  }
};
window.dispatchEvent(new Event('v3d-ready'));
