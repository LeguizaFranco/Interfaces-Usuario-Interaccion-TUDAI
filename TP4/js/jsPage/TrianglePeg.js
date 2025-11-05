class TrianglePeg extends Peg {
    draw(ctx, x, y, radius) {
        if (!this.image) return;
        ctx.save();

        // Crear un camino triangular
        ctx.beginPath();
        ctx.moveTo(x, y - radius); // Punta superior
        ctx.lineTo(x + radius, y + radius); // Esquina derecha-abajo
        ctx.lineTo(x - radius, y + radius); // Esquina izquierda-abajo
        ctx.closePath();

        // Recortar al triángulo
        ctx.clip();
        // Dibujar la imagen
        ctx.drawImage(this.image, x - radius, y - radius, radius * 2, radius * 2);

        ctx.restore();
    }

    drawDragged(ctx, x, y, radius) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        const size = radius * 1.1; // Un poco más grande

        if (this.image) {
            // Mismo recorte triangular
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x - size, y + size);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.image, x - size, y - size, size * 2, size * 2);
        }
        ctx.restore();
    }
}
