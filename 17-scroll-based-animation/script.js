import * as THREE from "three";
import GUI from "lil-gui";
// import { color } from "three/tsl";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange((value) => {
  material.color.set(value);
  materialPoint.color.set(value);

  document.querySelectorAll("h1, h2").forEach((heading) => {
    heading.style.color = value;
  });
});

const textureloader = new THREE.TextureLoader();
const texture = textureloader.load("/textures/gradients/3.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
texture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: texture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material,
);
scene.add(mesh1, mesh2, mesh3);
/**
 * light
 */

const directionalLight = new THREE.DirectionalLight("#fffff", 3);
scene.add(directionalLight);
directionalLight.position.set(1, 1, 0);

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 6;
cameraGroup.add(camera);

const objDis = 4;

mesh1.position.y = 0 * objDis;
mesh2.position.y = -1 * objDis;
mesh3.position.y = -2 * objDis;

const meshes = [mesh1, mesh2, mesh3];

let scrollY = window.scrollY;
let current = 0;
window.addEventListener("scroll", () => {
  scrollY = (window.scrollY / sizes.height) * objDis;
  let newCurrent = Math.round(window.scrollY / sizes.height);
  if (current != newCurrent) {
    current = newCurrent;
    gsap.to(meshes[newCurrent].rotation, {
      duration: 1.5,
      ease: "power1.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width;
  cursor.y = event.clientY / sizes.height;
});

//particle
const count = 500;
const position = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  position[i * 3 + 0] = (Math.random() - 0.5) * 24;
  position[i * 3 + 1] = (Math.random() - 0.5) * 24;
  position[i * 3 + 2] = (Math.random() - 0.5) * 24;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
const materialPoint = new THREE.PointsMaterial({
  size: 0.003,
  color: parameters.materialColor,
  sizeAttenuation: true,
});

const points = new THREE.Points(geometry, materialPoint);
scene.add(points);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previous = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - previous;
  previous = elapsedTime;

  camera.position.y = -scrollY;

  const paralexX = -cursor.x;
  const paralexy = cursor.y;
  cameraGroup.position.x = paralexX - cameraGroup.position.x * 5 * delta;
  cameraGroup.position.y = paralexy - cameraGroup.position.y * 5 * delta;

  for (const mesh of meshes) {
    mesh.rotation.y += delta * 0.1;
    mesh.rotation.x += delta * 0.13;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
