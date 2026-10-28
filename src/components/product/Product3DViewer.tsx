import { useEffect, useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Box } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export default function Product3DViewer() {
  const host = useRef<HTMLDivElement>(null);
  const actions = useRef<{
    reset: () => void;
    zoom: (factor: number) => void;
    rotate: (angle: number) => void;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#242326");
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 2.8, 8.5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.1, 0);
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.enablePan = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    const model = new THREE.Group();
    scene.add(model);
    const steel = new THREE.MeshStandardMaterial({
      color: "#d4d8db",
      metalness: 0.88,
      roughness: 0.22,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: "#b79a63",
      metalness: 0.78,
      roughness: 0.28,
    });
    const black = new THREE.MeshStandardMaterial({
      color: "#121314",
      roughness: 0.65,
    });
    const red = new THREE.MeshStandardMaterial({
      color: "#8c1f2c",
      roughness: 0.7,
    });
    const blade = new THREE.Shape();
    blade.moveTo(-1.05, 0.02);
    blade.quadraticCurveTo(1.2, 0.05, 2.65, 0.4);
    blade.lineTo(2.95, 0.69);
    blade.quadraticCurveTo(1.1, 0.32, -1.05, 0.28);
    blade.closePath();
    const sword = new THREE.Mesh(
      new THREE.ExtrudeGeometry(blade, {
        depth: 0.065,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.01,
      }),
      steel,
    );
    sword.position.y = 0.65;
    model.add(sword);
    function box(
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material,
    ) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      model.add(mesh);
      return mesh;
    }
    box(1.45, 0.25, 0.22, -1.8, 0.82, 0.03, black);
    box(0.08, 0.32, 0.28, -2.52, 0.82, 0.03, gold);
    const guard = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.09, 48),
      gold,
    );
    guard.rotation.z = Math.PI / 2;
    guard.position.set(-1.05, 0.82, 0.03);
    model.add(guard);
    for (let i = 0; i < 10; i++) {
      const wrap = box(
        0.065,
        0.28,
        0.24,
        -2.43 + i * 0.13,
        0.82,
        0.03,
        i % 2 ? red : gold,
      );
      wrap.rotation.z = 0.47;
    }
    box(5.6, 0.12, 0.8, 0, -0.75, 0, black);
    for (const x of [-1.6, 1.6]) {
      box(0.14, 1.35, 0.22, x, -0.08, 0, black);
      box(0.5, 0.12, 0.35, x, 0.58, 0, gold);
    }
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(8, 64),
      new THREE.MeshStandardMaterial({ color: "#29272a", roughness: 0.8 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.84;
    scene.add(floor);
    scene.add(new THREE.HemisphereLight("#fff1de", "#3c3632", 2.8));
    const key = new THREE.DirectionalLight("#fff4df", 5);
    key.position.set(2, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight("#b79a63", 3);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    const render = () => renderer.render(scene, camera);
    controls.addEventListener("change", render);
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    actions.current = {
      reset: () => {
        model.rotation.y = 0;
        camera.position.set(0, 2.8, 8.5);
        controls.target.set(0, 0.1, 0);
        controls.update();
        render();
      },
      zoom: (factor) => {
        camera.position
          .sub(controls.target)
          .multiplyScalar(factor)
          .add(controls.target);
        controls.update();
        render();
      },
      rotate: (angle) => {
        model.rotation.y += angle;
        render();
      },
    };
    const lost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      observer.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          materials.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      actions.current = null;
    };
  }, []);
  return (
    <div className="viewer-shell">
      {failed ? (
        <div className="viewer-fallback">
          <Box size={32} />
          <p>この環境では3Dを表示できません。</p>
          <p>「商品画像」タブから写真をご覧ください。</p>
        </div>
      ) : (
        <div
          className="viewer-canvas"
          ref={host}
          tabIndex={0}
          role="application"
          aria-label="模造刀の3Dデモ。ドラッグまたは左右キーで回転、プラスとマイナスキーでズーム。"
          onKeyDown={(e) => {
            if (
              ["ArrowLeft", "ArrowRight", "+", "=", "-", "Home"].includes(e.key)
            )
              e.preventDefault();
            if (e.key === "ArrowLeft") actions.current?.rotate(-0.15);
            if (e.key === "ArrowRight") actions.current?.rotate(0.15);
            if (e.key === "+" || e.key === "=") actions.current?.zoom(0.9);
            if (e.key === "-") actions.current?.zoom(1.1);
            if (e.key === "Home") actions.current?.reset();
          }}
        />
      )}
      <div className="viewer-toolbar">
        <span>
          <Box size={15} />
          3D形状デモ
        </span>
        <button
          onClick={() => actions.current?.rotate(0.3)}
          aria-label="モデルを回転"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => actions.current?.zoom(0.9)}
          aria-label="モデルを拡大"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => actions.current?.zoom(1.1)}
          aria-label="モデルを縮小"
        >
          <ZoomOut size={16} />
        </button>
        <button onClick={() => actions.current?.reset()}>リセット</button>
      </div>
      <p className="viewer-caption">
        ドラッグで回転・スクロールで拡大縮小。形状確認用の簡易モデルです。実商品の意匠とは異なります。
      </p>
    </div>
  );
}
