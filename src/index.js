'use strict';

var stage = 1;
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
  var bar = scene.getObjectByName('bar');

  if (bar.position.x <= 0.7) {
    bar.position.x += 0.1;
    renderScene();
  }
}

function moveBarLeft() {
  console.log('Moving to left');
  var bar = scene.getObjectByName('bar');

  if (bar.position.x >= -0.7) {
    bar.position.x -= 0.1;
    renderScene();
  }
}

function renderScene() {
  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

function init() {
  var colors = [0xF2DC00, 0x00CADB, 0xCC0000, 0x009C0B, 0x725000];

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  renderer.setSize(window.innerWidth * 0.3, window.innerHeight * 0.6);

  camera = new THREE.OrthographicCamera(-1.0, 1.0, -2.0, 2.0, -1.0, 1.0);
  scene.add(camera);

  var barGeometry = new THREE.BoxGeometry(0.4, 0.1, 0);
  var barMaterial = new THREE.MeshBasicMaterial({color: 0xF0F201});
  var bar = new THREE.Mesh(barGeometry, barMaterial);

  bar.name = 'bar';
  bar.position.x = 0;
  bar.position.y = 1.8;
  bar.position.z = 0;

  scene.add(bar);

  var nextBoxX = -0.9;
  for (var i=0; i<10; i++) {
    var color = colors[i % colors.length];
    var boxGeometry = new THREE.BoxGeometry(0.2, 0.1, 0);
    var boxMaterial = new THREE.MeshBasicMaterial({color: color});
    var box = new THREE.Mesh(boxGeometry, boxMaterial);

    box.position.x = nextBoxX;
    box.position.y = -1.4;

    scene.add(box);
    nextBoxX += 0.2;
  }

  // axis helper
  var globalAxis = new THREE.AxisHelper(1.0);
  scene.add(globalAxis);

  document.getElementById('output').appendChild(renderer.domElement);
  window.addEventListener('keypress', checkKey);

  renderScene();
}

window.onload = init;
