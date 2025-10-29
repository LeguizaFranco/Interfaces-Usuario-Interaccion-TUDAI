
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

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Asegurarse de que el botón esté oculto al cargar la página
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.classList.add('hidden');
    }
});

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

            // // Para logout, permitir la redirección natural del enlace
            // if (action === 'logout') {
            //     // No llamamos preventDefault() para permitir la redirección
            //     hideUserModal();
            //     return;
            // }

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