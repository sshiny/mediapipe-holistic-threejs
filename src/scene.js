import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Avatar } from './avatar';
import { Grid } from './world/grid';
import { Forest } from './world/forest';
import { Castle } from './world/castle';
import { Space } from './world/space';
import { House } from './world/house';

const canvasWidthOffset = 1;
const worldDim = 2000;

let renderer, camera, scene, loader, avatar, world, skyColor;
let user;

export async function init(canvas, currUser) {
    window.addEventListener('resize', onWindowResize);

    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidthOffset * window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    canvas.appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, canvasWidthOffset * window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 300, 500);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 200, 0);
    controls.update();

    // scene
    scene = new THREE.Scene();
    loader = new FBXLoader();

    let avatarName = "malcolm";
    let worldName = "grid";

    // avatar
    avatar = await Avatar(avatarName, loader);
    scene.add(avatar);

    // world
    switch (worldName) {
        case "space station":
            [world, skyColor] = Space(worldDim, loader);
            break;
        case "house":
            [world, skyColor] = House(worldDim, loader);
            break;
        case "castle":
            [world, skyColor] = Castle(worldDim, loader);
            break;
        case "forest":
            [world, skyColor] = Forest(worldDim, loader);
            break;
        default:
            [world, skyColor] = Grid(worldDim, loader);
    }
    scene.add(world);
    scene.background = new THREE.Color(skyColor);
}

function onWindowResize() {
    camera.aspect = canvasWidthOffset * window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidthOffset * window.innerWidth, window.innerHeight);
}

export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// BUG: choosing a different avatar before current avatar has loaded does not override selection
// button UI overrides, avatar model should too
export async function updateAvatar(name) {
    if (avatar) {
        avatar.removeFromParent();
        avatar = null;

        avatar = await Avatar(name, loader);
        scene.add(avatar);
    }
}

export async function updateWorld(name) {
    if (world) {
        world.removeFromParent();
        world = null;

        switch (name) {
            case "space station":
                [world, skyColor] = Space(worldDim, loader);
                break;
            case "house":
                [world, skyColor] = House(worldDim, loader);
                break;
            case "castle":
                [world, skyColor] = Castle(worldDim, loader);
                break;
            case "forest":
                [world, skyColor] = Forest(worldDim, loader);
                break;
            default:
                [world, skyColor] = Grid(worldDim, loader);
        }

        scene.add(world);
        scene.background = new THREE.Color(skyColor);
    }
}
