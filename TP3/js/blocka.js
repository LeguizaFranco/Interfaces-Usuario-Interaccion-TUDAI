let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");

let bancoImagenes = ["imgsblocka/nivel1.png", "imgsblocka/nivel2.png"];

let imagenJuego = new Image();
imagenJuego.src = bancoImagenes[(Math.floor(Math.random() * 2))];




let subImagenJuego = imagenJuego.width;
let rotationDegrees = [90, 180, 270];

imagenJuego.onload = function() {
   let randomNumber;
  console.log(randomNumber);
  let rotationDegree;
  let rotationRadians;




  // PRIMERA SUBIMAGEN

  ctx.save();

  randomNumber = (Math.floor(Math.random() * 3))
  rotationDegree = rotationDegrees[randomNumber];

  if (rotationDegree == 90) {
    ctx.translate(400, 0);
  } else if (rotationDegree == 180) {
    ctx.translate(400, 400);
  } else if (rotationDegree == 270) {
    ctx.translate(0, 400);
  }


  rotationRadians = (rotationDegree * Math.PI) / 180;
  // Rotar la imagen
  ctx.rotate(rotationRadians);
   // Dibuja la parte superior izquierda de la imagen (400x400px) en la posición (0,0)
  ctx.drawImage(imagenJuego, 0, 0, 400, 400, 0, 0, 400, 400);
  ctx.restore();







  // SEGUNDA SUBIMAGEN

     ctx.save();

  
 
  randomNumber = (Math.floor(Math.random() * 3))
  rotationDegree = rotationDegrees[randomNumber];
 
  if (rotationDegree == 90) {
    ctx.translate(800, -400);
  } else if (rotationDegree == 180) {
    ctx.translate(800 + 400, 400);
  } else if (rotationDegree == 270) {
    ctx.translate(400, 800);
  }

  rotationRadians = (rotationDegree * Math.PI) / 180;
  // Rotar la imagen
  ctx.rotate(rotationRadians);
  // Dibuja la parte superior derecha de la imagen (400x400px) en la posición (400,0)
  ctx.drawImage(imagenJuego, 400, 0, 400, 400, 400, 0, 400, 400);
  ctx.restore();
  





  // TERCERA SUBIMAGEN

  ctx.save();

  randomNumber = (Math.floor(Math.random() * 3))
  rotationDegree = rotationDegrees[randomNumber];

 if (rotationDegree == 90) {
    ctx.translate(800, 400);
  } else if (rotationDegree == 180) {
    ctx.translate(400, 800 + 400);
  } else if (rotationDegree == 270) {
    ctx.translate(-400, 800);
  }

  randomNumber = (Math.floor(Math.random() * 3))
  rotationRadians = (rotationDegree * Math.PI) / 180;
  // Rotar la imagen
  ctx.rotate(rotationRadians);

  // Dibuja la parte inferior izquierda de la imagen (400x400px) en la posición (0,400)
  ctx.drawImage(imagenJuego, 0, 400, 400, 400, 0, 400, 400, 400);
  
  ctx.restore();






  // **CUARTA SUBIMAGEN**

  ctx.save();
  
  randomNumber = (Math.floor(Math.random() * 3))
  rotationDegree = rotationDegrees[randomNumber];

 if (rotationDegree == 90) {
    ctx.translate(800 + 400, 0);
  } else if (rotationDegree == 180) {
    ctx.translate(800 + 400, 800 + 400);
  } else if (rotationDegree == 270) {
    ctx.translate(0, 800 + 400);
  }

  randomNumber = (Math.floor(Math.random() * 3))
  rotationRadians = (rotationDegree * Math.PI) / 180;
  // Rotar la imagen
  ctx.rotate(rotationRadians);

  // Dibuja la parte inferior derecha de la imagen (400x400px) en la posición (400,400)
  ctx.drawImage(imagenJuego, 400, 400, 400, 400, 400, 400, 400, 400);
  ctx.restore();

}




























