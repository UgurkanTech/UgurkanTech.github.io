"use strict";
import * as THREE from './three.module.js';
const canvas = document.querySelector('canvas.webgl');

let camera, scene, renderer;
let uniforms, material;


let mouse = new THREE.Vector2();

document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
document.addEventListener('touchstart', onDocumentTouchStart, { passive: true });
document.addEventListener('touchmove', onDocumentTouchMove, { passive: true });
document.addEventListener('wheel', onMouseScroll, { passive: true });




function onMouseScroll(event) {
    velocity.y += event.deltaY * 0.0003;
}

let lastMouse = { x: 0, y: 0 };

function onDocumentMouseMove(event) {
    let mouseX = -(event.clientX / window.innerWidth) * 2 - 1;
    let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (lastMouse) {
        let deltaX = mouseX - lastMouse.x;
        let deltaY = mouseY - lastMouse.y;

        velocity.x = deltaX;
        velocity.y = deltaY;
    }

    lastMouse = { x: mouseX, y: mouseY };

}

let lastTouch = null;
let velocity = { x: 0, y: 0 };
let friction = 0.95;

function onDocumentTouchStart(event) {
    lastTouch = {
        x: -(event.touches[0].clientX / window.innerWidth) * 2 - 1,
        y: -(event.touches[0].clientY / window.innerHeight) * 2 + 1
    };

    velocity = { x: 0, y: 0 };
}

function onDocumentTouchMove(event) {
    if (lastTouch) {
        let touchX = -(event.touches[0].clientX / window.innerWidth) * 2 - 1;
        let touchY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

        let deltaX = touchX - lastTouch.x;
        let deltaY = touchY - lastTouch.y;

        velocity.x = deltaX;
        velocity.y = deltaY;

        lastTouch = { x: touchX, y: touchY };
    }
}

function onDocumentTouchEnd() {
    lastTouch = null;
}

init();
animate();





var scale;
var mobile;

function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 1;

    scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(2, 2);


    uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
		mouse: { value: new THREE.Vector2() },
    };

    // Load shaders
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        glslVersion: THREE.GLSL1,
        
    });
    
    

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas,
        alpha: true,
    });


    mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    scale = mobile ? 0.75 : 1;
    renderer.setSize( window.innerWidth * scale, window.innerHeight * scale );

    window.addEventListener('resize', onWindowResize);

	onWindowResize();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth * scale, window.innerHeight * scale );
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
}

function animate() {
    setTimeout( function() {

        requestAnimationFrame( animate );

    }, 1000 / 60 );

    
    // apply velocity to mouse position
    mouse.x += velocity.x;
    mouse.y += velocity.y;

    // reduce velocity for next frame
    velocity.x *= friction;
    velocity.y *= friction;

    if (Math.abs(velocity.x) < 0.001) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.001) velocity.y = 0;
    

    uniforms.time.value += 0.015;
	uniforms.mouse.value.set(mouse.x, mouse.y);
    renderer.render(scene, camera);

}
//Written by -Ugurkan Hosgor