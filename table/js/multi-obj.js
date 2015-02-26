var mainScene, camera, renderer, controls;
var container;
var loader;
var w = window.innerWidth;
var h = window.innerHeight;
var mouseX, mouseY;
var mapMouseX, mapMouseY;
var FBObject1, FBObject2, FBObject3;
var globalUniforms;
var fbos = [];

initScene();
function initScene(){
	container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, w / h, 1, 100000);
    camera.position.set(0,30,-30);
    cameraRTT = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, -10000, 10000 );
	cameraRTT.position.z = 100;
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [ 65, 83, 68 ];


	renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 1);
    container.appendChild(renderer.domElement);


    mainScene = new THREE.Scene();

    globalUniforms = {
		time: { type: "f", value: 0.0 } ,
		resolution: {type: "v2", value: new THREE.Vector2(w,h)},
		step_w: {type: "f", value: 1/w},
		step_h: {type: "f", value: 1/h},
		mouseX: {type: "f", value: 1.0},
		mouseY: {type: "f", value: 1.0},
		tv_resolution: {type: "f", value: 640.0},
		tv_resolution_y: {type: "f", value: 1600.0}
	}
	var fruit_basket = new FBObject({
			w: w,
	    	h: h, 
	    	x: 0,
	    	y: 0,
	    	z: 0,
	    	texture: "textures/fruits1.jpg",
	    	vertexShader: "vs",
	    	fragmentShader1: "fs",
	    	fragmentShader2: "flow",
	    	mainScene: mainScene
		});
		fruit_basket.uniforms = globalUniforms;
		fruit_basket.init(w,h);
		// fruit_basket.loadModel("js/models/fruit-basket.js", 0, 14.75, -10, 1, 0, 0, 0);
		// fbos.push(fruit_basket);
	
	var table = new FBObject({
			w: w,
	    	h: h, 
	    	x: 0,
	    	y: 0,
	    	z: 0,
	    	texture: "textures/table.jpg",
	    	vertexShader: "vs",
	    	fragmentShader1: "fs",
	    	fragmentShader2: "flow",
	    	mainScene: mainScene
		});
		table.uniforms = globalUniforms;
		table.init(w,h);
		table.loadModel("js/models/table.js", 0, 0, -10, 0.5, 0, 0, 0);
		fbos.push(table);

	var soda = new FBObject({
			w: w,
	    	h: h, 
	    	x: 0,
	    	y: 0,
	    	z: 0,
	    	texture: "textures/soda.jpg",
	    	vertexShader: "vs",
	    	fragmentShader1: "fs",
	    	fragmentShader2: "flow",
	    	mainScene: mainScene
		});
		soda.uniforms = globalUniforms;
		soda.init(w,h);
		soda.loadModel("js/models/soda.js", 7.5, 14.75, -10, 2, 0, Math.PI/3, 0);
		fbos.push(soda);

	var chips = new FBObject({
			w: w,
	    	h: h, 
	    	x: 0,
	    	y: 0,
	    	z: 0,
	    	texture: "textures/chips.jpg",
	    	vertexShader: "vs",
	    	fragmentShader1: "fs",
	    	fragmentShader2: "flow",
	    	mainScene: mainScene
		});
		chips.uniforms = globalUniforms;
		chips.init(w,h);
		chips.loadModel("js/models/chips.js", 0, 14.75, -5, 2, Math.PI/2.5, Math.PI, 0);
		fbos.push(chips);
	var bananas = new FBObject({
			w: w,
	    	h: h, 
	    	x: 0,
	    	y: 0,
	    	z: 0,
	    	texture: "textures/banana.jpg",
	    	vertexShader: "vs",
	    	fragmentShader1: "fs",
	    	fragmentShader2: "flow",
	    	mainScene: mainScene
		});
		bananas.uniforms = globalUniforms;
		bananas.init(w,h);
		bananas.loadModel("js/models/bananas.js", 0, 14.75, -10, 2, 0, 0, 0);
		fbos.push(bananas);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);

	// var geometry = new THREE.BoxGeometry(1000,1000,1000);
	// var material = new THREE.MeshBasicMaterial({color:0xff0000});
	// var mesh = new THREE.Mesh(geometry, material);
	// mesh.position.set(0,0,0);
	// mainScene.add(mesh);

    addLights();
    addFloor();
    // onWindowResize();
	animate();

}
function addLights(){
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	mainScene.add(hemiLight)
}
function addFloor(){
	var floorGeometry = new THREE.PlaneBufferGeometry(10000,10000);
	var floorMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
	floorMaterial.side = THREE.DoubleSide;
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.set(0,0,0);
	floor.rotation.x = Math.PI/2;
	mainScene.add(floor);
}
function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}

function onDocumentMouseMove(event){
	mouseX = (event.clientX );
    mouseY = (event.clientY );
    mapMouseX = map(mouseX, window.innerWidth, -1.0,1.0);
    mapMouseY = map(mouseY, window.innerHeight, -1.0,1.0);
    resX = map(mouseX, window.innerWidth, 4000.0,2000.0);
    resY = map(mouseX, window.innerWidth, 10000.0,1600.0);
	globalUniforms.mouseX.value = mapMouseX;
	globalUniforms.mouseY.value = mapMouseY;
	globalUniforms.tv_resolution.value = resX;
	globalUniforms.tv_resolution_y.value = resY;



}
function onWindowResize( event ) {
	globalUniforms.resolution.value.x = window.innerWidth;
	globalUniforms.resolution.value.y = window.innerHeight;
	w = window.innerWidth;
	h = window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown(event){
	for(var i = 0; i < fbos.length; i++){
		fbos[i].getFrame(cameraRTT);
	}
	console.log(camera.position);
}
var inc = 0;
var addFrames = true;
var translate = false;
var time = 0;
function render(){

	controls.update();

	time +=0.1;
    camera.lookAt(mainScene.position);

	globalUniforms.time.value = time;

	for(var i = 0; i < fbos.length; i++){
		fbos[i].passTex();
	}



    inc++
	if(inc >= 10){
		addFrames = false;
	}
	if(addFrames){
		for(var i = 0; i < fbos.length; i++){
			fbos[i].getFrame(cameraRTT);
		}
		translate = true;
	}
	if(translate = true){
		// FBObject1.scale(1.01);
		// FBObject2.scale(0.999);
		// FBObject3.scale(1.1);

	}

	for(var i = 0; i < fbos.length; i++){
		fbos[i].render(cameraRTT);
	}

	renderer.render(mainScene, camera);

	for(var i = 0; i< fbos.length; i++){
		fbos[i].cycle();
	}


}
function animate(){
	window.requestAnimationFrame(animate);
	render();

}