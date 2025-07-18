import * as THREE from "three";
import GUI from "lil-gui";
import {
  FontLoader,
  OrbitControls,
  TextGeometry,
} from "three/examples/jsm/Addons.js";

const canvas = document.querySelector("canvas.webgl");
const size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera(75, size.x / size.y, 0.1, 100);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

window.addEventListener("resize", () => {
  size.x = window.innerWidth;
  size.y = window.innerHeight;

  camera.aspect = size.x / size.y;
  camera.updateProjectionMatrix();

  renderer.setSize(size.x, size.y);
});

renderer.setSize(size.x, size.y);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();

const gui = new GUI();

const matcapOptions = {
  matcap: 1, // Default is 6.png
};

const matcapMaterial = new THREE.MeshMatcapMaterial();

const updateMatcap = (index) => {
  const texturePath = `/textures/matcaps/${index}.png`;
  textureLoader.load(texturePath, (newTexture) => {
    newTexture.colorSpace = THREE.SRGBColorSpace;
    matcapMaterial.matcap = newTexture;
    matcapMaterial.needsUpdate = true;
  });
};

gui
  .add(matcapOptions, "matcap", {
    "Mat 1": 1,
    "Mat 2": 2,
    "Mat 3": 3,
    "Mat 4": 4,
    "Mat 5": 5,
    "Mat 6": 6,
  })
  .name("Matcap")
  .onChange((value) => {
    updateMatcap(value);
  });

// Load initial matcap
updateMatcap(matcapOptions.matcap);

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  //  TextGeometry

  const textGeometry = new TextGeometry("Rohit Singh", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, matcapMaterial);
  scene.add(text);
});

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 22, 46);
// matcapMaterial.wireframe = true;

for (let i = 0; i < 210; i++) {
  const torus = new THREE.Mesh(torusGeometry, matcapMaterial);
  torus.position.x = (Math.random() - 0.5) * 10;
  torus.position.y = (Math.random() - 0.5) * 10;
  torus.position.z = (Math.random() - 0.5) * 10;
  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();

  torus.scale.set(scale, scale, scale);

  scene.add(torus);
}

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();
