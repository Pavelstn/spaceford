/**
 * Created by pavel on 30.01.17.
 */


var canvas, controls, camera;
var renderer, labelRenderer;
var distance_param = 0.37;

var spdx = 200, spdy = 200;
var mouseX = 0, mouseY = 0;
var canvasHeight, canvasWidth;
var projector, raycaster, directionVector;

var sphere, marker, label, line1;

/*$(document).ready(function () {
    $(window).resize(function () {
        init();
    });
});*/

function init() {
    canvasHeight = $("#drawcanvas").height();
    canvasWidth = $("#drawcanvas").width();

    var drawcanvas = document.getElementById('drawcanvas');

    canvas = document.createElement('canvas');



    raycaster = new THREE.Raycaster();
    projector = new THREE.Projector();
    directionVector = new THREE.Vector3();

    drawcanvas.addEventListener('click', function (event) {meshClick(event)}, false);
    drawcanvas.removeEventListener('mousewheel', getmousewheel, false);

    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({antialias: false, preserveDrawingBuffer: true});
    } else {
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


    //camera = new THREE.PerspectiveCamera(45, (canvasWidth / 5) / (canvasHeight / 5), 1, 15000);
    camera = new THREE.PerspectiveCamera(25, canvasWidth / canvasHeight);
    camera.position.x = 0;
    camera.position.y = 40 / distance_param;
    camera.position.z = 400;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    setControls();
    draw_scene();
    animate();
}

function setControls() {
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

function getmousewheel() {
    event = event || window.event;
    if (event.deltaY > 0) {

        distance_param /= 1.05;
    } else {

        distance_param *= 1.05;
    }

    draw_scene();
}

function animate() {
    requestAnimationFrame(animate);
    deltax = spdx - mouseX;
    deltay = spdy - mouseY;
    spdx = (mouseX);
    spdy = (mouseY);
    render();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

function draw_scene() {
    scene = new THREE.Scene();

    if (window.scene_params != undefined) {
        var pointLight2 = new THREE.PointLight(0xffffff);
        pointLight2.position.set(1, 1, 0.5);
        scene.add(pointLight2);

        var ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);


        var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10), new THREE.MeshBasicMaterial({
            color: 0x808080,
            wireframe: true
        }));
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: "#FFFE3C"});
        //material.depthWrite = false;
        sphere = new THREE.Mesh(new THREE.SphereGeometry(window.scene_params.sphere.radius, 20, 10), material);
        sphere.position.set(window.scene_params.sphere.position.x, window.scene_params.sphere.position.y, window.scene_params.sphere.position.z);
        scene.add(sphere);

        marker = new THREE.Mesh(new THREE.SphereGeometry(0.1), marker_material);
        var marker_material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 1});
       // marker_material.depthWrite = false;
        scene.add(marker);




    }

}

function redraw_scene(){
   /* scene.children.forEach(function (object) {
        scene.remove(object);
    });*/

    $( ".pop_up" ).remove();
    draw_scene();
}

function meshClick(event) {
    var x = ( event.offsetX / canvasWidth ) * 2 - 1;
    var y = -( event.offsetY / canvasHeight ) * 2 + 1;
    directionVector.set(x, y, 1);
    projector.unprojectVector(directionVector, camera);
    directionVector.sub(camera.position);
    directionVector.normalize();
    raycaster.set(camera.position, directionVector);
    var intersects = raycaster.intersectObjects([sphere], true);

    scene.remove(line1);
    scene.remove(label);
    $( ".pop_up" ).remove();

    if (intersects.length) {
        marker.position.x = intersects[0].point.x;
        marker.position.y = intersects[0].point.y;
        marker.position.z = intersects[0].point.z;

        text = document.createElement('div');
        text.className = 'pop_up';
        text.textContent = window.scene_params.popover.text;
        label = new THREE.CSS2DObject(text);

        var h=window.scene_params.sphere.radius*3;
        label.position.set(marker.position.x+h , marker.position.y+h, marker.position.z);
        scene.add(label);

        var line_material1 = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 1.0});
        var geometry1 = new THREE.Geometry();
        geometry1.vertices.push(new THREE.Vector3(marker.position.x, marker.position.y, marker.position.z));
        geometry1.vertices.push(new THREE.Vector3(label.position.x, label.position.y, label.position.z));
        line1 = new THREE.Line(geometry1, line_material1);
        scene.add(line1);

    }


}

