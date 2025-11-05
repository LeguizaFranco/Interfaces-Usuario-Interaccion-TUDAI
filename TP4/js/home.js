// Variables globales para el carrusel
let currentSlide = 0;
let carouselGames = [];
let carouselInterval;
let isAutoSliding = false;

// Función para volver al principio
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funcionalidad para mostrar/ocultar el botón "Volver al principio"
window.addEventListener('scroll', function () {
    const backToTopButton = document.getElementById('back-to-top');

    // Mostrar el botón después de hacer scroll de 300px hacia abajo
    if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

// Loading simulado al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    // Asegurarse de que el botón esté oculto al cargar la página
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.classList.add('hidden');
    }
    // Crear el overlay de loading
    createLoadingOverlay();

    // Iniciar la simulación de carga
    startLoadingSimulation();

    // Cargar los juegos de la API después del loading
    setTimeout(() => {
        loadGamesFromAPI();
    }, 5200);
});

function createLoadingOverlay() {
    // Crear el contenedor principal del loading
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Cargando FoxGames...</div>
            <div class="loading-progress-bar">
                <div class="loading-progress-fill" id="progress-fill"></div>
            </div>
            <div class="loading-percentage" id="loading-percentage">0%</div>
        </div>
    `;

    // Agregar al body
    document.body.appendChild(loadingOverlay);
}

function startLoadingSimulation() {
    const progressFill = document.getElementById('progress-fill');
    const percentageText = document.getElementById('loading-percentage');
    const loadingOverlay = document.getElementById('loading-overlay');

    let currentProgress = 0;
    const totalTime = 5000; // 1 segundos
    const intervalTime = 50; // Actualizar cada 50ms
    const increment = 100 / (totalTime / intervalTime); // Incremento por cada intervalo

    const progressInterval = setInterval(() => {
        currentProgress += increment;

        // Limitar el progreso al 100%
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);

            // Ocultar el loading después de completar
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 300); // Tiempo de transición
            }, 200);
        }

        // Actualizar la barra de progreso y el porcentaje
        progressFill.style.width = currentProgress + '%';
        percentageText.textContent = Math.floor(currentProgress) + '%';
    }, intervalTime);
}

// juego propio
function getMyOwnGame() {
    return {
        id: 9999,
        name: "PEG SOLITAIRE: BATMAN EDITION",
        background_image_low_res: "../img/image-game.png",
        isOwnGame: true
    };
}
function getMyOwnGame2() {
    return {
        id: 9999,
        name: "BLOCKA ZooSpin",
        background_image_low_res: "../img/portada1.png",
        isOwnGame: true
    };
}

// Función para cargar juegos de la API
function loadGamesFromAPI() {
    fetch('https://vj.interfaces.jima.com.ar/api/v2')
        .then(response => response.json())
        .then(games => {


            // Insertar mi juego propio al inicio
            const myGame = getMyOwnGame();
            const myGame2 = getMyOwnGame2();
            const gamesWithMyGame = [myGame, myGame2, ...games];
            carouselGames = gamesWithMyGame.slice(0, 9); // 9 juegos para 3 slides de 3

            updateCarousels(gamesWithMyGame);

            // Inicializar carrusel después de un pequeño delay
            setTimeout(() => {
                initializeCarousel();
            }, 100);
        })
        .catch(error => {
            console.error('Error al cargar juegos:', error);
            const myGame = getMyOwnGame();
            carouselGames = [myGame, myGame, myGame]; // Repetir para llenar
            updateCarousels([myGame]);
        });
}

// Inicializar el carrusel animado
function initializeCarousel() {
    setupCarouselNavigation();
    updateCarouselDots();
    startAutoSlide();
}

// Configurar navegación del carrusel
function setupCarouselNavigation() {
    // Configurar flechas
    const leftArrow = document.querySelector('.carousel > .arrow.left');
    const rightArrow = document.querySelector('.carousel  > .arrow.right');

    if (leftArrow) {
        leftArrow.onclick = null;
        leftArrow.addEventListener('click', (e) => {
            e.preventDefault();
            // Agregar clase de animación a la flecha
            leftArrow.classList.add('clicked');
            setTimeout(() => leftArrow.classList.remove('clicked'), 300);

            changeSlide(-1);
        });
    }

    if (rightArrow) {
        rightArrow.onclick = null;
        rightArrow.addEventListener('click', (e) => {
            e.preventDefault();
            // Agregar clase de animación a la flecha
            rightArrow.classList.add('clicked');
            setTimeout(() => rightArrow.classList.remove('clicked'), 300);

            changeSlide(1);
        });
    }

    // Configurar dots después de un pequeño delay para asegurar que existan
    setTimeout(() => {
        const dots = document.querySelectorAll('.carousel .dots .dot');


        dots.forEach((dot, index) => {
            dot.onclick = null;
            dot.addEventListener('click', (e) => {
                e.preventDefault();

                goToSlide(index);
            });
        });
    }, 200);

    // Pausar en hover
    const carouselContainer = document.querySelector('.carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {

            pauseAutoSlide();
        });

        carouselContainer.addEventListener('mouseleave', () => {

            startAutoSlide();
        });
    }
}

// Cambiar slide
function changeSlide(direction) {

    if (isAutoSliding && direction !== 1) {
        // Solo permitir cambios manuales cuando no está en auto-slide
        pauseAutoSlide();
    }

    const totalSlides = 3;
    const previousSlide = currentSlide;
    currentSlide += direction;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    updateCarouselSlide();

    // Solo reiniciar auto-slide si fue un cambio manual
    if (direction !== 1 || !isAutoSliding) {
        restartAutoSlide();
    }
}

// Ir a slide específico
function goToSlide(slideIndex) {

    if (slideIndex === currentSlide) {
        return;
    }

    pauseAutoSlide();
    currentSlide = slideIndex;
    updateCarouselSlide();
    restartAutoSlide();
}

// Actualizar slide del carrusel
function updateCarouselSlide() {
    const carouselSlide = document.querySelector('.carousel-slide');
    const dots = document.querySelectorAll('.carousel .dots .dot');

    if (carouselSlide) {
        const translateX = -currentSlide * 33.33;
        carouselSlide.style.transform = `translateX(${translateX}%)`;

        // Animar las cards del slide actual
        setTimeout(() => {
            const allSlideGroups = document.querySelectorAll('.slide-group');
            const currentSlideGroup = allSlideGroups[currentSlide];

            if (currentSlideGroup) {
                const cards = currentSlideGroup.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    // Agregar clase bounce con un pequeño delay para cada card
                    setTimeout(() => {
                        card.classList.add('bounce');
                        // Remover la clase después de la animación
                        setTimeout(() => {
                            card.classList.remove('bounce');
                        }, 900); // Ajustado al tiempo de la animación
                    }, index * 100);
                });
            }
        }, 100); // Pequeño delay para que la transición empiece primero
    }

    // Actualizar dots activos
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Iniciar auto-slide
function startAutoSlide() {
    clearInterval(carouselInterval);
    isAutoSliding = true;

    carouselInterval = setInterval(() => {

        changeSlide(1);
    }, 5000); // Cada 5 segundos


}

// Pausar auto-slide
function pauseAutoSlide() {
    clearInterval(carouselInterval);
    isAutoSliding = false;

}

function restartAutoSlide() {
    pauseAutoSlide();
    setTimeout(() => {
        startAutoSlide();
    }, 1000); // Esperar 1 segundo antes de reiniciar

}

// Función simplificada para actualizar dots (ya no necesaria, pero la mantengo por compatibilidad)
function updateCarouselDots() {
    // Los dots ya están en el HTML, solo necesitamos actualizar sus event listeners
    setTimeout(() => {
        const dots = document.querySelectorAll('.carousel .dots .dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
    }, 100);
}


// Función para actualizar todos los carruseles
function updateCarousels(games) {
    // Actualizar carrusel principal (mi juego + 2 de la API)
    updateMainCarousel(games.slice(0, 9));

    // Actualizar sección "Nuestros elegidos" (mi juego + 4 de la API)
    updateChosenSection(games.slice(0, 5));

    // Actualizar carruseles por categorías (solo juegos de la API)
    updateCategoryCarousels(games.slice(1));
}

// Actualizar carrusel principal
function updateMainCarousel(games) {
    const carouselImages = document.querySelector('.carousel-images');
    if (carouselImages) {
        // Crear 3 slides con 3 juegos cada uno
        const slide1 = games.slice(0, 3);
        const slide2 = games.slice(3, 6);
        const slide3 = games.slice(6, 9);

        carouselImages.innerHTML = `
            <div class="carousel-slide">
                ${createCarouselSlide(slide1, 0)}
                ${createCarouselSlide(slide2, 1)}
                ${createCarouselSlide(slide3, 2)}
            </div>
        `;
    }

    // Actualizar dots
    updateCarouselDots();
}

// Crear un slide del carrusel
function createCarouselSlide(games, slideIndex) {
    const game1 = games[1] || null;
    const game2 = games[0] || null;
    const game3 = games[2] || null;

    return `
        <div class="slide-group" data-slide="${slideIndex}">
            <div class="slide-img card gratis ${game1 && game1.isOwnGame ? 'own-game-card' : ''} animate-in">
                ${game1 ? `
                    <img src="${game1.background_image_low_res}" alt="${game1.name}" class="card-img">
                    <button class="play-btn" title="Jugar ${game1.name}" ${game1.isOwnGame ? 'onclick="window.location.href=\'game-page.html\'"' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" fill="#ffffff"/>
                        </svg>
                    </button>
                    <div class="bottom-overlay">
                        <h4 class="status">${game1.isOwnGame ? 'DESTACADO' : 'Gratis'}</h4>
                        <h3 class="game-title">${game1.name}</h3>
                    </div>
                ` : '<div style="background: #333; width: 100%; height: 100%;"></div>'}
            </div>
            
            <div class="main-img card gratis ${game2 && game2.isOwnGame ? 'own-game-card' : ''} animate-in">
                ${game2 ? `
                    <img src="${game2.background_image_low_res}" alt="${game2.name}" class="card-img">
                    <button class="play-btn" title="Jugar ${game2.name}" ${game2.isOwnGame ? 'onclick="window.location.href=\'game-page.html\'"' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" fill="#ffffff"/>
                        </svg>
                    </button>
                    <div class="bottom-overlay">
                        <h4 class="status">${game2.isOwnGame ? 'DESTACADO' : 'Gratis'}</h4>
                        <h3 class="game-title">${game2.name}</h3>
                    </div>
                ` : '<div style="background: #333; width: 100%; height: 100%;"></div>'}
            </div>
            
            <div class="side-img card gratis ${game3 && game3.isOwnGame ? 'own-game-card' : ''} animate-in">
                ${game3 ? `
                    <img src="${game3.background_image_low_res}" alt="${game3.name}" class="card-img">
                    <button class="play-btn" title="Jugar ${game3.name}" ${game3.isOwnGame ? 'onclick="window.location.href=\'game-page.html\'"' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" fill="#ffffff"/>
                        </svg>
                    </button>
                    <div class="bottom-overlay">
                        <h4 class="status">${game3.isOwnGame ? 'DESTACADO' : 'Gratis'}</h4>
                        <h3 class="game-title">${game3.name}</h3>
                    </div>
                ` : '<div style="background: #333; width: 100%; height: 100%;"></div>'}
            </div>
        </div>
    `;
}


function createGameCard(game, cardIndex = 0) {
    if (!game) return '<div class="card gratis"><div class="card-img" style="background: #333;"></div></div>';

    const isOwnGame = game.isOwnGame || false;

    // Alternar entre gratis y pago (excepto mi juego propio que siempre es destacado)
    const isPaidGame = !isOwnGame && (cardIndex % 2 === 1);

    const cardClass = isPaidGame ? "card pago" : "card gratis";
    const statusClass = isOwnGame ? "status own-game" : (isPaidGame ? "status paid" : "status");
    const statusText = isOwnGame ? "DESTACADO" : (isPaidGame ? "$29.99" : "Gratis");

    // SVG del carrito para juegos de pago (movido fuera del bottom-overlay)
    const cartIcon = isPaidGame ? `
        <svg class="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H3.21922L6.78345 17.2569C5.73276 17.7236 5 18.7762 5 20C5 21.6569 6.34315 23 8 23C9.65685 23 11 21.6569 11 20C11 19.6494 10.9398 19.3128 10.8293 19H15.1707C15.0602 19.3128 15 19.6494 15 20C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 20C21 18.3431 19.6569 17 18 17H8.78078L8.28078 15H18C20.0642 15 21.3019 13.6959 21.9887 12.2559C22.6599 10.8487 22.8935 9.16692 22.975 7.94368C23.0884 6.24014 21.6803 5 20.1211 5H5.78078L5.15951 2.51493C4.93692 1.62459 4.13696 1 3.21922 1H2ZM18 13H7.78078L6.28078 7H20.1211C20.6742 7 21.0063 7.40675 20.9794 7.81078C20.9034 8.9522 20.6906 10.3318 20.1836 11.3949C19.6922 12.4251 19.0201 13 18 13ZM18 20.9938C17.4511 20.9938 17.0062 20.5489 17.0062 20C17.0062 19.4511 17.4511 19.0062 18 19.0062C18.5489 19.0062 18.9938 19.4511 18.9938 20C18.9938 20.5489 18.5489 20.9938 18 20.9938ZM7.00617 20C7.00617 20.5489 7.45112 20.9938 8 20.9938C8.54888 20.9938 8.99383 20.5489 8.99383 20C8.99383 19.4511 8.54888 19.0062 8 19.0062C7.45112 19.0062 7.00617 19.4511 7.00617 20Z" fill="#ffffff"/>
            </g>
        </svg>
    ` : '';

    return `
        <div class="${cardClass} ${isOwnGame ? 'own-game-card' : ''} animate-in">
            <img src="${game.background_image_low_res}" alt="${game.name}" class="card-img">
            <button class="play-btn" title="Jugar ${game.name}" ${isOwnGame ? 'onclick="window.location.href=\'game-page.html\'"' : ''}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" fill="#ffffff"/>
                </svg>
            </button>
            ${cartIcon}
            ${!isPaidGame ? `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-overlay">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            ` : ''}
            <div class="bottom-overlay">
                <h4 class="${statusClass}">${statusText}</h4>
                <h3 class="game-title">${game.name}</h3>
                ${isOwnGame ? '<span class="own-badge">★ JUEGO DESTACADO</span>' : ''}
            </div>
        </div>
    `;
}

// Actualizar sección "Nuestros elegidos" con alternancia
function updateChosenSection(games) {
    const chosenSlide = document.querySelector('.chosen-slide');
    if (chosenSlide && games.length >= 5) {
        chosenSlide.innerHTML = `
            <div class="small-column">
                ${createGameCard(games[1], 1)}
                ${createGameCard(games[2], 2)}
            </div>
            <div class="large-column">
                ${createGameCard(games[0], 0)}
            </div>
            <div class="small-column">
                ${createGameCard(games[3], 3)}
                ${createGameCard(games[4], 4)}
            </div>
        `;
    }
}

// Actualizar carruseles por categorías con alternancia
function updateCategoryCarousels(games) {
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach((container, index) => {
        if (index > 0) {
            const startIndex = (index - 1) * 4;
            const categoryGames = games.slice(startIndex, startIndex + 5);

            if (categoryGames.length > 0) {
                container.innerHTML = '';
                categoryGames.forEach((game, gameIndex) => {
                    const globalIndex = startIndex + gameIndex;
                    container.innerHTML += createGameCard(game, globalIndex);
                });
            }
        }
    });
}

// Funcionalidad del modal de categorías, idiomas y usuario
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar modales después del loading
    setTimeout(() => {
        initializeCategoriesModal();
        initializeLanguagesModal();
        initializeUserModal();
    }, 100);
});

// Funcionalidad del modal de categorías
function initializeCategoriesModal() {
    const menuIcon = document.querySelector('.menu-icon');
    const modal = document.getElementById('categories-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeModal = document.getElementById('close-modal');
    const categoryLinks = document.querySelectorAll('.category-link');

    // Abrir modal al hacer clic en el menú hamburguesa
    if (menuIcon) {
        menuIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showCategoriesModal();
        });
    }

    // Cerrar modal con el botón X
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideCategoriesModal();
        });
    }

    // Cerrar modal al hacer clic en el overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            hideCategoriesModal();
        });
    }

    // Manejar clics en las categorías
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            hideCategoriesModal();
        });
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideCategoriesModal();
        }
    });
}

function showCategoriesModal() {
    const modal = document.getElementById('categories-modal');
    const overlay = document.getElementById('modal-overlay');

    if (modal && overlay) {
        overlay.classList.add('show');
        modal.classList.add('show');
    }
}

function hideCategoriesModal() {
    const modal = document.getElementById('categories-modal');
    const overlay = document.getElementById('modal-overlay');

    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
    }
}

// Funcionalidad del modal de idiomas
function initializeLanguagesModal() {
    const languageIcon = document.querySelector('.language-icon');
    const modal = document.getElementById('languages-modal');
    const overlay = document.getElementById('lang-modal-overlay');
    const closeModal = document.getElementById('close-lang-modal');
    const languageLinks = document.querySelectorAll('.language-link');

    // Abrir modal al hacer clic en el ícono de idioma
    if (languageIcon) {
        languageIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showLanguagesModal();
        });
    }

    // Cerrar modal con el botón X
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideLanguagesModal();
        });
    }

    // Cerrar modal al hacer clic en el overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            hideLanguagesModal();
        });
    }

    // Manejar clics en los idiomas
    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const language = link.getAttribute('data-language');
            hideLanguagesModal();
        });
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            hideLanguagesModal();
        }
    });
}

function showLanguagesModal() {
    const modal = document.getElementById('languages-modal');
    const overlay = document.getElementById('lang-modal-overlay');

    // Cerrar modal de categorías si está abierto
    hideCategoriesModal();

    if (modal && overlay) {
        overlay.classList.add('show');
        modal.classList.add('show');
    }
}

function hideLanguagesModal() {
    const modal = document.getElementById('languages-modal');
    const overlay = document.getElementById('lang-modal-overlay');

    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
    }
}


// Funcionalidad del modal de usuario
function initializeUserModal() {
    const userIcon = document.querySelector('.user-icon');
    const modal = document.getElementById('user-modal');
    const overlay = document.getElementById('user-modal-overlay');
    const closeModal = document.getElementById('close-user-modal');
    const menuLinks = document.querySelectorAll('.user-menu-link');

    // Abrir modal al hacer clic en el ícono de usuario
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showUserModal();
        });
    }

    // Cerrar modal con el botón X
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideUserModal();
        });
    }

    // Cerrar modal al hacer clic en el overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            hideUserModal();
        });
    }

    // Manejar clics en las opciones del menú
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const action = link.getAttribute('data-action');


            // Para logout, permitir la redirección natural del enlace
            if (action === 'logout') {
                // No llamamos preventDefault() para permitir la redirección
                hideUserModal();
                return;
            }

            // Para otras acciones, prevenir la redirección
            e.preventDefault();
            hideUserModal();
        });
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            hideUserModal();
        }
    });
}

function showUserModal() {
    const modal = document.getElementById('user-modal');
    const overlay = document.getElementById('user-modal-overlay');

    // Cerrar otros modales si están abiertos
    hideCategoriesModal();
    hideLanguagesModal();

    if (modal && overlay) {
        overlay.classList.add('show');
        modal.classList.add('show');


    }
}

function hideUserModal() {
    const modal = document.getElementById('user-modal');
    const overlay = document.getElementById('user-modal-overlay');

    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');


    }
}