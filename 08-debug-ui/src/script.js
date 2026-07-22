import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI({
  width: 300,
  title: "DebugUI",
  closeFolders: true,
});

window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});
const guiProps = {};
const scrol = gui.addFolder("FOLDER");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
guiProps.color = "#ff0000";
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: guiProps.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

material.wireframe = true;

scrol.add(mesh.position, "y").max(3).min(-3).step(0.0001).name("Position Y");
guiProps.val = 12;
scrol.add(guiProps, "val").min(0).max(100).step(1);

gui.add(material, "wireframe");
gui.add(mesh, "visible");

gui.addColor(guiProps, "color").onChange(() => {
  material.color.set(guiProps.color);
});

guiProps.spin = () => {
  gsap.to(mesh.rotation, {
    delay: 1,
    y: mesh.rotation.y + Math.PI * 2,
    duration: 2,
  });
};

gui.add(guiProps, "spin");

guiProps.segment = 2;
scrol
  .add(guiProps, "segment")
  .onChange(() => {
    geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      guiProps.segment,
      guiProps.segment,
      guiProps.segment,
    );
  })
  .min(1)
  .max(20)
  .step(1);

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
