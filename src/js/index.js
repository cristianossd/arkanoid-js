'use strict';

var stage = 0;
var stageLines = [-1.4, -1.5, -1.6];
var ballStep = {x: 0, y: 0};
var scene;
var renderer;
var camera;
var rounds = 3;
var qtObjects = 0;
var pallete = [
  [0xF2DC00, 0x00CADB, 0xCC0000, 0x009C0B, 0x725000],
  [0x9EDF60, 0x42A2C7, 0xF4DBDB, 0x26418B, 0x020922],
  [0xFF4ADC, 0xDFB14F, 0xEFF17A, 0x78CB6D, 0x18F7FF],
];

function checkKey(evt) {
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
  }
}

function moveBarLeft() {
  var bar = scene.getObjectByName('bar');

  if (bar.position.x >= -1.6) {
    bar.position.x -= 0.1;
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
    box.position.y = stageLines[index];
    box.name = 'box' + box.position.x.toString() + ',' + box.position.y.toString();

    scene.add(box);
    qtObjects++;
    nextX += 0.4;
  }
}

function checkBarCollision() {
  var ball = scene.getObjectByName('ball');
  var bar = scene.getObjectByName('bar');
  var barLimits = {
    left: bar.position.x - 0.4,
    right: bar.position.x + 0.4
  };

  var currentPos = ball.position.x;
  if (currentPos >= barLimits.left && currentPos <= barLimits.right) {
    var newX = (currentPos - bar.position.x) * 5;
    ballStep.x = newX * 0.005;
    ballStep.y = -0.03;
  }
}

function loseRound() {
  rounds--;
  hideHearts(rounds);

  var roundNumber = document.getElementById('roundNumber');

  if (rounds < 1) {
    qtObjects = 0;
    stage = -1;
  } else {
    setNotification('You lost a heart');
  }

  resetScene();
}

function removeObj(name) {
  if (scene.getObjectByName(name) === undefined) return;

  scene.remove(scene.getObjectByName(name));
  ballStep.y = -ballStep.y;
  qtObjects--;

  setNotification('Nice! You destroyed a block');
  setTimeout(() => {
    setNotification('Keep going, destroy the rest');
  }, 1000);
}

function checkLineCollision(line, ballX) {
  var posX = -1.8;

  for (var i=0; i<10; i++) {
    if (ballX >= posX - 0.2 && ballX <= posX + 0.2) {
      var boxName = 'box' + posX.toString() + ',' + line.toString();
      removeObj(boxName);
    }

    posX += 0.4;
  }
}

function resetScene() {
  var bar = scene.getObjectByName('bar');
  bar.position.x = 0;
  bar.position.y = 1.8;

  var ball = scene.getObjectByName('ball');
  ball.position.x = 0;
  ball.position.y = 1.7;

  ballStep.x = 0;
  ballStep.y = 0;
}

function renderScene() {
  var ball = scene.getObjectByName('ball');

  if (qtObjects > 0) {
    // X axis checkers
    if ((ball.position.x >= -2.0 && ball.position.x < -1.95) ||
        (ball.position.x <= 2.0 && ball.position.x > 1.95))
      ballStep.x = -ballStep.x;

    // Y axis checkers
    if (ball.position.y >= 1.7 && ball.position.y <= 1.8)
      checkBarCollision();
    if (ball.position.y > 1.8)
      loseRound();
    if (ball.position.y <= -2)
      ballStep.y = 0.03;

    // Line boxes collision
    if (ball.position.y <= -1.4 && ball.position.y >= -1.43)
      checkLineCollision(-1.4, ball.position.x);

    if (stage > 0 && (ball.position.y <= -1.5 && ball.position.y >= -1.53))
      checkLineCollision(-1.5, ball.position.x);

    if (stage > 1 && (ball.position.y <= -1.6 && ball.position.y >= -1.63))
      checkLineCollision(-1.6, ball.position.x);

    ball.position.x += ballStep.x;
    ball.position.y += ballStep.y;
  } else if (stage < 0) {
    setNotification('You lose! :(');
    ballStep.x = 0;
    ballStep.y = 0;
  } else {
    stage++;

    if (stage > 3) {
      // finish the game
      setNotification('Congrats, winner! :D');
    } else {
      resetScene();
      setNotification('Good job, you have new blocks!');

      for (var i=0; i<=stage; i++) {
        buildLineBoxes(i, pallete[i]);
        increaseProgress(stage + 1);
      }
    }
  }

  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

function init() {
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

  buildLineBoxes(stage, pallete[stage]);

  var ballGeometry = new THREE.SphereGeometry(0.05, 50, 50);
  var ballMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
  var ball = new THREE.Mesh(ballGeometry, ballMaterial);

  ball.name = 'ball';
  ball.position.x = 0;
  ball.position.y = 1.7;
  ball.position.z = 0;

  scene.add(ball);

  document.getElementById('output').appendChild(renderer.domElement);
  document.addEventListener('keypress', checkKey);

  renderScene();
  setPanelWidth();
  setNotification('The game was started');
  setTimeout(() => {
    setNotification('Destroy the blocks');
  }, 1000);
}

// frontend functions
function setPanelWidth() {
  var canvas = document.getElementsByTagName('canvas')[0];
  var panel = document.getElementById('panel');

  panel.style.width = canvas.clientWidth.toString() + 'px';
}

function setNotification(msg) {
  var notification = document.getElementById('notification');
  notification.innerHTML = msg;
}

function hideHearts(n) {
  var toHide = 3-n;
  var heart = '';

  for (var i=1; i<=toHide; i++) {
    heart = document.getElementById('heart' + i);
    heart.src = 'src/imgs/heart-o.png';
  }
}

function increaseProgress(n) {
  var progressBar = document.getElementById('stage');
  var number = 33.3 * n;

  progressBar.style.width = number.toString() + '%';
}

window.onload = init;
