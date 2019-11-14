import Snake from './snake';
import Wall from './wall';
import WallCircle from './walls/wallCircle';
import FoodManager from './foodManager';
import * as menu from './menu';
import { screenLevel2, screenLevel3, screenEndOfGame, ready2, ready3, readyReset } from './screenController';

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
export const cw = canvas.width - 239;
export const ch = canvas.height;

let failed = false;

let screenReady2 = false;
let screenReady3 = false;
let snake = new Snake(50, 50);

let background = new Image();
background.src = '../src/walls/background.jpg';

let wallsRectObject = new Wall();
let wallsCircleObject = new WallCircle();

let wallsRect = wallsRectObject.addWallsRect();
let wallsCircle = wallsCircleObject.addWallsCircle();

let fm = new FoodManager(24, snake, wallsRectObject.wallsRect, wallsCircleObject.wallsCircle);

export const gameLoop = () => {
  if (menu.showMenu === true) {
    menu.mainMenu();
    return;
  }
  ctx.drawImage(background, 0, 0);
  snake.move();
  snake.tailMove();
  wallsCircleObject.drawWalls();
  wallsRectObject.drawWalls();
  fm.manageFood();
  navbarDataUpdate();
  snake.draw();
  if (snake.onHit(wallsRectObject, wallsCircleObject)) {
    gameOver();
    return;
  }

  if (snake.tailLength >= 30 && screenReady2 === false && screenReady3 === false) {
    return screenLevel2();
  }

  if (snake.tailLength >= 40 && screenReady2 === true && screenReady3 === false) {
    return screenLevel3();
  }

  if (snake.tailLength >= 50 && screenReady3 === true) {
    screenEndOfGame();
    failed = true;
    return;
  }
  
  requestAnimationFrame(gameLoop); // ta linijka musi być zawsze na końcu funkcji
};

//wyświetla ekran konca gry
const gameOver = () => {
  //Game over
  let fontHeight = 50;
  ctx.font = 50 + 'px Visitor';
  let textGameOVer = 'Game Over';
  let textGameOverSize = ctx.measureText(textGameOVer);
  ctx.fillText(textGameOVer, cw / 2 - textGameOverSize.width / 2, ch / 2);
  //Press Space to restart
  ctx.font = '20px Visitor';
  let textPressSpace = 'Press Space to restart';
  let textPressSpaceSize = ctx.measureText(textPressSpace);
  ctx.fillText(textPressSpace, cw / 2 - textPressSpaceSize.width / 2, ch / 2 + fontHeight / 1.5);

  failed = true;
};

//restartuje gre
export const gameRestart = () => {
  failed = false;
  readyReset();
  screenReady2 = false;
  screenReady3 = false;
  //restart obiektów
  ctx.clearRect(0, 0, cw, ch);
  snake = new Snake(50, 50);
  wallsCircleObject = new WallCircle();
  wallsRectObject = new Wall();
  wallsCircle = wallsCircleObject.addWallsCircle();
  wallsRect = wallsRectObject.addWallsRect();
  fm = new FoodManager(24, snake, wallsRect, wallsCircle);
  background = new Image();
  background.src = '../src/walls/background.jpg';
  menu.rattle.play();
  //restart petli gry
  requestAnimationFrame(gameLoop);
};

const level2 = () => {
  snake = new Snake(50, 50);
  ctx.clearRect(0, 0, cw, ch);
  wallsCircleObject = new WallCircle();
  wallsRectObject = new Wall();
  wallsCircle = wallsCircleObject.addWallsCircle_level2();
  wallsRect = wallsRectObject.addWallsRect_level2();
  fm = new FoodManager(24, snake, wallsRect, wallsCircle);
  background = new Image();
  background.src = '../src/walls/background.jpg';
  screenReady2 = true;

  //restart petli gry
  requestAnimationFrame(gameLoop);
};

const level3 = () => {
  readyReset();
  ctx.clearRect(0, 0, cw, ch);
  snake = new Snake(50, 50);
  wallsCircleObject = new WallCircle();
  wallsRectObject = new Wall();
  wallsCircle = wallsCircleObject.addWallsCircle_level3();
  wallsRect = wallsRectObject.addWallsRect_level3();
  fm = new FoodManager(24, snake, wallsRect, wallsCircle);
  background = new Image();
  background.src = '../src/walls/background.jpg';
  screenReady3 = true;
  //restart petli gry
  requestAnimationFrame(gameLoop);
};

canvas.addEventListener('mousemove', menu.checkPosition);
canvas.addEventListener('mouseup', menu.checkClick);

document.addEventListener('keypress', ({ keyCode }) => {
  console.log(keyCode);

  if ((keyCode === 65 || keyCode == 97) && snake.direction != 'RIGHT') snake.setDirection('LEFT');
  if ((keyCode === 68 || keyCode == 100) && snake.direction != 'LEFT') snake.setDirection('RIGHT');
  if ((keyCode === 87 || keyCode == 119) && snake.direction != 'DOWN') snake.setDirection('UP');
  if ((keyCode === 83 || keyCode == 115) && snake.direction != 'UP') snake.setDirection('DOWN');
  //Klawisz "K" do wydłużania węża
  if (keyCode === 107 || keyCode === 75) snake.expandSnake();
  //Klawisz "M" do włączania dźwięków
  if (keyCode === 109 || keyCode === 77) {
    menu.playMusic();
  }
  //klawisz "R" do wyłączania menu głównego
  if (keyCode === 82 || keyCode === 114) {
    menu.showMenu = false;
    gameRestart();
  }
  // Spacja resetuje gre, jeżeli przegrana
  if (keyCode === 32) {
    if (failed) gameRestart();
    if (ready2) level2();
    if (ready3) level3();
  }
});

function navbarDataUpdate() {
  document.getElementById('name').innerHTML = `${menu.playerName}`;
  document.getElementById('score-span').innerHTML = `${snake.tailLength}`;
  document.getElementById('multiplier-span').innerHTML = `${fm.multiplier}`;
}

requestAnimationFrame(gameLoop);