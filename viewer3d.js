(function () {
  const host = document.getElementById('pcbViewer');
  if (!host || typeof THREE === 'undefined') return;

  const fallback = document.getElementById('viewerFallback');
  const w0 = host.clientWidth || 1100;
  const h0 = host.clientHeight || 520;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1017);

  const camera = new THREE.PerspectiveCamera(38, w0 / h0, 0.1, 20000);
  camera.position.set(80, 60, 120);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(w0, h0);
  renderer.domElement.style.display = 'none';
  host.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x101821, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(90, 150, 100);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0008;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x7fb6ff, 0.28);
  fill.position.set(-110, 50, -90); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.18);
  rim.position.set(0, -80, 40); scene.add(rim);

  const grid = new THREE.GridHelper(320, 32, 0x203246, 0x15202c);
  grid.position.y = -0.02;
  scene.add(grid);

  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.ShadowMaterial({ opacity: 0.38 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.minDistance = 5;
  controls.maxDistance = 3000;

  let resetView = null;

  function place(obj) {
    // 立创EDA 的 OBJ 是 Z-up，转成 three.js 的 Y-up（板子平放）
    obj.rotation.x = -Math.PI / 2;
    obj.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 90 / maxDim;

    obj.scale.setScalar(s);
    obj.position.set(-center.x * s, -center.y * s, -center.z * s);

    const b2 = new THREE.Box3().setFromObject(obj);
    obj.position.y -= b2.min.y;                    // 落到 y = 0
    const h = Math.max(b2.max.y - b2.min.y, 1);

    const target = new THREE.Vector3(0, h * 0.35, 0);
    const camPos = new THREE.Vector3(h * 1.05, h * 0.8, h * 1.35);

    controls.target.copy(target);
    camera.position.copy(camPos);
    camera.lookAt(target);

    key.shadow.camera.left = -h * 1.4;
    key.shadow.camera.right = h * 1.4;
    key.shadow.camera.top = h * 1.4;
    key.shadow.camera.bottom = -h * 1.4;
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = h * 8;
    key.shadow.camera.updateProjectionMatrix();

    resetView = () => {
      controls.target.copy(target);
      camera.position.copy(camPos);
      controls.autoRotate = true;
    };
  }

  // 无 MTL 时的零件调色板（按材质序号循环）
  const PALETTE = [0x1f5c4a, 0x2a3442, 0x6f7885, 0x8a6a3a, 0x24405f, 0x4a3a34];
  const MTL_METAL = 0.55;

  function toStandard(m, fallbackIndex) {
    let color;
    if (m && m.color) {
      color = m.color.clone ? m.color.clone() : new THREE.Color(m.color);
    } else {
      color = new THREE.Color(PALETTE[fallbackIndex % PALETTE.length]);
    }
    const b = Math.max(color.r, color.g, color.b);
    return new THREE.MeshStandardMaterial({
      color: color,
      metalness: Math.min(0.9, 0.15 + b * 0.85),
      roughness: Math.max(0.18, 0.85 - b * 0.55),
      side: THREE.DoubleSide,
    });
  }

  function onModel(obj) {
    let meshes = 0;
    let mi = 0;
    obj.traverse((c) => {
      if (!c.isMesh) return;
      meshes++;
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      const replaced = mats.map((m) => toStandard(m, mi++));
      c.material = Array.isArray(c.material) ? replaced : replaced[0];
      c.castShadow = true;
      c.receiveShadow = true;
    });
    console.log('[3D] meshes:', meshes);
    place(obj);
    scene.add(obj);
    if (fallback) fallback.style.display = 'none';
    renderer.domElement.style.display = 'block';
  }

  function fail(err) {
    console.warn('[3D] 模型加载失败', err);
    if (fallback) fallback.style.display = '';
  }

  const loader = new THREE.OBJLoader();

  // 有 MTL 就用真实颜色
  if (window.PCB_MTL_TEXT && THREE.MTLLoader) {
    try {
      const mtlLoader = new THREE.MTLLoader();
      const creator = mtlLoader.parse(window.PCB_MTL_TEXT, '');
      creator.preload();
      loader.setMaterials(creator);
    } catch (e) {
      console.warn('[3D] MTL 解析失败，回退调色板', e);
    }
  }

  if (window.PCB_OBJ_TEXT) {
    try {
      onModel(loader.parse(window.PCB_OBJ_TEXT, ''));
    } catch (e) {
      fail(e);
    }
  } else {
    loader.load('assets/models/pcb-51.obj', onModel, undefined, fail);
  }

  renderer.domElement.addEventListener('pointerdown', () => { controls.autoRotate = false; });
  renderer.domElement.addEventListener('dblclick', () => { if (resetView) resetView(); });

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    const w = host.clientWidth;
    const h = host.clientHeight || 520;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();