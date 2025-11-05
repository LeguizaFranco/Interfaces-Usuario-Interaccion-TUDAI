class PegSolitaireGame {

    // --- 1. Inicialización ---

    constructor(canvasId) {
        this.renderer = new Renderer(canvasId);

        // Se inicializarán en 0, pero se actualizarán después del resize
        this.cellSize = this.renderer.cellSize;
        this.boardOffsetX = this.renderer.boardOffsetX;
        this.boardOffsetY = this.renderer.boardOffsetY;

        // Estado del juego
        this.boardState = []; 
        this.images = {};
        this.isDragging = false;
        this.selectedPeg = null; 
        this.dragPos = null; 
        this.validMoves = [];
        this.animationFrameId = null;
        this.gameOver = false;
        this.gameOverMessage = ""; 

        this.selectedTheme = 'batman';
        this.selectedShape = 'round';

        
        this.timeLimit = 5 * 60; // 5 minutos
        this.timerInterval = null;
        this.timerElement = document.getElementById('timer');

        // Elementos de la UI
        this.restartButton = document.getElementById('restart-button');       


        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.startGame = this.startGame.bind(this);
        
        this.gameLoop = this.gameLoop.bind(this);
    }

    /**
     * Carga todas las imágenes necesarias antes de iniciar el juego.
     */
    async loadImages(theme) {
        const boardImageUrl = '../img/logo-batman.jpg';

        let pegImageUrl;
        switch (theme) {
            case 'batman':
                pegImageUrl = '../img/batman.png';
                break;
            case 'joker':
                pegImageUrl = '../img/logo-joker.jpg';
                break;
            case 'robin':
                pegImageUrl = '../img/logo-robin.jpg';
                break;
            default:
                pegImageUrl = 'https://placehold.co/100x100/3182CE/FFFFFF?text=Default';
        }
        // --------------------------

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = (err) => {
                    console.error("Error al cargar imagen:", src, err);
                    reject(new Error(`No se pudo cargar la imagen: ${src}`));
                };
                img.src = src;
            });
        };

        try {
            const [board, peg] = await Promise.all([
                loadImage(boardImageUrl),
                loadImage(pegImageUrl),
            ]);

            this.images = { board, peg };

            // Pasa la imagen del tablero al Renderer
            this.renderer.boardImage = this.images.board;
        } catch (error) {
            console.error("Una o más imágenes no pudieron cargarse. El juego puede no verse bien.", error);
        }
    }


    /**
     * Define la matriz del tablero.
     * -1 = Fuera del tablero (Inválido)
     * null = Vacío (Movimiento válido)
     * Objeto Peg = Ficha (de la clase seleccionada)
     */
    initBoard() {
        const pegImg = this.images.peg;

        // Determinamos qué clase de Ficha usar
        let PegClass;
        switch (this.selectedShape) {
            case 'square':
                PegClass = SquarePeg;
                break;
            case 'triangle':
                PegClass = TrianglePeg;
                break;
            case 'round':
            default:
                PegClass = RoundPeg;
                break;
        }
        if (!pegImg) {
            console.error("Imagen de ficha no cargada. El tablero estará vacío.");
        }

        // AHORA TODAS LAS FICHAS USAN LA MISMA IMAGEN Y CLASE
        this.boardState = [
            [-1, -1, new PegClass(0, 2, pegImg), new PegClass(0, 3, pegImg), new PegClass(0, 4, pegImg), -1, -1],
            [-1, -1, new PegClass(1, 2, pegImg), new PegClass(1, 3, pegImg), new PegClass(1, 4, pegImg), -1, -1],
            [new PegClass(2, 0, pegImg), new PegClass(2, 1, pegImg), new PegClass(2, 2, pegImg), new PegClass(2, 3, pegImg), new PegClass(2, 4, pegImg), new PegClass(2, 5, pegImg), new PegClass(2, 6, pegImg)],
            [new PegClass(3, 0, pegImg), new PegClass(3, 1, pegImg), new PegClass(3, 2, pegImg), null, new PegClass(3, 4, pegImg), new PegClass(3, 5, pegImg), new PegClass(3, 6, pegImg)], // Posición central vacía
            [new PegClass(4, 0, pegImg), new PegClass(4, 1, pegImg), new PegClass(4, 2, pegImg), new PegClass(4, 3, pegImg), new PegClass(4, 4, pegImg), new PegClass(4, 5, pegImg), new PegClass(4, 6, pegImg)],
            [-1, -1, new PegClass(5, 2, pegImg), new PegClass(5, 3, pegImg), new PegClass(5, 4, pegImg), -1, -1],
            [-1, -1, new PegClass(6, 2, pegImg), new PegClass(6, 3, pegImg), new PegClass(6, 4, pegImg), -1, -1]
        ];
    }

    /**
     * Inicia o reinicia el juego.
     */
    startGame() {
        this.initBoard();
        this.gameOver = false;
        this.gameOverMessage = ""; 
        this.isDragging = false;
        this.selectedPeg = null;
        this.validMoves = [];

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Iniciar temporizador
        this.timeLeft = this.timeLimit;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                this.endGame("¡Se acabó el tiempo!");
            }
        }, 1000);

        // Iniciar el bucle principal de dibujado
        this.gameLoop();
    }

    // --- Lógica del Temporizador y UI ---

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    bindEvents() {
        const canvas = this.renderer.canvas;
        canvas.addEventListener('mousedown', this.handleMouseDown);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseup', this.handleMouseUp);

        this.restartButton.addEventListener('click', this.startGame);         
        
    }

    /**
     * Vincula los eventos del modal de selección
     */
    initSelectionModal() {
        const selectionModal = document.getElementById('selection-modal');
        const gameContainer = document.querySelector('.game-container');
        const themeOptions = document.querySelectorAll('.theme-option');
        const shapeOptions = document.querySelectorAll('.shape-option');
        const startButton = document.getElementById('start-game-button');

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedTheme = option.dataset.theme;
            });
        });

        shapeOptions.forEach(option => {
            option.addEventListener('click', () => {
                shapeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedShape = option.dataset.shape;
            });
        });

        startButton.addEventListener('click', async () => {
            selectionModal.style.display = 'none';
            gameContainer.style.display = 'flex';
            this.renderer.resize();

            // Actualizar la geometría en el juego principal
            this.cellSize = this.renderer.cellSize;
            this.boardOffsetX = this.renderer.boardOffsetX;
            this.boardOffsetY = this.renderer.boardOffsetY;

            // 4. Cargar recursos seleccionados
            await this.loadImages(this.selectedTheme);

            // 5. Vincular eventos del juego (canvas, botones)
            this.bindEvents();

            // 6. Iniciar el juego
            this.startGame();
        });
    }   

    // --- 3. Bucle del Juego (Ahora solo llama al Renderer) ---

    gameLoop() {
        // La lógica del juego  le pasa el estado al Renderer (Vista).
        this.renderer.drawFrame(
            this.boardState,
            this.isDragging,
            this.selectedPeg, 
            this.dragPos,
            this.validMoves,
            this.gameOver,
            this.gameOverMessage
        );

        if (!this.gameOver) {
            this.animationFrameId = requestAnimationFrame(this.gameLoop);
        }
    }

    // --- 4. Lógica de Interacción (Drag & Drop) ---

    handleMouseDown(e) {
        if (this.gameOver) return;

        const pos = this.getMousePos(e);
        const gridPos = this.getGridPos(pos.x, pos.y);

        if (gridPos) {
            const peg = this.boardState[gridPos.row][gridPos.col];
            // Si hay una ficha (un objeto) en esa posición
            if (peg instanceof Peg) {
                this.isDragging = true;
                this.selectedPeg = peg; // Guardamos el *objeto*
                this.dragPos = pos;

                // Ocultar temporalmente la ficha del tablero
                this.boardState[gridPos.row][gridPos.col] = null;

                this.validMoves = this.findValidMovesForPeg(gridPos.row, gridPos.col);
            }
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            this.dragPos = this.getMousePos(e);
        }
    }

    handleMouseUp(e) {
        if (this.gameOver || !this.isDragging) return;

        const dropPos = this.getMousePos(e);
        const gridPos = this.getGridPos(dropPos ? dropPos.x : this.dragPos.x, dropPos ? dropPos.y : this.dragPos.y);

        let moveMade = false;

        if (gridPos) {
            const validMove = this.validMoves.find(
                move => move.to.row === gridPos.row && move.to.col === gridPos.col
            );

            if (validMove) {
                // Movimiento válido
                // Colocar el *objeto* ficha en la nueva posición
                this.boardState[validMove.to.row][validMove.to.col] = this.selectedPeg;
                // Actualizar la posición interna de la ficha
                this.selectedPeg.row = validMove.to.row;
                this.selectedPeg.col = validMove.to.col;

                // Eliminar la ficha saltada (poner en null)
                this.boardState[validMove.jumped.row][validMove.jumped.col] = null;

                moveMade = true;
            }
        }

        if (!moveMade) {
            // Movimiento inválido: Devolver la ficha a su lugar
            this.boardState[this.selectedPeg.row][this.selectedPeg.col] = this.selectedPeg;
        }

        // Limpiar estado de arrastre
        this.isDragging = false;
        this.selectedPeg = null;
        this.dragPos = null;
        this.validMoves = [];

        if (moveMade) {
            this.checkGameOver();
        }
    }

    // --- 5. Lógica del Juego ---

    findValidMovesForPeg(r, c) {
        const moves = [];
        const directions = [
            { dr: -2, dc: 0 }, { dr: 2, dc: 0 }, { dr: 0, dc: -2 }, { dr: 0, dc: 2 }
        ];

        for (const dir of directions) {
            const nr = r + dir.dr;
            const nc = c + dir.dc;

            if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7) {
                // 1. Verificar si el destino es un hueco (null)
                if (this.boardState[nr][nc] === null) {
                    const jr = (r + nr) / 2;
                    const jc = (c + nc) / 2;

                    // 2. Verificar si la celda intermedia tiene una ficha (es un objeto Peg)
                    if (this.boardState[jr][jc] instanceof Peg) {
                        moves.push({
                            from: { row: r, col: c },
                            to: { row: nr, col: nc },
                            jumped: { row: jr, col: jc }
                        });
                    }
                }
            }
        }
        return moves;
    }

    checkGameOver() {
        let totalMoves = 0;
        let pegCount = 0;

        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                // Si hay una ficha (un objeto Peg)
                if (this.boardState[r][c] instanceof Peg) {
                    pegCount++;
                    const moves = this.findValidMovesForPeg(r, c);
                    totalMoves += moves.length;
                }
            }
        }

        if (totalMoves === 0) {
            // Gana si solo queda 1 ficha (objeto Peg) y está en el centro
            if (pegCount === 1 && this.boardState[3][3] instanceof Peg) {
                this.endGame("¡GANASTE!");
            } else {
                this.endGame("¡No hay más movimientos!");
            }
        }
    }

    endGame(message) {
        this.gameOver = true;
        this.gameOverMessage = message;
        clearInterval(this.timerInterval);
        console.log("Juego terminado:", message);
    }

    // --- 6. Funciones de Ayuda  ---

    getCanvasPos(row, col) {
        const x = (col * this.cellSize) + this.boardOffsetX + this.cellSize / 2;
        const y = (row * this.cellSize) + this.boardOffsetY + this.cellSize / 2;
        return { x, y };
    }

    getMousePos(e) {
        const rect = this.renderer.canvas.getBoundingClientRect();
        let x, y;

        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else if (e.changedTouches) {
            // Para touchend
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        const scaleX = this.renderer.width / rect.width;
        const scaleY = this.renderer.height / rect.height;

        return {
            x: (x - rect.left) * scaleX,
            y: (y - rect.top) * scaleY
        };
    }

    getGridPos(x, y) {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (this.boardState[r][c] !== -1) {
                    const pos = this.getCanvasPos(r, c);
                    const dx = x - pos.x;
                    const dy = y - pos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.cellSize * 0.45) {
                        return { row: r, col: c };
                    }
                }
            }
        }
        return null;
    }

} // --- Fin de la clase PegSolitaireGame ---


// --- Punto de entrada ---
window.onload = () => { 
    // 1. Crear el juego (que a su vez crea el Renderer)
    const game = new PegSolitaireGame('game-canvas');

    // 2. Mostrar el modal de selección
    // (loadImages, bindEvents y startGame se llaman DESPUÉS de hacer la selección)
    game.initSelectionModal();
};
