import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new GUI();
const guiProps = {};
guiProps.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: Math.random() * 3,
    y: 3,
    z: Math.random() * 3,
  });
};
guiProps.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: Math.random() * 3,
    y: 3,
    z: Math.random() * 3,
  });
};
guiProps.removeAll = () => {
  for (const object of objectUpdate) {
    object.body.removeEventListener("collide", hitAudio);
    world.removeBody(object.body);
    scene.remove(object.mesh);
  }
  objectUpdate.splice(0, objectUpdate.length);
};
gui.add(guiProps, "createSphere");
gui.add(guiProps, "createBox");
gui.add(guiProps, "removeAll");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
//world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
const audio = new Audio("/sounds/hit.mp3");

const hitAudio = (x) => {
  if (x.contact.getImpactVelocityAlongNormal() > 3) {
    audio.currentTime = 0;
    audio.play();
    audio.volume = Math.random();
  }
};

//sphere

const deaft = new CANNON.Material("default");
const mixedMaterial = new CANNON.ContactMaterial(deaft, deaft, {
  friction: 0.2,
  restitution: 0.7,
});
world.defaultContactMaterial = mixedMaterial;

//floor
const phyFloor = new CANNON.Plane();
const phyFloorBody = new CANNON.Body();
phyFloorBody.material = deaft;
phyFloorBody.addShape(phyFloor);
world.addBody(phyFloorBody);
phyFloorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1, 0, 0),
  -Math.PI * 0.5,
);

// phySphereBody.applyLocalForce(
//   new CANNON.Vec3(-150, 0, 150),
//   new CANNON.Vec3(0, 0, 0),
// );

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const sphereTexture = textureLoader.load("/textures/minecraft.png");
const boxTexture = textureLoader.load("/textures/color.jpg");
const floorTexture = textureLoader.load("/textures/checkerboard-8x8.webp");
boxTexture.colorSpace = THREE.SRGBColorSpace;
sphereTexture.colorSpace = THREE.SRGBColorSpace;
floorTexture.colorSpace = THREE.SRGBColorSpace;
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(8, 8);
sphereTexture.magFilter = THREE.NearestFilter;

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
    map: floorTexture,
  }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// floorTexture.repeat.set(2, 2); // large tiles
// floorTexture.repeat.set(5, 5); // medium tiles
floorTexture.repeat.set(10, 10); // small tiles
// floorTexture.repeat.set(20, 20); // very small tiles

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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

//create

const objectUpdate = [];
const geometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  map: sphereTexture,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  map: boxTexture,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const geometryBox = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
const createBox = (width, height, depth, position) => {
  const mesh = new THREE.Mesh(geometryBox, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  //phys
  const phy = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, width / 2));
  const phyBody = new CANNON.Body({
    shape: phy,
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    material: deaft,
  });
  phyBody.position.copy(position);
  world.addBody(phyBody);
  //adding
  objectUpdate.push({ mesh: mesh, body: phyBody });

  //sound
  phyBody.addEventListener("collide", hitAudio);
};
// createBox(1, 1, 1, { x: 0, y: 3, z: 0 });

const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(geometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  //phys
  const phy = new CANNON.Sphere(radius);
  const phyBody = new CANNON.Body({
    shape: phy,
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    material: deaft,
  });
  phyBody.position.copy(position);
  world.addBody(phyBody);
  //adding
  objectUpdate.push({ mesh: mesh, body: phyBody });
  //sound
  phyBody.addEventListener("collide", hitAudio);
};

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - oldTime;
  oldTime = elapsedTime;

  world.step(1 / 60, delta, 3);
  // sphere.position.copy(phySphereBody.position);

  // phySphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), phySphereBody.position);

  // Update controls
  controls.update();

  for (const object of objectUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Render
  renderer.render(scene, camera);

  floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
