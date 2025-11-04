class Peg {
    constructor(row, col, image) {
        this.row = row;
        this.col = col;
        this.image = image;
    }

    // Métodos 'draw' y 'drawDragged' serán implementados por las subclases.
    draw(ctx, x, y, radius) {
        // Las subclases deben sobrescribir esto
        ctx.fillStyle = 'red';
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        ctx.fillText("Error", x, y);
    }

    drawDragged(ctx, x, y, radius) {
        // Las subclases deben sobrescribir esto
        this.draw(ctx, x, y, radius * 1.1);
    }
}