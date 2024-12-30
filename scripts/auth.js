// scripts/auth.js

import { registerUser, loginUser, getUserById } from '../linking/authLink.js';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await loginUser({ email, password });
        // Assuming the backend returns a JWT token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Dispatch login event
        window.dispatchEvent(new CustomEvent('userLoggedIn', {
            detail: { userId: response.user.userID }
        }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
});

// Registration Form Handler (Assuming you have a registration form)
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await registerUser({ userName, email, password });
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message);
    }
});

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('authToken');
    const loginButton = document.querySelector('.btn-login');
    
    if (token) {
        try {
            const user = await getUserById(JSON.parse(localStorage.getItem('currentUser')).userID);
            // Update UI to show user info
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <span class="user-name">${user.userName}</span>
                <button id="logoutBtn" class="btn btn-logout">Logout</button>
            `;
            
            // Replace login button with user menu
            loginButton.replaceWith(userMenu);
            
            // Add logout functionality
            document.getElementById('logoutBtn').addEventListener('click', function() {
                logout();
            });
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            logout();
        }
    }
});

// Logout Function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    window.location.reload();
}

// Handle userLoggedIn event to update UI dynamically
window.addEventListener('userLoggedIn', async function(e) {
    const userId = e.detail.userId;
    try {
        const user = await getUserById(userId);
        const loginButton = document.querySelector('.btn-login');
        
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <span class="user-name">${user.userName}</span>
            <button id="logoutBtn" class="btn btn-logout">Logout</button>
        `;
        
        // Replace login button with user menu
        loginButton.replaceWith(userMenu);
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            logout();
        });
    } catch (error) {
        console.error('Failed to fetch user details:', error);
    }
});
    