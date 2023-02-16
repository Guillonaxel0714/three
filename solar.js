import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import sunTexture from './img/sun.jpg'
import mercuryTexture from './img/mercury.jpg'
import venusTexture from './img/venus.jpg'
import earthTexture from './img/earth.jpg'
import marsTexture from './img/mars.jpg'
import jupiterTexture from './img/jupiter.jpg'
import saturnTexture from './img/saturn.jpg'
import saturnRingTexture from './img/saturnRing.jpg'
import uranusTexture from './img/uranus.jpg'
import uranusRingTexture from './img/uranusRing.png'
import neptuneTexture from './img/neptune.jpg'

const solar = document.querySelector(".webgl");

const renderer = new THREE.WebGLRenderer({
   canvas: solar
});

renderer.shadowMap.enabled = true

renderer.setSize(1500, 800)

// Scene
const scene = new THREE.Scene()

// Setup texture de la scène
const textureLoader = new THREE.TextureLoader()
scene.background = new THREE.CubeTextureLoader()
.setPath('img/starbox/')
.load([
    'starspx.png',
    'starsnx.png',
    'starspy.png',
    'starsny.png',
    'starspz.png',
    'starsnz.png'
])

// Setup camera + Orbit control
const camera = new THREE.PerspectiveCamera(
    45,
    1500 / 800,
    0.1,
    1000
)
camera.position.set(-10, 240, 240)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()

/*
// Indicateur axes
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

// Indicateur grid
const gridHelper = new THREE.GridHelper(50)
scene.add(gridHelper)
*/

// Setup lumière
const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300)
scene.add(pointLight)

// Soleil
const sunGeometry = new THREE.SphereGeometry(16, 30, 30)
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

// Ajouter une planete via une fonction
function createPlanete(size, texture, position, ring, route) {
    const geometry = new THREE.SphereGeometry(size, 30, 30)
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    })
    const mesh = new THREE.Mesh(geometry, material)
    const parent = new THREE.Object3D()
    parent.add(mesh)
    if(ring) {
        const ringGeometry = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32)
        const ringMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        parent.add(ringMesh)
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
        ringMesh.rotation.y = -0.2 * Math.PI
        }
        scene.add(parent)
        mesh.position.x = position
        return {mesh, parent}
}

const mercury = createPlanete(3.2, mercuryTexture, 48)
const venus = createPlanete(5.8, venusTexture, 64)
const earth = createPlanete(6, earthTexture, 82)
const mars = createPlanete(4, marsTexture, 98)
const jupiter = createPlanete(12, jupiterTexture, 120)
const saturn = createPlanete(10, saturnTexture, 158, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
})
const uranus = createPlanete(7, uranusTexture, 196, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
})
const neptune = createPlanete(7, neptuneTexture, 220)

// Animations de rotation
function animate() {
    sun.rotateY(0.004)
    mercury.mesh.rotateY(0.004)
    venus.mesh.rotateY(0.002)
    earth.mesh.rotateY(0.02)
    mars.mesh.rotateY(0.018)
    jupiter.mesh.rotateY(0.004)
    saturn.mesh.rotateY(0.038)
    uranus.mesh.rotateY(0.03)
    neptune.mesh.rotateY(0.032)

    mercury.parent.rotateY(0.008)
    venus.parent.rotateY(0.006)
    earth.parent.rotateY(0.005)
    mars.parent.rotateY(0.004)
    jupiter.parent.rotateY(0.002)
    saturn.parent.rotateY(0.0009)
    uranus.parent.rotateY(0.0004)
    neptune.parent.rotateY(0.0002)

    renderer.render(scene, camera)
	window.requestAnimationFrame(animate);
}

// renderer.setAnimationLoop(animate)

animate();

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})