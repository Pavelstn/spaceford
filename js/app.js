/**
 * Created by pavel on 30.01.17.
 */


var canvas, controls, camera;
var renderer, labelRenderer;
var distance_param = 0.37;

var spdx = 200, spdy = 200;
var mouseX = 0, mouseY = 0;

$(document).ready(function () {
    $(window).resize(function () {
        init();
    });
});

function init() {
    var canvasHeight= $("#drawcanvas").height();
    var canvasWidth=  $("#drawcanvas").width();

    var drawcanvas= document.getElementById('drawcanvas');
    canvas = document.createElement('canvas');

    if (Detector.webgl){
        renderer = new THREE.WebGLRenderer();
    }else{
        renderer = new THREE.CanvasRenderer();
    }
    drawcanvas.appendChild(renderer.domElement);
    renderer.setClearColor(0xeef4ff);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.sortObjects = false;


    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(canvasWidth, canvasHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    drawcanvas.appendChild(labelRenderer.domElement);



    camera = new THREE.PerspectiveCamera(45, (canvasWidth / 5) / (canvasHeight / 5), 1, 15000);
    camera.position.x = 1600;
    camera.position.y = 1600/ distance_param;
    camera.position.z = 1600;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;


    setControls();
    draw_scene();
    animate();
}

function setControls(){
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.target0.set(0, 0, 0);
    controls.up0.set(0, 0, -1);
    controls.reset();
    controls.addEventListener('change', render);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
}

function onDocumentMouseDown(event){

}

function getmousewheel(){

}

function animate(){
    requestAnimationFrame(animate);
    deltax = spdx - mouseX;
    deltay = spdy - mouseY;
    spdx = (mouseX);
    spdy = (mouseY);
    //  $scope.meshBg.quaternion.copy($scope.camera.quaternion);
    render();
    controls.update();
}

function render(){
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

function draw_scene(){
    scene = new THREE.Scene();

    var material = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 750, 20, 10 ), material );
    mesh.position.set( 0, 0, 0 );
    scene.add( mesh );

    var pointLight2 = new THREE.PointLight(0xffffff);
    pointLight2.position.set(3000, 1500, 300);
    scene.add(pointLight2);


    var text = document.createElement( 'div' );
    text.className = 'pop_up';
    text.textContent = "asdasdasd";
    var label = new THREE.CSS2DObject( text );
    label.position.set( 1000, 0, 1000 );
    scene.add( label );
}