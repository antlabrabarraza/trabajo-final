// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-item');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(nav => nav.classList.remove('active'));
        
        document.getElementById(targetSection).classList.add('active');
        link.classList.add('active');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ============================================
// CARRUSEL 3D DIAGONAL CON SCROLL
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const photoItems = document.querySelectorAll('.photo-item');
const carouselWrapper = document.querySelector('.carousel-wrapper');

let currentIndex = 0;
let visibleItems = [];
let isScrolling = false;

// Actualizar items visibles según filtro
function updateVisibleItems() {
    visibleItems = Array.from(photoItems).filter(item => !item.classList.contains('hidden'));
}

// Posicionar fotos en 3D DIAGONAL
function updateCarousel() {
    visibleItems.forEach((item, index) => {
        const offset = index - currentIndex;
        const absOffset = Math.abs(offset);
        
        // Calcular posición en Z (profundidad)
        const zPos = -absOffset * 250;
        
        // Calcular posición en X (horizontal) - MÁS DIAGONAL
        const xPos = offset * 200;
        
        // Calcular posición en Y (vertical) - DIAGONAL DESCENDENTE
        const yPos = offset * 80;
        
        // Calcular rotación en Y (horizontal)
        const rotateY = offset * 12;
        
        // Calcular rotación en Z (inclinación)
        const rotateZ = offset * -3;
        
        // Calcular escala
        const scale = 1 - (absOffset * 0.18);
        
        // Calcular opacidad
        const opacity = absOffset > 3 ? 0 : 1 - (absOffset * 0.25);
        
        // Aplicar transformaciones con diagonal
        item.style.transform = `
            translate(-50%, -50%)
            translateX(${xPos}px)
            translateY(${yPos}px)
            translateZ(${zPos}px)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
        `;
        item.style.opacity = opacity;
        item.style.zIndex = 100 - absOffset;
    });
}

// Navegación con scroll
if (carouselWrapper) {
    carouselWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        isScrolling = true;
        
        if (e.deltaY > 0) {
            // Scroll hacia abajo - siguiente foto
            if (currentIndex < visibleItems.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        } else {
            // Scroll hacia arriba - foto anterior
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }, { passive: false });
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    const playgroundSection = document.getElementById('playground');
    if (playgroundSection && playgroundSection.classList.contains('active')) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentIndex < visibleItems.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        }
    }
});

// Click en foto para avanzar
photoItems.forEach((item) => {
    item.addEventListener('click', () => {
        const itemIndex = visibleItems.indexOf(item);
        if (itemIndex !== -1 && itemIndex !== currentIndex) {
            currentIndex = itemIndex;
            updateCarousel();
        }
    });
});

// Sistema de filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        photoItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'todos' || filter === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        currentIndex = 0;
        updateVisibleItems();
        updateCarousel();
    });
});

// Drag to scroll
let isDragging = false;
let startX = 0;
let startY = 0;
let dragThreshold = 50;

if (carouselWrapper) {
    carouselWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        carouselWrapper.style.cursor = 'grabbing';
    });

    carouselWrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    carouselWrapper.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const endX = e.clientX;
        const endY = e.clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Priorizar movimiento horizontal o vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Movimiento horizontal
            if (Math.abs(diffX) > dragThreshold) {
                if (diffX > 0 && currentIndex < visibleItems.length - 1) {
                    currentIndex++;
                    updateCarousel();
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
        } else {
            // Movimiento vertical
            if (Math.abs(diffY) > dragThreshold) {
                if (diffY > 0 && currentIndex < visibleItems.length - 1) {
                    currentIndex++;
                    updateCarousel();
                } else if (diffY < 0 && currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
        }
        
        isDragging = false;
        carouselWrapper.style.cursor = 'grab';
    });

    carouselWrapper.addEventListener('mouseleave', () => {
        isDragging = false;
        carouselWrapper.style.cursor = 'grab';
    });
}

// Touch support para móviles
let touchStartX = 0;
let touchStartY = 0;

if (carouselWrapper) {
    carouselWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    carouselWrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > dragThreshold) {
                if (diffX > 0 && currentIndex < visibleItems.length - 1) {
                    currentIndex++;
                    updateCarousel();
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
        } else {
            if (Math.abs(diffY) > dragThreshold) {
                if (diffY > 0 && currentIndex < visibleItems.length - 1) {
                    currentIndex++;
                    updateCarousel();
                } else if (diffY < 0 && currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
        }
    });
}

// Inicializar
updateVisibleItems();
updateCarousel();

// ============================================
// ANIMACIONES DE SCROLL PARA PROYECTOS
// ============================================
const projectItems = document.querySelectorAll('.project-item');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

projectItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    projectObserver.observe(item);
});

// ============================================
// FORMULARIO DE CONTACTO
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensaje enviado correctamente');
        contactForm.reset();
    });
}

// ============================================
// ANIMACIÓN DE ENTRADA EN CARGA DE PÁGINA
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});
