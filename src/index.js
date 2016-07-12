'use strict';

var scene;
var renderer;
var camera;

function checkKey(evt) {
  evt.preventDefault();
  const key = evt.key;

  if (key == 'ArrowRight')
    moveBarRight();
  else if (key == 'ArrowLeft')
    moveBarLeft();
}

function moveBarRight() {
  console.log('Moving to right');
}

function moveBarLeft() {
  console.log('Moving to left');
}

function renderScene() {
  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  renderer.setSize(window.innerWidth * 0.3, window.innerHeight * 0.6);

  camera = new THREE.OrthographicCamera(-1.0, 1.0, -2.0, 2.0, -1.0, 1.0);
  scene.add(camera);

  var squareGeometry = new THREE.BoxGeometry(0.4, 0.1, 0);
  var squareMaterial = new THREE.MeshBasicMaterial({color: 0xF0F201});
  var square = new THREE.Mesh(squareGeometry, squareMaterial);

  square.position.x = 0;
  square.position.y = 1.7;
  square.position.z = 0;

  scene.add(square);

  // axis helper
  var globalAxis = new THREE.AxisHelper(1.0);
  scene.add(globalAxis);

  document.getElementById('output').appendChild(renderer.domElement);
  window.addEventListener('keypress', checkKey);

  renderScene();
}

window.onload = init;
