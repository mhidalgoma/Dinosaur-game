'use strict';
// Game Loop
var time = new Date();
var deltaTime = 0;

if (
  document.readyState === 'complete' ||
  document.readyState === 'interactive'
) {
  setTimeout(Init, 1);
} else {
  document.addEventListener('DOMContentLoaded', Init);
}

function Init() {
  time = new Date();
  Start();
  Loop();
}

function Loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  Update();
  requestAnimationFrame(Loop);
}

// The game

var groundY = 22;
var speedY = 0;
var jump = 900;
var gravity = 2500;

var dinoPosX = 42;
var dinoPosY = groundY;

var groundX = 0;
var speedScene = 1280 / 3;
var gameSpeed = 1;
var score = 0;

var stopped = false;
var jumping = false;

var timeUntilObstacle = 2;
var timeObstacleMin = 0.7;
var timeObstacleMax = 1.8;
var obstaclePosY = 16;
var obstacles = [];

var container;
var dino;
var textScore;
var ground;
var gameOver;
var btn;

function Start() {
  gameOver = document.querySelector('.game-over');
  btn = document.querySelector('.js-btn');
  ground = document.querySelector('.ground');
  container = document.querySelector('.container');
  textScore = document.querySelector('.score');
  dino = document.querySelector('.dino');
  document.addEventListener('keydown', HandleKeyDown);
}

function HandleKeyDown(ev) {
  if (ev.keyCode === 32) {
    Jump();
  }
}

function Jump() {
  if (dinoPosY === groundY) {
    jumping = true;
    speedY = jump;
    dino.classList.remove('dino-running');
  }
}

function Update() {
  if (stopped) {
    return;
  }
  MoveGround();
  MoveDino();
  DecideCreateObstacles();
  MoveObstacles();
  DetectCrash();

  speedY -= gravity * deltaTime;
}

function MoveGround() {
  groundX += CalculateMovement();
  ground.style.left = -(groundX % container.clientWidth) + 'px';
}

function CalculateMovement() {
  return speedScene * deltaTime * gameSpeed;
}

function MoveDino() {
  dinoPosY += speedY * deltaTime;
  if (dinoPosY < groundY) {
    TouchGround();
  }
  dino.style.bottom = dinoPosY + 'px';
}
function TouchGround() {
  dinoPosY = groundY;
  speedY = 0;
  if (jumping) {
    dino.classList.add('dino-running');
  }
  jumping = false;
}

function DecideCreateObstacles() {
  timeUntilObstacle -= deltaTime;
  if (timeUntilObstacle <= 0) {
    CreateObstacle();
  }
}

function CreateObstacle() {
  var obstacle = document.createElement('div');
  container.appendChild(obstacle);
  obstacle.classList.add('cactus');
  obstacle.posX = container.clientWidth;
  obstacle.style.left = container.clientWidth + 'px';

  obstacles.push(obstacle);
  timeUntilObstacle =
    timeObstacleMin +
    (Math.random() * (timeObstacleMax - timeObstacleMin)) / gameSpeed;
}

function MoveObstacles() {
  for (var i = obstacles.length - 1; i >= 0; i--) {
    if (obstacles[i].posX < -obstacles[i].clientWidth) {
      obstacles[i].parentNode.removeChild(obstacles[i]);
      obstacles.splice(i, 1);
      EarnPoints();
    } else {
      obstacles[i].posX -= CalculateMovement();
      obstacles[i].style.left = obstacles[i].posX + 'px';
    }
  }
}

function EarnPoints() {
  score++;
  textScore.innerText = score;
}

function DetectCrash() {
  for (var i = 0; i < obstacles.length; i++) {
    if (obstacles[i].posX > dinoPosX + dino.clientWidth) {
      //Evade
      break; // Since they are in order it can't crash with any other
    } else {
      if (IsCollision(dino, obstacles[i], 10, 30, 15, 20)) {
        GameOver();
      }
    }
  }
}

function IsCollision(
  a,
  b,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft
) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height - paddingBottom < bRect.top ||
    aRect.top + paddingTop > bRect.top + bRect.height ||
    aRect.left + aRect.width - paddingRight < bRect.left ||
    aRect.left + paddingLeft > bRect.left + bRect.width
  );
}

function GameOver() {
  Crash();
  gameOver.style.display = 'block';
  btn.style.display = 'block';
  btn.addEventListener('click', HandleBtn);
}
function HandleBtn() {
  deltaTime = 0;

  groundY = 22;
  speedY = 0;
  dinoPosX = 42;
  dinoPosY = groundY;

  groundX = 0;
  speedScene = 1280 / 3;
  gameSpeed = 1;
  score = 0;
  textScore.innerText = score;

  stopped = false;
  jumping = false;

  timeUntilObstacle = 2;
  timeObstacleMin = 0.7;
  timeObstacleMax = 1.8;
  obstaclePosY = 16;
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].parentNode.removeChild(obstacles[i]);
  }
  obstacles = [];

  gameOver.style.display = 'none';
  btn.style.display = 'none ';
  dino.classList.remove('dino-crash');
  dino.classList.add('dino-running');
  Init();
}

function Crash() {
  dino.classList.remove('dino-running');
  dino.classList.add('dino-crash');
  stopped = true;
}
