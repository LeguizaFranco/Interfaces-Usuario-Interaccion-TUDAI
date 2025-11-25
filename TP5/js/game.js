// Menú
const menu = document.getElementById("homeScreen");
const btnPlay = document.getElementById("btnPlay");
const btnControls = document.getElementById("btnControls");
const btnBack = document.getElementById("btnBack");
const controlsPanel = document.getElementById("controlsPanel");
btnPlay.onclick = startGame;
btnControls.onclick = () => controlsPanel.classList.remove("hidden");
btnBack.onclick = () => controlsPanel.classList.add("hidden");

// Iniciar juego
function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block"; 
    resetGame();
    playing = true;
    gameLoop();
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

// información del juego
let game = {
  running: true,
  paused: false,
  score: 0,
  lives: 3,
  timeLeft: 20, 
  speed: 180, 
  gravity: 1100,
  flapImpulse: -360,
  lastTime: 0,
  spawnTimer: 0,
  spawnInterval: 1.6, 
  objects: [],
  particles: [],
  parallaxX: 0,
  state: 'playing' 
};

// Datos y botones en pantalla
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timerEl = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const btnPause = document.getElementById('btnPause');
const btnRestart = document.getElementById('btnRestart');
const playAgain = document.getElementById('playAgain');

// No salta hasta que no se haga click o presione espacio
let input = { flap:false };

// funciones para crear números aleatorios y limitar valores
function rand(a,b){ return Math.random()*(b-a)+a; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

let playing = false;

class Bird {
  constructor(x,y){
    this.x = x; this.y = y;
    this.verticalSpeed = 0;
    this.width = 38; this.height = 28;
    this.frame = 0; this.frameTimer = 0;
    this.frameInterval = 0.08; 
    this.rotation = 0;
    this.invulnerable = 0;
    this.alive = true;
  }
  flap(){
    this.verticalSpeed = game.flapImpulse;
    this.frame = 1;
    this.frameTimer = 0;
    this.rotation = -0.8;
  }
  
  // deltaTime: tiempo entre frames en segundos
  update(deltaTime){
    if(!this.alive) return;
    this.verticalSpeed += game.gravity * deltaTime;
    this.y += this.verticalSpeed * deltaTime;

    // Rotación del pájaro hacia abajo 
    this.rotation += 2.0 * deltaTime;
    if (this.rotation > 1.2) {
    this.rotation = 1.2;
    }
    if (this.rotation < -1.2) {
    this.rotation = -1.2;
    }

    // Cambia de frame para simular animación de aleteo
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameInterval) {
     this.frameTimer = 0;     
     this.frame++;             
        if (this.frame > 2) {    
            this.frame = 0;
        }
    }

    // Detecta si el pájaro tocó el piso
    let bordeDeAbajo = this.y + (this.height / 2);
    if (bordeDeAbajo > H) {
    this.y = H - (this.height / 2);
    this.vy = 0;
    this.onCollision();
    }

   // Detecta si el pájaro toca el techo
    let bordeDeArriba = this.y - (this.height / 2);
    if (bordeDeArriba < 0) {
        this.y = this.height / 2;
        this.verticalSpeed = 0;
    }
    if (this.invulnerable > 0) {
        this.invulnerable = this.invulnerable - deltaTime;
    }
  }
  
  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Cuerpo pájaro
    const w = this.width, h = this.height;
    ctx.fillStyle = '#fd9ef1ff';
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.5, h * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojo pájaro
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(w*0.12, -h*0.05, 4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='black'; ctx.beginPath(); ctx.arc(w*0.12, -h*0.05, 2,0,Math.PI*2); ctx.fill();

    // Ala pájaro (según frame)
    ctx.fillStyle = '#fd73f6ff';
    ctx.beginPath();    
    if (this.frame === 1) {
        ctx.ellipse(
            -10, -6,         
            w * 0.32, h * 0.35,
            -0.3,       
            0, Math.PI * 2
        );
    } else if (this.frame === 2) {
        ctx.ellipse(
            -11, 0,
            w * 0.28, h * 0.12,
            -0.3,         
            0, Math.PI * 2
        );
    } else {
        ctx.ellipse(
            -10, 4,
            w * 0.24, h * 0.16,
            0.4,             
            0, Math.PI * 2
        );
    }
    ctx.fill();

    // pico pájaro
    ctx.fillStyle = '#ffd900ff';
    ctx.beginPath(); ctx.moveTo(w*0.7,0); ctx.lineTo(w*0.45,-4); ctx.lineTo(w*0.45,4); ctx.closePath(); ctx.fill();

    ctx.restore();
  }

  //caja contenedora pájaro
  getBounds(){
    return { x:this.x - this.width/2, y:this.y - this.height/2, w:this.width, h:this.height };
  }

  onCollision(){
    if(this.invulnerable>0) return;

    // particulas de explosión
    explode(this.x,this.y, 20);
    this.invulnerable = 1;
    game.lives -= 1;
    updateTopData();
    if(game.lives <= 0) {
      this.alive = false;
      endGame();
    } else {
      this.y = H/2;
      this.verticalSpeed = -100;
    }
  }
}

// Tubos
class Pipe {
  constructor(x, gapY, gapH) {
    this.x = x;
    this.width = 68;
    this.gapY = gapY;
    this.gapH = gapH;
    this.passed = false;
  }
  update(deltaTime) {
    this.x -= game.speed * deltaTime; 
  }
  draw(ctx) {
    ctx.fillStyle = "#2b9a2b";
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 2;

    const topHeight = this.gapY - this.gapH / 2;
    const bottomY = this.gapY + this.gapH / 2;
    const bottomHeight = H - bottomY;

    // Tubo de arriba
    ctx.fillRect(this.x, 0, this.width, topHeight);

    // Tubo de abajo
    ctx.fillRect(this.x, bottomY, this.width, bottomHeight);

    // Bordes
    ctx.fillStyle = "#1f7a1f";
    ctx.fillRect(this.x, topHeight - 12, this.width, 12); 
    ctx.fillRect(this.x, bottomY, this.width, 12);        
  }

  collidesRect(r) {
    const left = this.x;
    const right = this.x + this.width;
    const gapTop = this.gapY - this.gapH / 2;
    const gapBottom = this.gapY + this.gapH / 2;

    if (r.x + r.w < left || r.x > right) return false;

    // toca tubo de arriba
    if (r.y < gapTop) return true;

    // toca tubo de abajo
    if (r.y + r.h > gapBottom) return true;

    return false;
  }
}

class Bonus {  
  constructor(x, y, type = 'coin') {
    this.x = x; 
    this.y = y; 
    this.type = type; 
    this.r = 16;
    this.frame = 0; 
    this.frameTimer = 0;
  }
  update(deltaTime) {
    this.x -= game.speed * deltaTime;
    this.frameTimer += deltaTime;
    if (this.frameTimer > 0.12) {
      this.frameTimer -= 0.12;
      this.frame = (this.frame + 1) % 6;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    this.type === 'coin' ? this.drawCoin(ctx) : this.drawHeart(ctx);
    ctx.restore();
  }
  drawCoin(ctx) {
    // Círculo moneda
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00ff';
    ctx.fill();

    // Franjas moneda
    ctx.fillStyle = '#ffc400ff';

    for (let i = 0; i < 3; i++) {
     const offset = (i - 2.5) * (this.r * 0.25); 
     ctx.fillRect(offset, -this.r * 0.6, this.r * 0.12, this.r * 1.2);
        }
    }

  drawHeart(ctx) {
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.moveTo(0, 9);
    ctx.bezierCurveTo(20, -6, 10, -28, 0, -6);
    ctx.bezierCurveTo(-10, -28, -20, -6, 0, 6);
    ctx.fill();
  }
}

// Particulas de explosión
function explode(x,y,n){
  for(let i=0;i<n;i++){
    game.particles.push({
      x:x, y:y,
      horizontalSpeed: rand(-300,300), verticalSpeed: rand(-300,300),
      life: rand(0.6,1.2), age:0,
      size: rand(2,4),
      color: ['#00ff04ff','#ff8800ff','#6439ffff','#ff40e2ff'][Math.floor(Math.random()*4)]
    });
  }
}

// Capas de parallax
const parallaxLayers = [
  { speed: 0.12, draw: drawFarMountains },
  { speed: 0.28, draw: drawClouds },
  { speed: 0.48, draw: drawTrees },
  { speed: 0.85, draw: drawForeground }
];

// Montañas
function drawFarMountains(ctx, xOffset){
  const step = 280;
  ctx.fillStyle = '#7ab0e6';
  for(let i=-1;i<5;i++){
    const x = i*step + (xOffset % step);
    ctx.beginPath();
    ctx.moveTo(x, H*0.6);
    ctx.quadraticCurveTo(x + step*0.5, H*0.35, x + step, H*0.6);
    ctx.closePath();
    ctx.fill();
  }
}

// Modelo de nube
function drawCloud(ctx,x,y,scale=1){
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.arc(0,0,22,0,Math.PI*2); ctx.arc(24,4,18,0,Math.PI*2); ctx.arc(48,0,22,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

// Nubes
function drawClouds(ctx, xOffset){
  const gap = 180;
  for(let i=-1;i<7;i++){
    const x = i*gap + (xOffset % gap);
    const y = 70 + 30*Math.sin((x+i)*0.01);
    drawCloud(ctx, x, y, 0.9 + 0.2*Math.sin(x*0.01));
  }
}

// Árboles
function drawTrees(ctx, xOffset){
  const gap = 120;
  ctx.fillStyle = '#2e8b57';
  for(let i=-1;i<10;i++){
    const x = i*gap + (xOffset % gap);
    ctx.beginPath();
    ctx.moveTo(x, H*0.8);
    ctx.lineTo(x+20, H*0.58);
    ctx.lineTo(x+40, H*0.8);
    ctx.closePath();
    ctx.fill();
  }
}

// Pasto
function drawForeground(ctx, xOffset){
  const tile = 80;
  ctx.fillStyle = '#7bbf62';
  for(let i=-1;i<20;i++){
    const x = i*tile + (xOffset % tile);
    ctx.fillRect(x, H - 28, tile-6, 28);
  }
}

// Genera tubo superior e inferior
function spawnPipePair(){
  const gapH = rand(130, 180);
  const gapY = rand(120 + gapH/2, H - 140 - gapH/2);
  const x = W + 80;
  const pipe = new Pipe(x, gapY, gapH);
  game.objects.push(pipe);

  // Puede aparecer un bonus
  if(Math.random() < 0.6){
    const coin = new Bonus(x + 34, gapY, 'coin');
    game.objects.push(coin);
  } else if(Math.random() < 0.18){
    const heart = new Bonus(x + 34, gapY, 'heart');
    game.objects.push(heart);
  }
}

// Colisiones entre contenedores
function rectsIntersect(a,b){
  return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

// Loop del juego 
const player = new Bird(150, H/2);
game.objects = []; game.particles = []; 

function updateTopData(){
  scoreEl.textContent = Math.floor(game.score);
  livesEl.textContent = game.lives;
  timerEl.textContent = Math.max(0, Math.ceil(game.timeLeft));
}

function endGame(){
  game.state = 'gameover';
  finalScore.textContent = Math.floor(game.score);
  gameOverScreen.style.display = 'block';
}

function restart(){
  game.score = 0; game.lives = 3; game.timeLeft =20;
  game.spawnTimer = 0; game.objects.length = 0; game.particles.length = 0;
  player.x = 150; player.y = H/2; player.verticalSpeed = 0; player.alive = true; player.invulnerable = 0;
  game.state = 'playing'; gameOverScreen.style.display = 'none';
  updateTopData();
}

// Vuela el pájaro
function onFlap(){
  if(game.state !== 'playing') return;
  player.flap();
}

// Reaci+on al spacebar o click
window.addEventListener('keydown', e=>{
  if(e.code === 'Space'){ e.preventDefault(); onFlap(); }
  if(e.code === 'KeyP'){ togglePause(); }
});
canvas.addEventListener('pointerdown', e=>{ onFlap(); });
btnPause.addEventListener('click', togglePause);
btnRestart.addEventListener('click', ()=>{ restart(); });
playAgain.addEventListener('click', ()=>{ restart(); });
btnPlay.addEventListener('click', ()=>{ restart(); });

function togglePause(){
  if(game.state === 'gameover') return;
  game.paused = !game.paused; btnPause.textContent = game.paused ? 'Reanudar' : 'Pausar';
}

// Loop principal
function loop(ts){
  if(!game.lastTime) game.lastTime = ts;
  let deltaTime = (ts - game.lastTime)/1000;
  game.lastTime = ts;
  if(deltaTime > 0.05) deltaTime = 0.05;

  if(!game.paused && game.state === 'playing'){
    step(deltaTime);
  }
  draw();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Actualiza todo
function step(deltaTime){
  game.parallaxX += game.speed * deltaTime;
  game.timeLeft -= deltaTime;
  if(game.timeLeft <= 0){
    game.timeLeft = 0;
    endGame();
  }

  // aparición de tubos
  game.spawnTimer += deltaTime;
  if(game.spawnTimer > game.spawnInterval){
    game.spawnTimer = 0;
    spawnPipePair();
    game.spawnInterval = rand(1.1,2.0);
  }

  // actualiza jugador
  player.update(deltaTime);

  // actualiza objetos del juego
  for(let i=game.objects.length-1;i>=0;i--){
    const o = game.objects[i];
    if(o.update) o.update(deltaTime);
    if(o.x + (o.w||o.r||0) < -120) game.objects.splice(i,1);
    if(o instanceof Pipe){
      if(!o.passed && o.x + o.w < player.x){
        o.passed = true;
        game.score += 1;
      }
      if(player.alive && o.collidesRect(player.getBounds())){
        player.onCollision();
      }
    } else if(o instanceof Bonus){
      const b = { x: o.x - o.r, y: o.y - o.r, w: o.r*2, h: o.r*2};
      if(rectsIntersect(player.getBounds(), b)){
        if(o.type === 'coin') { game.score += 5; }
        else if(o.type === 'heart') { game.lives += 1; }
        game.objects.splice(i,1);
        updateTopData();
      }
    }
  }

  // Partículas 
  for(let i=game.particles.length-1;i>=0;i--){
    const p = game.particles[i];
    p.age += deltaTime;
    p.x += p.horizontalSpeed * deltaTime;
    p.y += p.verticalSpeed * deltaTime;
    p.verticalSpeed += 900 * deltaTime;
    if(p.age > p.life) game.particles.splice(i,1);
  }

  updateTopData();
}

// Dibuja todo
function draw(){
  ctx.fillStyle = '#7bdbff';
  ctx.fillRect(0,0,W,H);
  for(let i=0;i<parallaxLayers.length;i++){
    ctx.save();
    const layer = parallaxLayers[i];
    const offset = -game.parallaxX * layer.speed;
    layer.draw(ctx, offset);
    ctx.restore();
  }
  const sorted = game.objects.slice().sort((a,b)=> (a.x||0) - (b.x||0));
  for(const o of sorted) o.draw(ctx);
  player.draw(ctx);
  for(const p of game.particles){
    ctx.globalAlpha = clamp(1 - (p.age / p.life), 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}


