'use strict';

var stage = 0;
var ballStep = 0;
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
  var bar = scene.getObjectByName('bar');

  if (bar.position.x <= 1.6) {
    bar.position.x += 0.1;
    renderScene();
  }
}

function moveBarLeft() {
  var bar = scene.getObjectByName('bar');

  if (bar.position.x >= -1.6) {
    bar.position.x -= 0.1;
    renderScene();
  }
}

function buildLineBoxes(index, colors) {
  var nextX = -1.8;

  for (var i=0; i<10; i++) {
    var color = colors[i % colors.length];
    var boxGeometry = new THREE.BoxGeometry(0.4, 0.1, 0);
    var boxMaterial = new THREE.MeshBasicMaterial({color: color});
    var box = new THREE.Mesh(boxGeometry, boxMaterial);

    box.position.x = nextX;
    box.position.y = -1.4 + (-0.2 * index);

    scene.add(box);
    nextX += 0.4;
  }
}

function renderScene() {
  var ball = scene.getObjectByName('ball');

  if (ball.position.y >= 1.7)
    ballStep = -0.05;
  if (ball.position.y <= -1.4)
    ballStep = 0.05;
  ball.position.y += ballStep;

  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

function init() {
  var pallete = [
    [0xF2DC00, 0x00CADB, 0xCC0000, 0x009C0B, 0x725000],
    [0x9EDF60, 0x42A2C7, 0xF4DBDB, 0x26418B, 0x020922],
    [0xFF4ADC, 0xDFB14F, 0xEFF17A, 0x78CB6D, 0x18F7FF],
  ];

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
  renderer.setSize(window.innerWidth * 0.3, window.innerHeight * 0.6);

  camera = new THREE.OrthographicCamera(-2.0, 2.0, -2.0, 2.0, -2.0, 2.0);
  scene.add(camera);

  var barGeometry = new THREE.BoxGeometry(0.8, 0.1, 0);
  var barMaterial = new THREE.MeshBasicMaterial({color: 0xF0F201});
  var bar = new THREE.Mesh(barGeometry, barMaterial);

  bar.name = 'bar';
  bar.position.x = 0;
  bar.position.y = 1.8;
  bar.position.z = 0;

  scene.add(bar);

  for (var i=0; i<=stage; i++)
    buildLineBoxes(i, pallete[i]);

  var ballGeometry = new THREE.SphereGeometry(0.05, 50, 50);
  var ballMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
  var ball = new THREE.Mesh(ballGeometry, ballMaterial);

  ball.name = 'ball';
  ball.position.x = 0;
  ball.position.y = 1.7;
  ball.position.z = 0;

  scene.add(ball);

  // axis helper
  var globalAxis = new THREE.AxisHelper(1.0);
  scene.add(globalAxis);

  document.getElementById('output').appendChild(renderer.domElement);
  window.addEventListener('keypress', checkKey);

  renderScene();
}

window.onload = init;
