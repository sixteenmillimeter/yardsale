/*jshint browser: true*/
/*globals THREE,Stats*/

'use strict'

class YardSale {
	constructor (selector = '#viewer', debug = true) {
		this.WIDTH = window.innerWidth
		this.HEIGHT = window.innerHeight
		this.ASPECT = this.WIDTH / this.HEIGHT
		this.VIEW_ANGLE = 40
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
		this.camera.position.y = 60
		this.camera.rotation.x = -0.3
		this.scene.add(this.camera)
	}

	addObjects () {
		this.addTable()
		this.addBox()
	}

	addTable (x = 200, y = 80, legH = 70) {
		const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x996600 })
		const legMaterial = new THREE.MeshPhongMaterial({ color: 0x7b7f82 })

		const tableTop = new THREE.Mesh(new THREE.CubeGeometry(x, 5, y), tableMaterial)
		const legShape = new THREE.CylinderGeometry(2, 2, legH, 10)
		let leg
		this.table = new THREE.Object3D()
		for (let i = 0; i < 4; i++) {
			leg = new THREE.Mesh(legShape, legMaterial)
			leg.position.y = -(legH / 2)
			//TODO: this is bad
			if (i === 0) {
				leg.position.x = (x / 2) - 3
				leg.position.z = (y / 2) - 3
			} else if (i === 1) {
				leg.position.x = -(x / 2) + 3
				leg.position.z = (y / 2) - 3
			} else if (i === 2) {
				leg.position.x = -(x / 2) + 3
				leg.position.z = -(y / 2) + 3
			} else if (i === 3) {
				leg.position.x = (x / 2) - 3
				leg.position.z = -(y / 2) + 3
			}
 			this.table.add(leg)
		}
		this.table.add(tableTop)
		this.table.position.z = -200
		this.scene.add(this.table)
	}

	addBox (x = 60, y = 40, z = 40) {
		const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xCC9933 })
		const t = 0.5
		let boxShape
		let boxSide
		let xPos
		let zPos
		let yRot
		this.box = new THREE.Object3D()
		for (let i = 0; i < 4; i++) {
			if (i === 0) {
				boxShape = new THREE.CubeGeometry(t, z, y)
				xPos = x / 2
				zPos = 0
				yRot = 0
			} else if (i === 1) {
				boxShape = new THREE.CubeGeometry(t, z, x)
				xPos = 0
				zPos = y / 2
				yRot = Math.PI / 2
			} else if (i === 2) {
				boxShape = new THREE.CubeGeometry(t, z, y)
				xPos = -(x / 2)
				zPos = 0
				yRot = 0
			} else if (i === 3) {
				boxShape = new THREE.CubeGeometry(t, z, x)
				xPos = 0
				zPos = -(y / 2)
				yRot = Math.PI / 2
			}
			boxSide = new THREE.Mesh(boxShape, boxMaterial)
			boxSide.position.z = zPos
			boxSide.position.x = xPos
			boxSide.rotation.y = yRot
			boxSide.position.y = z / 2
			this.box.add(boxSide)
		}
		/*			boxSide.position.x = 20
			boxSide.position.y = 20
			boxSide.rotation.y = Math.PI / 2*/
		this.box.position.z = -200
		this.scene.add(this.box)
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