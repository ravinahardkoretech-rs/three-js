import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
// import { roughness } from "three/tsl";
import { GroundedSkybox } from "three/examples/jsm/objects/GroundedSkybox.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
const guiProps = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
  }),
);
torusKnot.position.y = 4;
torusKnot.position.x = -4;
scene.add(torusKnot);

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial(),
);

ring.position.y = 3;
scene.add(ring);

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

//model

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.x = 2;
  scene.add(gltf.scene);
  updateModel();
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
const rGBELoader = new RGBELoader();
// cubeTextureLoader.load(
//   [
//     "/environmentMaps/2/px.png",
//     "/environmentMaps/2/nx.png",
//     "/environmentMaps/2/py.png",
//     "/environmentMaps/2/ny.png",
//     "/environmentMaps/2/pz.png",
//     "/environmentMaps/2/nz.png",
//   ],
//   (eve) => {
//     scene.background = eve;
//     scene.environment = eve;
//     updateModel();
//   },
// );
// rGBELoader.load("/environmentMaps/2/2k.hdr", (env) => {
//   env.mapping = THREE.EquirectangularReflectionMapping;

//   const skybox = new GroundedSkybox(env, 15, 100);
//   skybox.position.y = 15;

//   scene.add(skybox);

//   scene.background = env;
//   scene.environment = env;
// });

const textureLoader = new THREE.TextureLoader();
const env = textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
);
env.colorSpace = THREE.SRGBColorSpace;
env.mapping = THREE.EquirectangularReflectionMapping;
scene.background = env;
// scene.environment = env;

const updateModel = () => {
  scene.traverse((obj) => {
    if (
      obj instanceof THREE.Mesh &&
      obj.material instanceof THREE.MeshStandardMaterial
    ) {
      obj.material.metalness = 1;
      obj.material.roughness = 0.5;
      scene.environmentIntensity = guiProps.environmentIntensity;
      // gui.add(scene, "environmentIntensity").min(0).max(10).step(0.0001);
    }
  });
};

scene.backgroundIntensity = 1;
scene.backgroundBlurriness = 0;

guiProps.environmentIntensity = 3;
gui
  .add(guiProps, "environmentIntensity")
  .min(0)
  .max(10)
  .step(0.0001)
  .onChange(updateModel);

gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.0001);
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.00001);

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
});
scene.environment = cubeRenderTarget.texture;
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
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
camera.position.set(8, 6, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.49;

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
  // Time
  const elapsedTime = clock.getElapsedTime();

  if (ring) {
    ring.rotation.x = Math.sin(elapsedTime) * 2;
    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
