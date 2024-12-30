// scripts/cart.js

import {
    createCart,
    getCartByUserId,
    addItemToCart,
    updateCartItem,
    deleteCartItem,
    getUserSpecificItems
} from '../linking/cartLink.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
        // Redirect to login if not authenticated
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
        
        // Fetch cart items
        const cartItems = await getUserSpecificItems(currentUser.userID);
        renderCart(cart, cartItems);
        
        // Handle Add to Cart actions elsewhere in the site
        window.addEventListener('addToCart', async (e) => {
            const { productId, quantity } = e.detail;
            await addItemToCart(cart.cartID, productId, quantity);
            const updatedCartItems = await getUserSpecificItems(currentUser.userID);
            renderCart(cart, updatedCartItems);
        });
        
    } catch (error) {
        console.error('Error initializing cart:', error);
    }
});

// Function to render cart on the page
function renderCart(cart, cartItems) {
    const cartContent = document.getElementById('cart-content');
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="flora-section-catagory.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discount = cart.discount || 0;
    const totalCost = cart.totalCost || (subtotal - discount);
    
    cartContent.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${cartItems.map(item => `
                    <tr data-cart-item-id="${item.cartItemID}">
                        <td>
                            <div class="cart-product">
                                <img src="${item.image}" alt="${item.name}">
                                <div>
                                    <h3>${item.name}</h3>
                                </div>
                            </div>
                        </td>
                        <td class="product-price">${item.price.toFixed(2)} EGP</td>
                        <td>
                            <div class="quantity-wrapper">
                                <button type="button" class="decrease" onclick="updateCartItemQuantity(${item.cartItemID}, ${item.quantity - 1})">-</button>
                                <input type="number" 
                                       class="quantity-input" 
                                       value="${item.quantity}" 
                                       min="1"
                                       onchange="updateCartItemQuantity(${item.cartItemID}, this.value)">
                                <button type="button" class="increase" onclick="updateCartItemQuantity(${item.cartItemID}, ${item.quantity + 1})">+</button>
                            </div>
                        </td>
                        <td class="item-total">${(item.price * item.quantity).toFixed(2)} EGP</td>
                        <td>
                            <button class="remove-btn" onclick="removeItem(${item.cartItemID})">Remove</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span class="subtotal">${subtotal.toFixed(2)} EGP</span>
            </div>
            <div class="summary-row">
                <span>Discount</span>
                <span class="discount">${discount.toFixed(2)} EGP</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span class="total">${totalCost.toFixed(2)} EGP</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
        </div>
    `;
    
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Global functions to update and remove items
async function updateCartItemQuantity(cartItemId, newQuantity) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
        await updateCartItem(cartItemId, newQuantity);
        // Re-fetch and render cart
        const cart = await getCartByUserId(currentUser.userID);
        const cartItems = await getUserSpecificItems(currentUser.userID);
        renderCart(cart, cartItems);
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
}

async function removeItem(cartItemId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
        await deleteCartItem(cartItemId);
        // Re-fetch and render cart
        const cart = await getCartByUserId(currentUser.userID);
        const cartItems = await getUserSpecificItems(currentUser.userID);
        renderCart(cart, cartItems);
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

async function proceedToCheckout() {
    // Redirect to checkout page or initiate order creation
    window.location.href = 'checkout.html';
}

// Expose functions globally for inline event handlers
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeItem = removeItem;
window.proceedToCheckout = proceedToCheckout;
