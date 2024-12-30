// scripts/cart-drawer.js

import { getCartByUserId, getUserSpecificItems, deleteCartItem, updateCartItemQuantity as updateCartItemQuantityAPI } from '../linking/cartLink.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartToggleBtn = document.querySelector('.btn-cart');
    const closeBtn = document.querySelector('.cart-close');
    const cartItemsContainer = document.querySelector('.cart-items');
    const viewCartBtn = document.querySelector('.view-cart-btn');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        cartToggleBtn.style.display = 'none'; // Hide cart button if not logged in
        return;
    }
    
    cartToggleBtn.addEventListener('click', async () => {
        toggleCart();
        await renderCart();
    });
    
    closeBtn.addEventListener('click', toggleCart);
    viewCartBtn.addEventListener('click', () => window.location.href = 'cart.html');
    
    // Render cart when user logs in
    window.addEventListener('userLoggedIn', async () => {
        await renderCart();
    });
    
    // Render cart when user logs out
    window.addEventListener('userLoggedOut', () => {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty!</p>';
    });
    
    // Initial render
    await renderCart();
});

// Toggle the visibility of the cart drawer
function toggleCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    cartDrawer.classList.toggle('active');
}

// Fetch and render cart items in the drawer
async function renderCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    try {
        const cart = await getCartByUserId(currentUser.userID);
        if (!cart) {
            document.querySelector('.cart-items').innerHTML = '<p class="empty-cart-message">Your cart is empty!</p>';
            return;
        }
        
        const cartItems = await getUserSpecificItems(currentUser.userID);
        if (cartItems.length === 0) {
            document.querySelector('.cart-items').innerHTML = '<p class="empty-cart-message">Your cart is empty!</p>';
            return;
        }
        
        document.querySelector('.cart-items').innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.cartItemID}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: ${item.price.toFixed(2)} EGP</p>
                    <div class="quantity-controls">
                        <button class="decrease-qty" aria-label="Decrease quantity" onclick="decreaseQuantity(${item.cartItemID}, ${item.quantity})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-qty" aria-label="Increase quantity" onclick="increaseQuantity(${item.cartItemID}, ${item.quantity})">+</button>
                    </div>
                    <button class="remove-item" aria-label="Remove item" onclick="removeCartItem(${item.cartItemID})">Remove</button>
                </div>
            </div>
        `).join('');
        
        // Update cart count
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    } catch (error) {
        console.error('Error rendering cart:', error);
    }
}

// Global functions to handle cart item interactions
async function decreaseQuantity(cartItemId, currentQuantity) {
    if (currentQuantity <= 1) {
        await removeCartItem(cartItemId);
    } else {
        await updateCartItemQuantityAPI(cartItemId, currentQuantity - 1);
    }
    await renderCart();
}

async function increaseQuantity(cartItemId, currentQuantity) {
    await updateCartItemQuantityAPI(cartItemId, currentQuantity + 1);
    await renderCart();
}

async function removeCartItem(cartItemId) {
    await deleteCartItem(cartItemId);
    await renderCart();
}

// Expose functions globally
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.removeCartItem = removeCartItem;
