// scripts/order.js

import { createOrder, getOrdersByUserId, getOrderDetails, updateOrderStatus, deleteOrder, addItemToOrder, deleteOrderItem } from '../linking/orderLink.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize Order Page
    try {
        const orders = await getOrdersByUserId(currentUser.userID);
        renderOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
});

// Function to render orders on the page
function renderOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>You have no orders.</p>';
        return;
    }
    
    ordersContainer.innerHTML = orders.map(order => `
        <div class="order">
            <h3>Order #${order.orderID}</h3>
            <p>Date: ${new Date(order.orderDate).toLocaleString()}</p>
            <p>Status: ${order.status}</p>
            <p>Total: ${order.totalCost.toFixed(2)} EGP</p>
            <button onclick="viewOrderDetails(${order.orderID})">View Details</button>
            <button onclick="cancelOrder(${order.orderID})">Cancel Order</button>
        </div>
    `).join('');
}

// Function to view order details
async function viewOrderDetails(orderID) {
    try {
        const orderDetails = await getOrderDetails(orderID);
        renderOrderDetails(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        alert('Failed to fetch order details.');
    }
}

// Function to render order details in a modal or separate section
function renderOrderDetails(orderDetails) {
    // Implement modal or separate section to display order details
    // For simplicity, using alert here
    alert(`Order #${orderDetails.orderID} - Status: ${orderDetails.status}\nTotal: ${orderDetails.totalCost.toFixed(2)} EGP`);
}

// Function to cancel an order
async function cancelOrder(orderID) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
        await updateOrderStatus(orderID, 'Cancelled');
        alert('Order cancelled successfully!');
        // Re-fetch and render orders
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const orders = await getOrdersByUserId(currentUser.userID);
        renderOrders(orders);
    } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order.');
    }
}

// Expose functions globally
window.viewOrderDetails = viewOrderDetails;
window.cancelOrder = cancelOrder;
