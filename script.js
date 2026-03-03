// Carousel functionality
function initCarousel() {
    const carousel = document.querySelector('.product-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Button navigation
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
        });
    });

    // Touch/Swipe support
    const container = carousel.querySelector('.carousel-container');

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = e.changedTouches[0].clientX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        }
    });

    // Mouse drag support for desktop
    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        const diff = e.clientX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        }
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.style.cursor = 'grab';

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
}

// Cookie consent functionality
function initCookieConsent() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!banner || !acceptBtn) return;

    // Check if user already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        banner.classList.add('show');
    }

    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.remove('show');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initCookieConsent();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
