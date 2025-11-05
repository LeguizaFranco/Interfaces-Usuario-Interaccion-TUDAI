class RoundPeg extends Peg {
    draw(ctx, x, y, radius) {
        if (!this.image) return;
        ctx.save();
        // Crear un camino circular
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        // Recortar (clip) al círculo
        ctx.clip();
        // Dibujar la imagen dentro del círculo
        ctx.drawImage(this.image, x - radius, y - radius, radius * 2, radius * 2);
        ctx.restore(); // Restaurar para que el resto no esté recortado
    }

    drawDragged(ctx, x, y, radius) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        const size = radius * 1.1; // Un poco más grande

        if (this.image) {
            // Mismo recorte circular para la versión arrastrada
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(this.image, x - size, y - size, size * 2, size * 2);
        }
        ctx.restore();
    }
}