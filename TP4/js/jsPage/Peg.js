class Peg {
    constructor(row, col, image) {
        this.row = row;
        this.col = col;
        this.image = image;
    }
    // COMENTARIOS:
    // Métodos 'draw' y 'drawDragged' serán implementados por las hijas.
    draw(ctx, x, y, radius) {
        // Las hijas deben sobrescribir esto
        ctx.fillStyle = 'red';
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        ctx.fillText("Error", x, y);
    }

    drawDragged(ctx, x, y, radius) {
        // Las hijas que hereden deben sobrescribir esto
        this.draw(ctx, x, y, radius * 1.1);
    }
}