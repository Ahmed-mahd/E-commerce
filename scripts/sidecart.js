// sidecart.js

document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('close-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItems = document.getElementById('cart-items');

    // Open and close cart
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        renderSidebarCart();
    });

    closeBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    function createCartItemElement(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-color">Color: ${item.color}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)}EGP</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <input type="text" value="${item.quantity}" class="quantity-input" readonly>
                        <button class="quantity-btn plus">+</button>
                        <button class="delete-btn">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSidebarCart() {
        const items = cartManager.getCartItems();
        
        if (items.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartItems.classList.add('empty');
            document.querySelector('.cart-footer').style.display = 'none';
        } else {
            cartItems.innerHTML = items.map(createCartItemElement).join('');
            cartItems.classList.remove('empty');
            document.querySelector('.cart-footer').style.display = 'block';
            document.getElementById('subtotal-amount').textContent = 
                `${cartManager.calculateTotal().toFixed(2)}EGP`;
        }

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    function handleQuantityChange(e) {
        const itemElement = e.target.closest('.cart-item');
        const itemId = parseInt(itemElement.dataset.id);
        const currentQuantity = parseInt(itemElement.querySelector('.quantity-input').value);
        
        if (e.target.classList.contains('plus')) {
            cartManager.updateQuantity(itemId, currentQuantity + 1);
        } else if (e.target.classList.contains('minus')) {
            cartManager.updateQuantity(itemId, currentQuantity - 1);
        }
    }

    function handleDelete(e) {
        const itemElement = e.target.closest('.cart-item');
        const itemId = parseInt(itemElement.dataset.id);
        cartManager.removeItem(itemId);
    }

    // Listen for cart updates
    document.addEventListener('cartUpdated', () => {
        renderSidebarCart();
    });

    // Make the View Cart button work
    document.querySelector('.view-cart-btn').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Initial render
    renderSidebarCart();
});