import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

const canvas = document.querySelector('canvas.webgl');

let camera, scene, renderer;
let uniforms, material;


let mouse = new THREE.Vector2();

document.addEventListener( 'mousemove', onDocumentMouseMove );
function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

init();
animate();


function loadShader(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                console.error('Failed to load shader:', url);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}


var scale;

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
    });
    
    

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas,
        alpha: true,
    });

    scale = 0.1;
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
    requestAnimationFrame(animate);

    uniforms.time.value += 0.05;
	//uniforms.mouse.value.set(mouse.x, mouse.y);
    renderer.render(scene, camera);
}
