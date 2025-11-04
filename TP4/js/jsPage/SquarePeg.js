class SquarePeg extends Peg {
    draw(ctx, x, y, radius) {
        if (!this.image) return;
        // Simplemente dibuja la imagen
        ctx.drawImage(this.image, x - radius, y - radius, radius * 2, radius * 2);
    }

    drawDragged(ctx, x, y, radius) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        const size = radius * 1.1; // Un poco más grande

        if (this.image) {
            ctx.drawImage(this.image, x - size, y - size, size * 2, size * 2);
        }
        ctx.restore();
    }
}