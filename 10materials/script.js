import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * GUI
 */

const gui = new GUI();

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
 * texture
 */

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg",
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcap = textureLoader.load("/textures/matcaps/3.png");
const gradient = textureLoader.load("/textures/gradients/5.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcap.colorSpace = THREE.SRGBColorSpace;
gradient.magFilter = THREE.NearestFilter;
gradient.minFilter = THREE.NearestFilter;
gradient.generateMipmaps = false;

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});
/**
 * object
 */

// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color("pink");
// material.wireframe = true;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcap;
// material.side = THREE.DoubleSide;
// const material = new THREE.MeshDepthMaterial();
// const ambientLiht = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLiht);
// const pointLight = new THREE.PointLight(0xffffff, 50);
// scene.add(pointLight);
// pointLight.position.set(2, 3, 4);
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradient;

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.alphaMap = doorAlphaTexture;
material.transparent = true;
material.normalMap = doorNormalTexture;

//gui
gui.add(material, "roughness").min(0).max(1);
gui.add(material, "metalness").min(0).max(1);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
scene.add(plane);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
scene.add(sphere);
sphere.position.x = -1.5;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material,
);
torus.position.x = 1.5;
scene.add(torus);

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

  plane.rotation.x = elapsedTime * 0.3;
  sphere.rotation.x = elapsedTime * 0.3;
  torus.rotation.x = elapsedTime * 0.3;
  plane.rotation.y = elapsedTime * 0.3;
  sphere.rotation.y = elapsedTime * 0.3;
  torus.rotation.y = elapsedTime * 0.3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
