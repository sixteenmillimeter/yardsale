/*jshint browser: true*/
/*globals THREE,Stats*/

'use strict'

class YardSale {
	constructor (selector = '#viewer', debug = true) {
		this.WIDTH = window.innerWidth
		this.HEIGHT = window.innerHeight
		this.ASPECT = this.WIDTH / this.HEIGHT
		this.VIEW_ANGLE = 45
		this.NEAR = 0.1
		this.FAR = 10000
		this.FPS = 24
		this.DEBUG = debug

		this.container = document.querySelector(selector)
		this.renderer = this.webglAvailable() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer()
		this.scene = new THREE.Scene()

		this.addCamera()

		this.renderer.setSize(this.WIDTH, this.HEIGHT)
		this.container.appendChild(this.renderer.domElement)

		this.addBindings()
		this.addLights()
		this.addObjects()

		if (this.DEBUG) {
			this.addStats()
		}

		this.update()
		this.startAnimation()
	}

	addLights () {
		const pointLight = new THREE.PointLight(0xFFFFFF)
		pointLight.position.x = 200
		pointLight.position.y = 150
		pointLight.position.z = -300

		const ambLight = new THREE.AmbientLight(0x404040)
		this.scene.add(ambLight)

		this.scene.add(pointLight)
	}

	addCamera () {
		this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR )
		this.camera.position.y = 40
		this.camera.rotation.x = -0.2
		this.scene.add(this.camera)
	}

	addObjects () {
		const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x996600 })
		this.table = new THREE.Mesh(new THREE.CubeGeometry(200, 5, 80), tableMaterial)
		this.table.position.z = -150

		this.scene.add(this.table)
	}

	addStats () {
		this.stats = new Stats()
		this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild( this.stats.dom )
	}

	addBindings () {
		window.addEventListener( 'resize', this.resize.bind(this), false )
	}

	update () {
		this.renderer.render(this.scene, this.camera)
		if (this.DEBUG) {
			this.stats.begin()
			this.stats.end()
		}
		requestAnimationFrame( this.update.bind(this) )
	}

	resize () {
		this.WIDTH = window.innerWidth
		this.HEIGHT = window.innerHeight
		this.ASPECT = this.WIDTH / this.HEIGHT

		this.camera.aspect = this.ASPECT
    	this.camera.updateProjectionMatrix()
		this.renderer.setSize( this.WIDTH, this.HEIGHT )
	}

	animation () {
		//this.table.rotation.y += 0.01
	}

	startAnimation () {
		this.timeout = setInterval(this.animation.bind(this), 1000 / this.FPS)
	}

	webglAvailable () {
		try {
			var c = document.createElement('canvas')
			return !!window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))
		} catch (e) { 
			return false
		} 
	}
}

const yardsale = new YardSale()