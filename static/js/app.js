/*jshint browser: true*/
/*globals THREE,Stats*/

'use strict'
const FPS = 24//for animations, not renderer

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight

const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight

const VIEW_ANGLE = 45
const ASPECT = WIDTH / HEIGHT
const NEAR = 0.1
const FAR = 10000

const RADIUS = 50
const SEGMENTS = 16
const RINGS = 16

const container = document.querySelector('#viewer')
const renderer = new THREE.WebGLRenderer()
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR )
const scene = new THREE.Scene()

scene.add(camera)
renderer.setSize(WIDTH, HEIGHT)
container.appendChild(renderer.domElement)

const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 })
const sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS), sphereMaterial)

const sM2 = new THREE.MeshLambertMaterial({ color: 0xFFFF99 })
const s2 = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), sM2)

const point = new THREE.Object3D()

s2.position.x = -100

point.add(s2)
point.position.z = -300

sphere.position.z = -300

scene.add(sphere)
scene.add(point)

const pointLight = new THREE.PointLight(0xFFFFFF)

pointLight.position.x = 10
pointLight.position.y = 50
pointLight.position.z = 130

scene.add(pointLight)

renderer.render(scene, camera)

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

/* FUNCTIONS */

function update () {
    renderer.render(scene, camera)

    stats.begin()
    stats.end()

    requestAnimationFrame(update)
}

requestAnimationFrame(update)

function rotatePoint () {
    point.rotation.y += 0.01
}

function animations () {
    rotatePoint()
}

setInterval(animations, 1000 / FPS)
