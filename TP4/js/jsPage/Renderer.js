class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.boardImage = null;

        // Inicializar con valores temporales
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
        this.boardOffsetX = 0;
        this.boardOffsetY = 0;
        this.pegRadius = 0;

        // No podemos calcular el tamaño real aquí porque el canvas está oculto
    }

    /**
     * NUEVO: Esta función recalcula las dimensiones del canvas.
     * Debe llamarse DESPUÉS de que el canvas sea visible.
     */
    resize() {
        const dpr = window.devicePixelRatio || 1;
        // AHORA que el canvas es visible, getBoundingClientRect() funcionará
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;

        // Geometría del tablero
        this.cellSize = this.width / 9; // 7 celdas + 1 padding
        this.boardOffsetX = this.cellSize;
        this.boardOffsetY = this.cellSize;
        this.pegRadius = this.cellSize * 0.4;

        console.log(`Canvas redimensionado: ${this.width}x${this.height}, CellSize: ${this.cellSize}`);
    }


    /**
     * Convierte posición de la matriz (row, col) a
     * coordenadas del canvas (x, y) para dibujar.
     */
    getCanvasPos(row, col) {
        const x = (col * this.cellSize) + this.boardOffsetX + this.cellSize / 2;
        const y = (row * this.cellSize) + this.boardOffsetY + this.cellSize / 2;
        return { x, y };
    }

    /**
     * Limpia y dibuja el frame completo.
     * Esta es la función principal llamada por el gameLoop.
     */
    drawFrame(boardState, isDragging, draggedPeg, dragPos, validMoves, gameOver, gameOverMessage) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Dibujar tablero (fondo) - AHORA ES UNA IMAGEN
        if (this.boardImage) {
            this.ctx.drawImage(this.boardImage, 0, 0, this.width, this.height);
        } else {
            // Fallback si la imagen no carga
            this.ctx.fillStyle = '#8B4513'; // Color madera
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // 2. Dibujar fichas y huecos
        this.drawPegsAndHoles(boardState);

        // 3. Dibujar Hints
        this.drawHints(isDragging, validMoves);

        // 4. Dibujar Ficha arrastrada
        this.drawDraggedPeg(isDragging, draggedPeg, dragPos);

        // 5. Dibujar Mensaje Game Over
        if (gameOver) {
            this.drawMessage(gameOverMessage);
        }
    }

    /**
     * Dibuja las fichas (objetos Peg) y los huecos en el tablero.
     */
    drawPegsAndHoles(boardState) {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                const peg = boardState[r][c]; // Esto es un objeto Peg, null, o -1
                if (peg === -1) continue; // Fuera del tablero

                const pos = this.getCanvasPos(r, c);

                // Dibujar el hueco (siempre)
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, this.pegRadius * 0.8, 0, Math.PI * 2);
                this.ctx.fill();

                // Si hay una ficha (un objeto Peg), dibujarla
                if (peg instanceof Peg) {
                    peg.draw(this.ctx, pos.x, pos.y, this.pegRadius);
                }
            }
        }
    }

    /**
     * Dibuja los hints animados.
     */
    drawHints(isDragging, validMoves) {
        if (!isDragging || validMoves.length === 0) {
            return;
        }

        const alpha = (Math.sin(Date.now() / 150) + 1) / 2 * 0.6 + 0.2;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

        for (const move of validMoves) {
            const pos = this.getCanvasPos(move.to.row, move.to.col);
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, this.pegRadius * 0.9, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Dibuja la ficha seleccionada siguiendo el cursor.
     */
    drawDraggedPeg(isDragging, draggedPeg, dragPos) {
        if (isDragging && draggedPeg && dragPos) {
            // Usamos el método especializado de la ficha
            draggedPeg.drawDragged(this.ctx, dragPos.x, dragPos.y, this.pegRadius);
        }
    }

    /**
     * Dibuja el mensaje de fin de juego.
     */
    drawMessage(message) {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 30px Inter';
        this.ctx.fillText(message, this.width / 2, this.height / 2);
        this.ctx.font = '20px Inter';
        this.ctx.fillText("Presiona 'Reiniciar' para jugar de nuevo", this.width / 2, this.height / 2 + 40);
        this.ctx.restore();
    }
}