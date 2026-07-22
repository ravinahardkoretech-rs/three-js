import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color("#140b2d");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Room Group
 */
const room = new THREE.Group();
scene.add(room);

/**
 * Materials
 */
const whiteMaterial = new THREE.MeshStandardMaterial({
  color: "#e9e5f3",
  roughness: 1,
});

const purpleMaterial = new THREE.MeshStandardMaterial({
  color: "#8b5cf6",
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: "#1e1b4b",
});

const woodMaterial = new THREE.MeshStandardMaterial({
  color: "#c08457",
  roughness: 0.8,
  metalness: 0,
});
const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#f8f6f2",
  roughness: 0.9,
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(8.2, 0.25, 8),
  floorMaterial,
);

room.add(floor);

/**
 * Left Wall
 */
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 5, 8),
  whiteMaterial,
);

leftWall.position.set(-4, 2.62, 0);

room.add(leftWall);

/**
 * Back Wall
 */
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(8.2, 5, 0.2),
  whiteMaterial,
);

backWall.position.set(0, 2.62, -4);

room.add(backWall);

/**
 * right wall
 */

const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 5, 8),
  whiteMaterial,
);

rightWall.position.set(4, 2.62, 0);

room.add(rightWall);

/**
 * Carpet
 */
const carpet = new THREE.Mesh(
  new THREE.BoxGeometry(3, 0.05, 3.5),
  new THREE.MeshStandardMaterial({
    color: "#641717",
  }),
);

carpet.position.set(0, 0.14, 1.8);

room.add(carpet);

/**
 * Desk
 */
const deskTop = new THREE.Mesh(
  new THREE.BoxGeometry(3, 0.2, 1.4),
  woodMaterial,
);

deskTop.position.set(0, 1.4, 1);

room.add(deskTop);

for (let i = -1; i <= 1; i += 2) {
  for (let j = -1; j <= 1; j += 2) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.4, 0.15),
      darkMaterial,
    );

    leg.position.set(i * 1.2, 0.7, 1 + j * 0.5);

    room.add(leg);
  }
}
const deskPanel = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 1, 0.08),
  woodMaterial,
);

deskPanel.position.set(0, 0.8, 0.3);

room.add(deskPanel);

/**
 * Monitor
 */
const monitorScreen = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.8, 0.05),
  new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#8b5cf6",
    emissiveIntensity: 4,
  }),
);

monitorScreen.position.set(0, 2.05, 0.85);

room.add(monitorScreen);

const monitorStand = new THREE.Mesh(
  new THREE.BoxGeometry(0.08, 0.5, 0.08),
  darkMaterial,
);

monitorStand.position.set(0, 1.65, 0.8);

room.add(monitorStand);
const frame = new THREE.Mesh(
  new THREE.BoxGeometry(1.3, 0.9, 0.08),
  darkMaterial,
);

frame.position.set(0, 2.05, 0.82);

room.add(frame);

/**
 * Keyboard
 */
for (let x = 0; x < 10; x++) {
  for (let z = 0; z < 4; z++) {
    const key = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.02, 0.06),
      whiteMaterial,
    );

    key.position.set(-0.3 + x * 0.07, 1.56, 1.3 + z * 0.07);

    room.add(key);
  }
}

/**
 * mouse
 */

const mouse = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.05, 0.25),
  darkMaterial,
);

mouse.position.set(0.7, 1.53, 1.4);

room.add(mouse);

/**
 * desk lamp
 */

const lampBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16),
  darkMaterial,
);

lampBase.position.set(-1.1, 1.52, 0.7);

room.add(lampBase);

const lampPole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
  darkMaterial,
);

lampPole.position.set(-1.1, 1.75, 0.7);

room.add(lampPole);

const lampHead = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  purpleMaterial,
);

lampHead.position.set(-1.1, 2.05, 0.7);

room.add(lampHead);

/**
 * Chair
 */
const chairSeat = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.15, 0.8),
  purpleMaterial,
);

chairSeat.position.set(0, 1, 3);

room.add(chairSeat);

const chairBack = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1, 0.15),
  purpleMaterial,
);

chairBack.position.set(0, 1.5, 3.35);

room.add(chairBack);
for (let i = -1; i <= 1; i += 2) {
  for (let j = -1; j <= 1; j += 2) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1, 0.08),
      darkMaterial,
    );

    leg.position.set(i * 0.3, 0.5, 3 + j * 0.3);

    room.add(leg);
  }
}

/**
 * Shelf
 */
for (let i = 0; i < 3; i++) {
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.1, 0.4),
    woodMaterial,
  );

  shelf.position.set(-2.8, 2 + i, -3.5);

  room.add(shelf);
}
const supportLeft = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 5, 0.08),
  woodMaterial,
);

supportLeft.position.set(-3.7, 2.5, -3.5);

room.add(supportLeft);

const supportRight = supportLeft.clone();
supportRight.position.x = -2;

room.add(supportRight);

/**
 * Books
 */
const shelfHeights = [2, 3, 4];

shelfHeights.forEach((height) => {
  for (let i = 0; i < 6; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.5, 0.25),
      new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? "#8b5cf6" : "#ec4899",
      }),
    );

    book.position.set(-3.5 + i * 0.25, height + 0.3, -3.5);

    room.add(book);
  }
});
/**
 * wall decoration
 */

const artGroup = new THREE.Group();

const frameOuter = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 1, 0.08),
  darkMaterial,
);

const frameInner = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.8, 0.04),
  new THREE.MeshStandardMaterial({
    color: "#1e1b4b",
    emissive: "#8b5cf6",
    emissiveIntensity: 0.5,
  }),
);

frameInner.position.z = 0.05;

artGroup.add(frameOuter);
artGroup.add(frameInner);

artGroup.position.set(1, 3.5, -3.9);

room.add(artGroup);
for (let i = 0; i < 5; i++) {
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(0.9 - i * 0.15, 0.02, 0.02),
    new THREE.MeshStandardMaterial({
      color: "#c084fc",
      emissive: "#c084fc",
      emissiveIntensity: 2,
    }),
  );

  line.position.set(1, 3.5 + i * 0.08 - 0.15, -3.82);

  room.add(line);
}

/**
 * fan
 */
const glass = new THREE.Mesh(
  new THREE.BoxGeometry(0.02, 1, 0.8),
  new THREE.MeshPhysicalMaterial({
    transparent: true,
    opacity: 0.3,
  }),
);

glass.position.set(1.25, 0.6, 1);

room.add(glass);
const fans = [];
for (let i = 0; i < 3; i++) {
  const fan = new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.02, 8, 24),
    purpleMaterial,
  );

  fan.rotation.y = Math.PI / 2;

  fan.position.set(1.25, 0.3 + i * 0.3, 1);

  room.add(fan);

  fans.push(fan);
}

/**
 * Plant
 */
const plantPot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.25, 0.3, 16),
  new THREE.MeshStandardMaterial({
    color: "#8B4513",
  }),
);

plantPot.position.set(2.5, 0.95, -3);

room.add(plantPot);

const leaves = [];

for (let i = 0; i < 12; i++) {
  const leaf = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.04, 0.25, 4, 8),
    new THREE.MeshStandardMaterial({
      color: "#2f9e44",
    }),
  );

  leaf.rotation.z = Math.random() * Math.PI;

  leaf.position.set(
    2.5 + Math.random() * 0.5 - 0.25,
    1.8 + Math.random() * 0.5,
    -3 + Math.random() * 0.5 - 0.25,
  );

  room.add(leaf);

  leaves.push(leaf);
  const plantTable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.8, 20),
    woodMaterial,
  );

  plantTable.position.set(2.5, 0.4, -3);

  room.add(plantTable);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12),
    new THREE.MeshStandardMaterial({
      color: "#2f855a",
    }),
  );

  stem.position.set(2.5, 1.5, -2.9);

  room.add(stem);
}

/**
 * Floating Lights
 */

for (let i = -1; i <= 1; i++) {
  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 1.5, 8),
    darkMaterial,
  );

  wire.position.set(i * 2, 4, -1);

  room.add(wire);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 8,
    }),
  );

  bulb.position.set(i * 2, 3.2, -1);

  room.add(bulb);

  const bulbLight = new THREE.PointLight("#ffe8b3", 5, 4);

  bulbLight.position.copy(bulb.position);

  scene.add(bulbLight);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.3, 24, 1, true),
    darkMaterial,
  );

  shade.position.copy(bulb.position);

  shade.position.y += 0.1;

  room.add(shade);
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 2);

directionalLight.position.set(5, 8, 5);

scene.add(directionalLight);

const purpleLight = new THREE.PointLight("#8b5cf6", 40, 20);

purpleLight.position.set(0, 4, 0);

scene.add(purpleLight);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);

camera.position.set(0, 10, 14);
camera.lookAt(0, 2.5, 0);

scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Resize
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;

  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Animation
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  room.position.y = Math.sin(elapsedTime * 0.5) * 0.05;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
