import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const palette = {
  blush: 0xe8aeb4,
  blushLight: 0xf5d2d3,
  cream: 0xfff3df,
  ivory: 0xfff8eb,
  rose: 0xc95f73,
  coral: 0xe98c8f,
  gold: 0xd8a548,
  goldLight: 0xffe3a0,
  champagne: 0xf0c77a,
  leaf: 0x718b55,
  dark: 0x25140d,
  berry: 0x9f3f59,
};

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.32,
    metalness: options.metalness ?? 0.04,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
}

function addCylinder(parent, radius, height, y, color, options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, options.bottomRadius ?? radius * 1.015, height, options.segments ?? 96, 1),
    mat(color, options)
  );
  mesh.position.y = y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addTorus(parent, radius, tube, y, color, options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 18, 96),
    mat(color, { metalness: 0.35, roughness: 0.24, ...options })
  );
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function addPearl(parent, x, y, z, color = palette.ivory, scale = 0.075) {
  const pearl = new THREE.Mesh(
    new THREE.SphereGeometry(scale, 20, 20),
    mat(color, { roughness: 0.16, metalness: 0.18 })
  );
  pearl.position.set(x, y, z);
  pearl.castShadow = true;
  parent.add(pearl);
  return pearl;
}

function addPearlRing(parent, radius, y, count = 32, color = palette.ivory, scale = 0.07, phase = 0) {
  for (let i = 0; i < count; i += 1) {
    const a = phase + (i / count) * Math.PI * 2;
    addPearl(parent, Math.cos(a) * radius, y, Math.sin(a) * radius, color, scale);
  }
}

function addRose(parent, x, y, z, color, scale = 1) {
  const rose = new THREE.Group();
  rose.position.set(x, y, z);
  rose.scale.setScalar(scale);

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 18, 18),
    mat(color, { roughness: 0.35 })
  );
  center.castShadow = true;
  rose.add(center);

  for (let i = 0; i < 7; i += 1) {
    const a = (i / 7) * Math.PI * 2;
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16),
      mat(color, { roughness: 0.4 })
    );
    petal.scale.set(1.0, 0.48, 0.72);
    petal.position.set(Math.cos(a) * 0.105, 0.015 + Math.sin(i * 1.8) * 0.012, Math.sin(a) * 0.105);
    petal.rotation.y = -a;
    petal.castShadow = true;
    rose.add(petal);
  }
  parent.add(rose);
  return rose;
}

function addLeaf(parent, x, y, z, rotationY, scale = 1) {
  const leaf = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 14, 14),
    mat(palette.leaf, { roughness: 0.5 })
  );
  leaf.scale.set(1.8 * scale, 0.25 * scale, 0.72 * scale);
  leaf.position.set(x, y, z);
  leaf.rotation.y = rotationY;
  leaf.rotation.z = 0.18;
  leaf.castShadow = true;
  parent.add(leaf);
  return leaf;
}

function addFlowerCluster(parent, radius, y, count, grand) {
  const colors = grand
    ? [palette.rose, 0xf08f9e, 0xf5c2cb, palette.coral]
    : [palette.rose, 0xeaa0ad, 0xf3c3c8, palette.coral];
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2 + (i % 2) * 0.08;
    const r = radius * (0.55 + (i % 4) * 0.07);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    addRose(parent, x, y + (i % 3) * 0.045, z, colors[i % colors.length], 0.72 + (i % 3) * 0.09);
    if (i % 2 === 0) addLeaf(parent, x * 1.05, y - 0.02, z * 1.05, -a + 0.8, 0.8);
  }
}

function addDrips(parent, radius, topY, count, color, grand) {
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2;
    const r = radius * 1.006;
    const length = (0.12 + (i % 5) * 0.045) * (grand ? 1.15 : 1);
    const drip = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.032 + (i % 3) * 0.008, length, 5, 12),
      mat(color, { roughness: 0.24, metalness: 0.12 })
    );
    drip.position.set(Math.cos(a) * r, topY - length * 0.48, Math.sin(a) * r);
    drip.castShadow = true;
    parent.add(drip);
  }
}

function makeTextSprite(text, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = options.width ?? 1024;
  canvas.height = options.height ?? 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = options.font ?? '700 92px Georgia';
  ctx.fillStyle = options.fill ?? '#6f3b36';
  ctx.shadowColor = options.shadow ?? 'rgba(255,255,255,.5)';
  ctx.shadowBlur = options.shadowBlur ?? 5;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(options.scaleX ?? 2.1, options.scaleY ?? 0.52, 1);
  return sprite;
}

function addPlaque(parent, variant) {
  const grand = variant === 'grand';
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(grand ? 1.38 : 1.3, 0.58, 0.055),
    mat(grand ? 0xf3d28c : 0xf2d5c5, { metalness: 0.18, roughness: 0.3 })
  );
  plaque.position.set(0, 0.66, grand ? 1.62 : 1.56);
  plaque.castShadow = true;
  parent.add(plaque);

  const border = new THREE.Mesh(
    new THREE.BoxGeometry(grand ? 1.48 : 1.4, 0.68, 0.025),
    mat(palette.gold, { metalness: 0.7, roughness: 0.22 })
  );
  border.position.set(0, 0.66, (grand ? 1.62 : 1.56) - 0.035);
  parent.add(border);

  const date = makeTextSprite('HAPPY BIRTHDAY  •  MAHII  •  22 · 08 · 2007', {
    font: '700 44px Georgia', fill: grand ? '#fff1c8' : '#744b42', scaleX: 2.0, scaleY: 0.24,
  });
  if (date) {
    date.position.set(0, 0.67, grand ? 1.69 : 1.63);
    parent.add(date);
  }
}

function addName(parent, variant) {
  const grand = variant === 'grand';
  const name = makeTextSprite('Mahii  ♡', {
    font: 'italic 900 96px Georgia',
    fill: grand ? '#fff0c5' : '#7b3f49',
    shadow: grand ? 'rgba(255,191,79,.45)' : 'rgba(255,255,255,.7)',
    shadowBlur: grand ? 14 : 6,
    scaleX: grand ? 2.45 : 2.35,
    scaleY: 0.62,
  });
  if (name) {
    name.position.set(0, grand ? 1.72 : 1.58, grand ? 1.68 : 1.59);
    parent.add(name);
  }
}

function addCandle(group, x, digit, variant) {
  const grand = variant === 'grand';
  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 1.2, 36),
    mat(grand ? palette.gold : 0xf0d184, { metalness: 0.3, roughness: 0.25 })
  );
  candle.position.set(x, 3.35, 0.1);
  candle.castShadow = true;
  group.add(candle);

  const label = makeTextSprite(digit, {
    font: '900 92px Georgia', fill: '#fff7d4', shadow: 'rgba(117,77,28,.65)', shadowBlur: 7,
    scaleX: 0.38, scaleY: 0.38,
  });
  if (label) {
    label.position.set(x, 3.34, 0.285);
    group.add(label);
  }

  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.14, 10),
    mat(palette.dark, { roughness: 0.8 })
  );
  wick.position.set(x, 4.02, 0.1);
  group.add(wick);

  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd76a })
  );
  flame.scale.set(0.72, 1.75, 0.72);
  flame.position.set(x, 4.22, 0.1);
  flame.userData.flame = true;
  group.add(flame);

  const light = new THREE.PointLight(0xffb84c, grand ? 2.4 : 2.0, 3.8, 2);
  light.position.set(x, 4.18, 0.2);
  light.userData.flameLight = true;
  group.add(light);
}

function addStars(group, radius, y, count = 10) {
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2;
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.075 + (i % 3) * 0.02, 0),
      mat(palette.goldLight, { emissive: palette.gold, emissiveIntensity: 0.65, metalness: 0.5, roughness: 0.2 })
    );
    star.position.set(Math.cos(a) * radius, y + (i % 3) * 0.07, Math.sin(a) * radius);
    star.userData.star = true;
    group.add(star);
  }
}

function buildCake(scene, variant) {
  const grand = variant === 'grand';
  const cake = new THREE.Group();
  cake.position.y = -1.10;
  scene.add(cake);

  // Broad marble/gold platter.
  addCylinder(cake, grand ? 2.75 : 2.55, 0.14, 0.12, grand ? 0xe1c17a : 0xf2e4d2, { metalness: 0.62, roughness: 0.2 });
  addTorus(cake, grand ? 2.48 : 2.3, 0.055, 0.2, palette.gold, { metalness: 0.8 });
  addTorus(cake, grand ? 2.2 : 2.05, 0.025, 0.27, 0xffefbd, { metalness: 0.7 });

  // Lower tier.
  addCylinder(cake, grand ? 2.18 : 2.08, 1.05, 0.78, grand ? palette.blush : 0xe7a8ad, { roughness: 0.3 });
  addCylinder(cake, grand ? 2.22 : 2.12, 0.12, 1.33, palette.ivory, { roughness: 0.22 });
  addDrips(cake, grand ? 2.19 : 2.09, 1.34, grand ? 32 : 28, palette.gold, grand);
  addTorus(cake, grand ? 2.08 : 1.98, 0.045, 0.33, palette.gold, { metalness: 0.65 });
  addPearlRing(cake, grand ? 2.0 : 1.9, 1.39, grand ? 36 : 30, palette.ivory, 0.075);

  // Upper tier.
  addCylinder(cake, grand ? 1.52 : 1.46, 0.92, 1.73, grand ? palette.blushLight : 0xf0c8c7, { roughness: 0.28 });
  addCylinder(cake, grand ? 1.56 : 1.5, 0.1, 2.17, palette.ivory, { roughness: 0.2 });
  addDrips(cake, grand ? 1.55 : 1.49, 2.18, grand ? 22 : 20, palette.gold, grand);
  addPearlRing(cake, grand ? 1.46 : 1.4, 2.23, grand ? 28 : 24, palette.ivory, 0.07, Math.PI / 12);

  // Flowers and leaves are deliberately dense to match the reference.
  addFlowerCluster(cake, grand ? 1.55 : 1.48, 2.28, grand ? 18 : 14, grand);
  addFlowerCluster(cake, grand ? 2.08 : 1.95, 0.33, grand ? 22 : 16, grand);

  // Small gold balls around the flower beds.
  for (let i = 0; i < (grand ? 20 : 14); i += 1) {
    const a = (i / (grand ? 20 : 14)) * Math.PI * 2;
    const r = grand ? 1.68 : 1.58;
    addPearl(cake, Math.cos(a) * r, 0.34 + (i % 3) * 0.035, Math.sin(a) * r, palette.gold, 0.065);
  }

  addName(cake, variant);
  addPlaque(cake, variant);
  addStars(cake, grand ? 1.72 : 1.58, 2.48, grand ? 12 : 9);

  // 19 candles.
  addCandle(cake, -0.48, '1', variant);
  addCandle(cake, 0.48, '9', variant);

  return cake;
}

function createFallback(variant) {
  const grand = variant === 'grand';
  const root = document.createElement('div');
  root.className = `cakeFallback ${grand ? 'cakeFallbackGrand' : ''}`;
  root.setAttribute('aria-label', "Mahii's 19th birthday cake");
  root.innerHTML = `
    <div class="fallbackHalo"></div>
    <div class="fallbackPlate"></div>
    <div class="fallbackTier bottom"></div>
    <div class="fallbackTier upper"></div>
    <div class="fallbackFlowers">🌹 🌸 🌹 🌸 🌹</div>
    <div class="fallbackName">Mahii ♡</div>
    <div class="fallbackPlaque">HAPPY BIRTHDAY · MAHII<br/>22 · 08 · 2007</div>
    <div class="fallbackCandles"><span>1<i></i></span><span>9<i></i></span></div>
  `;
  return root;
}

export default function ThreeBirthdayCake({ variant = 'opening' }) {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || failed) return undefined;

    let renderer;
    let frame = 0;
    let observer;
    let disposed = false;

    try {
      if (!window.WebGLRenderingContext) throw new Error('WebGL is unavailable');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 2.35, 9.6);
      camera.lookAt(0, 1.55, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = variant === 'grand' ? 1.25 : 1.18;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xfff3dc, variant === 'grand' ? 0x120a06 : 0x4b2a2b, 2.4));

      const key = new THREE.DirectionalLight(0xffd99a, variant === 'grand' ? 5.2 : 4.5);
      key.position.set(-4.5, 7.5, 6.5);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);

      const pinkFill = new THREE.PointLight(0xff9fbd, variant === 'grand' ? 3.5 : 2.5, 12, 2);
      pinkFill.position.set(4.5, 2.8, 4.5);
      scene.add(pinkFill);

      const goldFill = new THREE.PointLight(0xffca62, variant === 'grand' ? 4.2 : 3.0, 11, 2);
      goldFill.position.set(-3.5, 1.4, 3.5);
      scene.add(goldFill);

      const cake = buildCake(scene, variant);
      const baseY = -1.10;

      const resize = () => {
        if (disposed) return;
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();

      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(resize);
        observer.observe(mount);
      } else {
        window.addEventListener('resize', resize);
      }

      const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const animate = (time) => {
        if (disposed) return;
        frame = requestAnimationFrame(animate);
        const t = time * 0.001;
        if (!reduceMotion) {
          cake.rotation.y = Math.sin(t * 0.28) * 0.055;
          cake.position.y = baseY + Math.sin(t * 0.9) * 0.025;
        }

        cake.traverse((object) => {
          if (object.userData?.flame) {
            const pulse = Math.sin(t * 8 + object.position.x * 4);
            object.scale.x = 0.72 + pulse * 0.07;
            object.scale.z = object.scale.x;
            object.scale.y = 1.72 + Math.sin(t * 11) * 0.12;
          }
          if (object.userData?.flameLight) object.intensity = 2.0 + Math.sin(t * 9) * 0.4;
          if (object.userData?.star) object.rotation.y = t * 0.7;
        });

        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(animate);

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        if (observer) observer.disconnect();
        else window.removeEventListener('resize', resize);

        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              if (material.map) material.map.dispose();
              material.dispose();
            });
          }
        });

        renderer.dispose();
        renderer.forceContextLoss?.();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    } catch (error) {
      console.error('Three.js birthday cake failed; using premium fallback cake.', error);
      setFailed(true);
      if (renderer) renderer.dispose();
      return undefined;
    }
  }, [variant, failed]);

  if (failed) {
    return <div className="threeCakeFallbackMount" dangerouslySetInnerHTML={{ __html: createFallback(variant).outerHTML }} />;
  }

  return <div ref={mountRef} className={`threeCake threeCake--${variant}`} aria-label="3D birthday cake for Mahii's 19th birthday" />;
}
