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

var container;
var dino;
var textScore;
var ground;
var gameOver;

function Start() {
  gameOver = document.querySelector('.game-over');
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
  MoveGround();
  MoveDino();
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
