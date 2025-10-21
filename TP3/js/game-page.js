// Función para cambiar la imagen principal de la galería
function changeGalleryImage(newImageSrc) {
    // Obtener la imagen principal de la galería
    const mainImage = document.querySelector('.gallery-main img');

    // Cambiar la fuente de la imagen
    if (mainImage) {
        mainImage.src = newImageSrc;
    }

    // Actualizar las clases de las miniaturas (opcional: para mostrar cuál está activa)
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('gallery-thumb-active');
        // Si la miniatura coincide con la nueva imagen, marcarla como activa
        if (thumb.onclick.toString().includes(newImageSrc)) {
            thumb.classList.add('gallery-thumb-active');
        }
    });
}

// Función para volver al principio
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funcionalidad para mostrar/ocultar el botón "Volver al principio"
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Mostrar el botón después de hacer scroll de 300px hacia abajo
    if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Asegurarse de que el botón esté oculto al cargar la página
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.classList.add('hidden');
    }
});