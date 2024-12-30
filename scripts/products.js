// scripts/products.js

import { getProductDetails, getFeaturedProducts } from '../linking/productLink.js';
import { addItemToCart, getCartByUserId, createCart } from '../linking/cartLink.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        alert('No product specified.');
        window.location.href = 'flora-section-catagory.html';
        return;
    }
    
    try {
        const product = await getProductDetails(productId);
        if (!product) {
            alert('Product not found.');
            window.location.href = 'flora-section-catagory.html';
            return;
        }
        renderProduct(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details.');
    }
});

// Function to render product details on the page
function renderProduct(product) {
    document.title = `${product.scarfName} | Flora Collection`;
    document.querySelector('.product-info h1').textContent = product.scarfName;
    document.querySelector('.sku').textContent = `SKU: ${product.sku}`;
    document.querySelector('.price').textContent = `${product.price.toFixed(2)} EGP`;
    document.querySelector('#product-info-content p').textContent = product.description;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb ol');
    breadcrumb.lastElementChild.textContent = product.scarfName;
    
    // Initialize image gallery
    initializeGallery(product.images);
    
    // Initialize quantity controls with price updates
    initializeQuantityControls(product);
    
    // Initialize Add to Cart functionality
    document.querySelector('.product-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const quantity = parseInt(document.getElementById('quantity').value);
        await handleAddToCart(product.scarfID, quantity);
    });
    
    // Initialize Buy Now functionality
    document.getElementById('buy-now').addEventListener('click', async () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        await handleAddToCart(product.scarfID, quantity);
        window.location.href = 'checkout.html';
    });
    
    // Initialize tab controls
    initializeTabs();
}

// Function to handle adding items to the cart
async function handleAddToCart(scarfID, quantity) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Fetch or create cart
        let cart = await getCartByUserId(currentUser.userID);
        if (!cart) {
            const cartId = await createCart(currentUser.userID);
            cart = await getCartByUserId(currentUser.userID);
        }
        
        // Add item to cart via backend
        await addItemToCart(cart.cartID, scarfID, quantity);
        
        // Notify user
        alert('Item added to cart successfully!');
        
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = parseInt(cartCount.textContent) + quantity;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart.');
    }
}

// Function to render image gallery
function initializeGallery(images) {
    let currentImageIndex = 0;
    const mainImage = document.getElementById('product-main-image');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    function updateImage() {
        mainImage.src = images[currentImageIndex].src;
        mainImage.alt = images[currentImageIndex].alt;
        prevButton.disabled = currentImageIndex === 0;
        nextButton.disabled = currentImageIndex === images.length - 1;
    }
    
    updateImage();
    
    nextButton.addEventListener('click', () => {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            updateImage();
        }
    });
    
    prevButton.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateImage();
        }
    });
}

// Function to initialize quantity controls
function initializeQuantityControls(product) {
    const quantityInput = document.querySelector('#quantity');
    const decreaseBtn = document.querySelector('.decrease');
    const increaseBtn = document.querySelector('.increase');

    function updatePrice() {
        const quantity = parseInt(quantityInput.value);
        const total = product.price * quantity;
        document.querySelector('.price').textContent = `${total.toFixed(2)} EGP`;
    }

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updatePrice();
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
            updatePrice();
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 99) value = 99;
        quantityInput.value = value;
        updatePrice();
    });
}

// Function to initialize tabs
function initializeTabs() {
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');

    tabTriggers.forEach((trigger, index) => {
        const content = tabContents[index];
        content.style.display = 'none';
        
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
        });
    });
}
