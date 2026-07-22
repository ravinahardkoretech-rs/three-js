import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Font
 */

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textgeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelSize: 0.02,
    bevelThickness: 0.3,
    bevelOffset: 0,
    bevelSegment: 4,
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  // textMaterial.wireframe = true;
  const text = new THREE.Mesh(textgeometry, textMaterial);
  textgeometry.computeBoundingBox();
  // textgeometry.translate(
  //   -(textgeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textgeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textgeometry.boundingBox.max.z - 0.3) * 0.5,
  // );
  textgeometry.center();
  scene.add(text);
});

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// Heart Object
const heartX = -25;
const heartY = -25;
const heartShape = new THREE.Shape();
heartShape.moveTo(25 + heartX, 25 + heartY);
heartShape.bezierCurveTo(
  25 + heartX,
  25 + heartY,
  20 + heartX,
  0 + heartY,
  0 + heartX,
  0 + heartY,
);
heartShape.bezierCurveTo(
  -30 + heartX,
  0 + heartY,
  -30 + heartX,
  35 + heartY,
  -30 + heartX,
  35 + heartY,
);
heartShape.bezierCurveTo(
  -30 + heartX,
  55 + heartY,
  -10 + heartX,
  77 + heartY,
  25 + heartX,
  95 + heartY,
);
heartShape.bezierCurveTo(
  60 + heartX,
  77 + heartY,
  80 + heartX,
  55 + heartY,
  80 + heartX,
  35 + heartY,
);
heartShape.bezierCurveTo(
  80 + heartX,
  35 + heartY,
  80 + heartX,
  0 + heartY,
  50 + heartX,
  0 + heartY,
);
heartShape.bezierCurveTo(
  35 + heartX,
  0 + heartY,
  25 + heartX,
  25 + heartY,
  25 + heartX,
  25 + heartY,
);

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1,
};

const materialRed = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const geometryHeart = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
for (let i = 0; i < 100; i++) {
  const meshHeart = new THREE.Mesh(geometryHeart, materialRed);

  meshHeart.rotation.x = Math.PI;
  meshHeart.position.x = (Math.random() - 0.5) * 20;
  meshHeart.position.y = (Math.random() - 0.5) * 20;
  meshHeart.position.z = (Math.random() - 0.5) * 20;

  meshHeart.scale.set(0.01, 0.01, 0.01);
  gsap.to(meshHeart.scale, {
    x: 0.008,
    y: 0.008,
    z: 0.008,
    duration: 1,
    repeat: -1,
  });

  scene.add(meshHeart);
}
for (let i = 0; i < 100; i++) {
  const meshHeart = new THREE.Mesh(geometryHeart, materialRed);

  meshHeart.rotation.x = Math.PI;
  meshHeart.position.x = (Math.random() - 0.5) * 20;
  meshHeart.position.y = (Math.random() - 0.5) * 20;
  meshHeart.position.z = (Math.random() - 0.5) * 20;

  meshHeart.scale.set(0.015, 0.015, 0.015);
  gsap.to(meshHeart.scale, {
    x: 0.008,
    y: 0.008,
    z: 0.008,
    duration: 1,
    repeat: -1,
  });

  scene.add(meshHeart);
}

/**
 * Object
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
