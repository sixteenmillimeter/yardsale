/*jshint browser: true*/
/*globals THREE,Stats,Hyper,chance*/

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

		this.cameraM = {
			x : 0,
			y : 120,
			z : -30,
			rotX : -0.5,
			i : 0,
			target : {
				x : 0,
				y : 120,
				z : -30,
				frames : 0
			}
		}

		this.addCamera()

		this.renderer.setSize(this.WIDTH, this.HEIGHT)
		this.container.appendChild(this.renderer.domElement)

		this.addBindings()
		//this.addBg()
		this.addLights()
		this.addObjects()
		//this.addControl()

		if (this.DEBUG) {
			this.addStats()
		}

		this.update()
		this.startAnimation()
	}

	addBg () {
		const plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 40, 40 ),
			new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
		)
		plane.rotation.x = -Math.PI/2
		plane.position.y = -0.5
		this.scene.add( plane )

		plane.receiveShadow = true
	}

	addLights () {
		const pointLight = new THREE.PointLight(0xFFFFFF)
		pointLight.position.x = 200
		pointLight.position.y = 150
		pointLight.position.z = -300

		const pointLight2 = new THREE.PointLight(0xFFFFFF)
		pointLight2.position.x = -400
		pointLight2.position.y = 400

		const ambLight = new THREE.AmbientLight(0x404040)
		this.scene.add(ambLight)

		this.scene.add(pointLight)
		this.scene.add(pointLight2)
	}

	addCamera () {
		this.cameraFocus = new THREE.Object3D()
		this.cameraFocus.position.z = -300
		this.cameraFocus.position.y = 40

		this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR )
		this.camera.position.x = this.cameraM.x
		this.camera.position.y = this.cameraM.y
		this.camera.position.z = this.cameraM.z
		this.camera.rotation.x = -0.5

		this.scene.add(this.camera)
	}

	addControl () {
		this.controls = new THREE.TrackballControls( this.camera );
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = false;
		this.controls.dynamicDampingFactor = 0.15;
		this.controls.keys = [ 65, 83, 68 ];
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

	cameraMove () {
		if (this.cameraM.target.frames === this.cameraM.i) {
			this.cameraM.x = this.camera.position.x
			this.cameraM.y = this.camera.position.y
			this.cameraM.z = this.camera.position.z
		/*	x : 0,
			y : 120,
			z : -30 */

			this.cameraM.target.x = chance.floating({ min : -2, max: 2, fixed : 5 })
			this.cameraM.target.y = chance.floating({ min : 117, max: 123, fixed : 5 })
			this.cameraM.target.z = chance.floating({ min : -33, max: -27, fixed : 5 })

			this.cameraM.i = 0
			let millis = chance.integer({min: 600, max: 1500});
			this.cameraM.target.frames = Math.round(millis / this.FPS)
		} else {
			this.cameraM.i++
			let progress = this.cameraM.i / this.cameraM.target.frames
			let diffX = Math.abs(this.cameraM.target.x - this.cameraM.x)
			let diffY = Math.abs(this.cameraM.target.y - this.cameraM.y)
			let diffZ = Math.abs(this.cameraM.target.z - this.cameraM.z)

			if (this.cameraM.target.x < this.cameraM.x) {
				diffX = -diffX
			}
			if (this.cameraM.target.y < this.cameraM.y) {
				diffY = -diffY
			}
			if (this.cameraM.target.z < this.cameraM.z) {
				diffZ = -diffZ
			}
			this.camera.position.x = this.cameraM.x + (progress * diffX)
			this.camera.position.y = this.cameraM.y + (progress * diffY)
			this.camera.position.z = this.cameraM.z + (progress * diffZ)
		}

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
		//this.camera.lookAt( this.cameraFocus )
		this.cameraMove()
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