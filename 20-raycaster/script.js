import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FullScreenQuad } from "three/examples/jsm/Addons.js";

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);
object3.position.x = 2;

scene.add(object1, object2, object3);

object1.updateMatrixWorld();
object2.updateMatrixWorld();
object3.updateMatrixWorld();

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const raycaster = new THREE.Raycaster();

// Thick Visible Ray
const rayGeometry = new THREE.BoxGeometry(30, 0.3, 0.01); // Length, Thickness

const rayMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.45,
  depthWrite: false,
  depthTest: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
});

const rayLine = new THREE.Mesh(rayGeometry, rayMaterial);

// Plane ka center hota hai, isliye x = 0
rayLine.position.set(0, 0, -0.01);

scene.add(rayLine);

rayLine.renderOrder = 0;

object1.renderOrder = 1;
object2.renderOrder = 1;
object3.renderOrder = 1;

// const origin = new THREE.Vector3(-3, 0, 0);
// const direction = new THREE.Vector3(10, 0, 0);

// raycaster.set(origin, direction);

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

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.6) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 0.9) * 1.5;

  const origin = new THREE.Vector3(-3, 0, 0);
  const direction = new THREE.Vector3(1, 0, 0).normalize();

  raycaster.set(origin, direction);

  const objects = [object1, object2, object3];

  const intersect = raycaster.intersectObjects(objects);

  for (const obj of objects) {
    obj.material.color = new THREE.Color("red");
  }

  for (const inter of intersect) {
    inter.object.material.color.set("blue");
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
const origin = new THREE.Vector3(-3, 0, 0);
const direction = new THREE.Vector3(1, 0, 0); // Direction should be normalized

raycaster.set(origin, direction);
