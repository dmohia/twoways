// Initialize Stripe (you'll need to replace with your actual publishable key)
const stripe = Stripe('pk_test_51234567890'); // REPLACE WITH YOUR STRIPE KEY

// Shopping Cart
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add to cart functionality
function addToCart(productName, price, type) {
    const existingItem = cart.find(item => item.name === productName && item.type === type);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            type: type, // 'top', 'bottom', or 'set'
            price: parseFloat(price),
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();
    showNotification(`${type} added to cart!`);
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    saveCart();
    renderCart();
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartCount();
            saveCart();
            renderCart();
        }
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartTotal.textContent = '$0.00 USD';
    } else {
        cartEmpty.style.display = 'none';
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.type}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)} USD</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');

        cartTotal.textContent = `$${calculateTotal().toFixed(2)} USD`;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Show cart modal
function showCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'flex';
    renderCart();
}

// Hide cart modal
function hideCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
}

// Checkout with Stripe
async function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }

    // For now, show an alert. You'll need to implement Stripe backend
    alert('Stripe checkout will be implemented. You need:\n\n1. A Stripe account (stripe.com)\n2. Backend server to create checkout session\n3. Replace the Stripe key in script.js\n\nFor now, this is a demo.');

    // This is how you'd redirect to Stripe Checkout (requires backend):
    // const response = await fetch('/create-checkout-session', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ items: cart })
    // });
    // const session = await response.json();
    // stripe.redirectToCheckout({ sessionId: session.id });
}

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
    let currentTranslate = 0;
    let prevTranslate = 0;

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

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
    });

    container.addEventListener('touchend', (e) => {
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        }
        prevTranslate = currentIndex * -100;
    });

    // Mouse drag support for desktop
    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
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

    // Set initial cursor
    container.style.cursor = 'grab';

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initCarousel();

    // Cart icon click handler
    document.querySelector('.cart-icon')?.addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });

    // Close cart modal
    document.querySelector('.close-cart')?.addEventListener('click', hideCart);

    // Click outside modal to close
    document.getElementById('cartModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            hideCart();
        }
    });

    // Checkout button
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);

    // Add to cart button for The Pearl Bikini
    const productCard = document.querySelector('.product-card-large');
    if (productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const addToCartBtn = productCard.querySelector('.btn-add-cart');

        const topPrice = 35;
        const bottomPrice = 35;
        const setPrice = 70;

        addToCartBtn.parentElement.innerHTML = `
            <div class="add-to-cart-buttons">
                <button class="btn-add-cart-item" data-type="Top" data-price="${topPrice}">Add Top - $${topPrice}</button>
                <button class="btn-add-cart-item" data-type="Bottom" data-price="${bottomPrice}">Add Bottom - $${bottomPrice}</button>
                <button class="btn-add-cart-item btn-add-set" data-type="Set" data-price="${setPrice}">Add Set - $${setPrice}</button>
            </div>
        `;

        productCard.querySelectorAll('.btn-add-cart-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                const price = parseFloat(this.dataset.price);
                addToCart(productName, price, type);
            });
        });
    }

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
