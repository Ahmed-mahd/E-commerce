// scripts/checkout.js

import { createOrder } from '../linking/orderLink.js';
import { getCartByUserId, getUserSpecificItems, clearUserCart } from '../linking/cartLink.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    
    try {
        const cart = await getCartByUserId(currentUser.userID);
        if (!cart) {
            alert('Your cart is empty.');
            window.location.href = 'flora-section-catagory.html';
            return;
        }
        
        const cartItems = await getUserSpecificItems(currentUser.userID);
        renderOrderSummary(cart, cartItems);
        
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleCheckout(cart, cartItems);
        });
    } catch (error) {
        console.error('Error during checkout initialization:', error);
    }
});

// Function to render order summary
function renderOrderSummary(cart, cartItems) {
    const orderSummary = document.getElementById('order-summary');
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discount = cart.discount || 0;
    const totalCost = cart.totalCost || (subtotal - discount);
    
    orderSummary.innerHTML = `
        <ul>
            ${cartItems.map(item => `
                <li>${item.name} x ${item.quantity} - ${ (item.price * item.quantity).toFixed(2) } EGP</li>
            `).join('')}
        </ul>
        <p>Subtotal: ${subtotal.toFixed(2)} EGP</p>
        <p>Discount: ${discount.toFixed(2)} EGP</p>
        <p>Total: ${totalCost.toFixed(2)} EGP</p>
    `;
}

// Function to handle checkout process
async function handleCheckout(cart, cartItems) {
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;
    const paymentType = document.getElementById('paymentType').value;
    
    if (!address || !city || !zipCode || !paymentType) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const orderData = {
        userID: cart.userID,
        orderDate: new Date().toISOString(),
        totalCost: cart.totalCost,
        status: 'Pending', // Initial status
        shippingInfo: {
            address,
            city,
            state,
            zipCode
        },
        paymentInfo: {
            paymentType,
            paymentStatus: 'Pending' // Initial payment status
        },
        items: cartItems.map(item => ({
            scarfID: item.scarfID,
            quantity: item.quantity,
            price: item.price
        }))
    };
    
    try {
        // Create the order
        const orderResponse = await createOrder(orderData);
        
        // Clear the user's cart
        await clearUserCart(cart.userID);
        
        alert('Order placed successfully!');
        window.location.href = 'orders.html'; // Redirect to orders page
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Failed to place order.');
    }
}
