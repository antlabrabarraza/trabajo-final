// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;
    
    cursorX += distX * 0.3;
    cursorY += distY * 0.3;
    
    cursor.style.transform = `translate(${cursorX - 8}px, ${cursorY - 8}px)`;
    
    const followerDistX = mouseX - followerX;
    const followerDistY = mouseY - followerY;
    
    followerX += followerDistX * 0.15;
    followerY += followerDistY * 0.15;
    
    follower.style.transform = `translate(${followerX - 3}px, ${followerY - 3}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Scale cursor on interactive elements
document.querySelectorAll('a, .project-card, .about-photo, .floating-image').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        follower.style.transform += ' scale(2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        follower.style.transform = follower.style.transform.replace(' scale(2)', '');
    });
});

// ============================================
// PAGE NAVIGATION
// ============================================
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const pageNumber = document.querySelector('.page-number');

const pageNumbers = {
    'home': '01',
    'work': '02',
    'about': '03',
    'contact': '04'
};

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('href').substring(1);
        
        // Remove active class from all
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to target
        document.getElementById(targetPage).classList.add('active');
        link.classList.add('active');
        
        // Update page number
        pageNumber.textContent = `${pageNumbers[targetPage]} / 04`;
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ============================================
// PROJECT CARDS FLIP
// ============================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const cardInner = card.querySelector('.card-inner');
        
        if (cardInner.style.transform === 'rotateY(180deg)') {
            cardInner.style.transform = 'rotateY(0deg)';
        } else {
            cardInner.style.transform = 'rotateY(180deg)';
        }
    });
});

// ============================================
// ABOUT PHOTO FLIP
// ============================================
const aboutPhoto = document.querySelector('.about-photo');

if (aboutPhoto) {
    let photoFlipped = false;
    
    aboutPhoto.style.transition = 'transform 0.8s';
    aboutPhoto.style.transformStyle = 'preserve-3d';
    
    aboutPhoto.addEventListener('click', () => {
        if (!photoFlipped) {
            aboutPhoto.style.transform = 'rotateY(180deg)';
            photoFlipped = true;
            
            setTimeout(() => {
                aboutPhoto.style.transform = 'rotateY(0deg)';
                photoFlipped = false;
            }, 2000);
        }
    });
}

// ============================================
// SKILLS FADE IN ON SCROLL
// ============================================
const skillItems = document.querySelectorAll('.skill-item');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0.7';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

skillItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    skillObserver.observe(item);
});

// ============================================
// FLOATING IMAGES PARALLAX
// ============================================
const floatingImages = document.querySelectorAll('.floating-image');

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    floatingImages.forEach((img, index) => {
        const speed = (index + 1) * 0.02;
        const x = (clientX - centerX) * speed;
        const y = (clientY - centerY) * speed;
        
        img.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============================================
// SMOOTH PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// CONTACT LINKS HOVER
// ============================================
const contactLinks = document.querySelectorAll('.contact-links a');

contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.letterSpacing = '0.2em';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.letterSpacing = '0.15em';
    });
});
