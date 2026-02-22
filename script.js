// Premium JavaScript for FOHOW Tchad Website

// Global Variables
let cart = [];
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const quickviewModal = document.getElementById('quickviewModal');
const quickviewClose = document.getElementById('quickviewClose');
const quickviewBody = document.getElementById('quickviewBody');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCart();
    initializeSlider();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeModals();
});

// Navigation Functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                mainNav.classList.remove('active');
            }
        });
    });
    
    // Scroll spy for active navigation
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Cart Functions
function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('fohowCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
    
    // Cart button event
    cartBtn.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', toggleCart);
    
    // Close cart when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            toggleCart();
        }
    });
}

function addToCart(name, price, quantity = 1) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: quantity,
            id: Date.now()
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fohowCart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    
    // Show success animation
    showCartSuccess();
    
    // Show cart modal
    if (!cartModal.classList.contains('active')) {
        setTimeout(() => toggleCart(), 300);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('fohowCart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Votre panier est vide</p>';
        cartTotal.textContent = '0 FCFA';
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} × ${item.price.toLocaleString()} FCFA</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Retirer du panier">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `${total.toLocaleString()} FCFA`;
}

function toggleCart() {
    cartModal.classList.toggle('active');
    document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
}

function showCartSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'cart-success';
    notification.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>Produit ajouté au panier!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Slider Functions
function initializeSlider() {
    const indicators = document.querySelectorAll('.indicator');
    
    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlideDisplay();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlideDisplay();
}

function updateSlideDisplay() {
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Modal Functions
function initializeModals() {
    // Quick view close
    quickviewClose.addEventListener('click', closeQuickview);
    
    // Close modal when clicking outside
    quickviewModal.addEventListener('click', function(e) {
        if (e.target === quickviewModal) {
            closeQuickview();
        }
    });
}

function quickView(name, price, description) {
    const html = `
        <div class="quickview-header">
            <h3>${name}</h3>
        </div>
        <div class="quickview-body-content">
            <p class="quickview-description">${description}</p>
            <div class="quickview-price">${price.toLocaleString()} FCFA</div>
            <button class="btn-quickview-add" onclick="addToCart('${name}', ${price}); closeQuickview();">
                <i class="fas fa-cart-plus"></i>
                <span>Ajouter au panier</span>
            </button>
        </div>
    `;
    
    quickviewBody.innerHTML = html;
    quickviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickview() {
    quickviewModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-card-premium, .pack-card, .event-card').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Menu
function initializeMobileMenu() {
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Animate hamburger
        const spans = this.querySelectorAll('span');
        spans[0].style.transform = mainNav.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = mainNav.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = mainNav.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            mainNav.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function orderWhatsApp() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    const message = `Bonjour, je souhaite commander :\n\n${cart.map(item => 
        `${item.name} - ${item.quantity} × ${item.price.toLocaleString()} FCFA`
    ).join('\n')}\n\nTotal: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} FCFA`;
    
    window.open(`https://wa.me/23595983025?text=${encodeURIComponent(message)}`);
}

// Add CSS for success notification
const style = document.createElement('style');
style.textContent = `
    .cart-success {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .cart-success.show {
        transform: translateX(0);
    }
    
    .success-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
    }
    
    .success-content i {
        font-size: 1.2rem;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .quickview-header {
        padding: 2rem 2rem 0;
    }
    
    .quickview-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
    }
    
    .quickview-body-content {
        padding: 2rem;
    }
    
    .quickview-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .quickview-price {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--accent-color);
        margin-bottom: 2rem;
    }
    
    .btn-quickview-add {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.3s ease;
        width: 100%;
    }
    
    .btn-quickview-add:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
`;

document.head.appendChild(style);