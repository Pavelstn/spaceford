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
//var line_pos={x1:0, y1:0, z1:0, x2:0, y2:0, z2:0};

/*
 var clickInfo = {
 x: 0,
 y: 0,
 userHasClicked: false
 };
 */
var sphere, marker, label, line1;
var clock = new THREE.Clock();
$(document).ready(function () {
    $(window).resize(function () {
        init();
    });
});

function init() {
    canvasHeight = $("#drawcanvas").height();
    canvasWidth = $("#drawcanvas").width();

    var drawcanvas = document.getElementById('drawcanvas');
    canvas = document.createElement('canvas');

    // var ray = new THREE.ReusableRay();
    raycaster = new THREE.Raycaster();
    projector = new THREE.Projector();
    directionVector = new THREE.Vector3();


    //drawcanvas.addEventListener('click', function(event){meshClick()});
    //drawcanvas.addEventListener('click', function (event) {meshClick(event)}, false);

    drawcanvas.addEventListener('click', function (event) {
        // The user has clicked; let's note this event
        // and the click's coordinates so that we can
        // react to it in the render loop
        // clickInfo.userHasClicked = true;
        // clickInfo.x = evt.clientX;
        // clickInfo.y = evt.clientY;
        meshClick(event);
    }, false);

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
    camera.position.y = 20 / distance_param;
    // camera.position.y = 20;
    camera.position.z = -1600;

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

    /*  controls = new THREE.FirstPersonControls(camera);
     controls.constrainVertical = true;
     controls.movementSpeed = 60;
     controls.lookSpeed = 0.05;
     */
}

function onDocumentMouseDown(event) {

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
    // var delta = clock.getDelta();
    requestAnimationFrame(animate);
    deltax = spdx - mouseX;
    deltay = spdy - mouseY;
    spdx = (mouseX);
    spdy = (mouseY);
    //  $scope.meshBg.quaternion.copy($scope.camera.quaternion);
    render();
    controls.update();
}

function render() {
    // controls.update(delta);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    // camera.position.y = 20;
}

function draw_scene() {
    scene = new THREE.Scene();
    scene.children.forEach(function (object) {
        scene.remove(object);
    });
    scene.add(camera);

    if (window.scene_params != undefined) {
        console.log("window.scene_params", window.scene_params);
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
        plane.name = 'Ground';
        scene.add(plane);


        var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: "#FFFE3C"});
        material.depthWrite = false;
        sphere = new THREE.Mesh(new THREE.SphereGeometry(window.scene_params.sphere.radius, 20, 10), material);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);

        marker = new THREE.Mesh(new THREE.SphereGeometry(0.1), marker_material);
        var marker_material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 1});
        marker_material.depthWrite = false;
        scene.add(marker);




    }


    //  mesh.addEventListener( 'click',function(){meshClick()} , false );




}

function draw_line() {
    var line_material1 = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 1.0});
    line_material1.depthWrite = false;
    var geometry1 = new THREE.Geometry();
    geometry1.vertices.push(new THREE.Vector3(marker.position.x, marker.position.y, marker.position.z));
    geometry1.vertices.push(new THREE.Vector3(label.position.x, label.position.y, label.position.z));
    line1 = new THREE.Line(geometry1, line_material1);
    scene.add(line1);

}

function meshClick(event) {
    console.log("event", event);
    var x = ( event.offsetX / canvasWidth ) * 2 - 1;
    var y = -( event.offsetY / canvasHeight ) * 2 + 1;
    directionVector.set(x, y, 1);
    projector.unprojectVector(directionVector, camera);
    directionVector.sub(camera.position);
    directionVector.normalize();
    raycaster.set(camera.position, directionVector);
    var intersects = raycaster.intersectObjects(scene.children, true);
   // var intersects = raycaster.intersectObjects(sphere, true);
    console.log("intersects", intersects);

    if (intersects.length) {
        marker.position.x = intersects[0].point.x;
        marker.position.y = intersects[0].point.y;
        marker.position.z = intersects[0].point.z;

        scene.remove(line1);


        text = document.createElement('div');
        text.className = 'pop_up';
        text.textContent = "asdasdasd";
        label = new THREE.CSS2DObject(text);
        label.position.set(10, 20, 0);
        scene.add(label);


        draw_line();
    }else{
        scene.remove(line1);
        scene.remove(label);
    }


}

