// contact.js

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const newsletter = document.getElementById('newsletter').checked;

        // Here you would typically send this data to your server
        console.log('Form submitted:', {
            firstName,
            lastName,
            email,
            message,
            newsletter
        });

        // Clear form
        contactForm.reset();

        // Show success message (you can customize this)
        alert('Thank you for your message. We will get back to you soon!');
    });

    // Add floating label effect
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Check initial state
        if (input.value) {
            input.classList.add('has-value');
        }

        // Handle input changes
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status and update UI
    function updateAuthUI() {
        const userOptions = document.querySelector('.user-options');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            userOptions.innerHTML = `
                <span>${currentUser.name}</span>
                <a href="#" id="logoutBtn" style="margin-left: 10px;">Logout</a>
            `;

            // Pre-fill form with user data if available
            if (document.getElementById('firstName')) {
                document.getElementById('firstName').value = currentUser.firstName || '';
                document.getElementById('lastName').value = currentUser.lastName || '';
                document.getElementById('email').value = currentUser.email || '';
                updateFloatingLabels();
            }

            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        } else {
            userOptions.innerHTML = `
                <a href="login.html" class="login-btn">Login</a>
                <span>/</span>
                <a href="register.html" class="register-btn">Register</a>
            `;
        }
    }

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = localStorage.getItem('currentUser');
        
        if (!currentUser) {
            // Show login modal if user is not authenticated
            showLoginModal();
            return;
        }
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const newsletter = document.getElementById('newsletter').checked;

        // Here you would typically send this data to your server
        console.log('Form submitted:', {
            firstName,
            lastName,
            email,
            message,
            newsletter
        });

        // Clear form
        contactForm.reset();
        updateFloatingLabels();

        // Show success message
        showSuccessModal('Thank you for your message. We will get back to you soon!');
    });

    function showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <h2>Please log in to submit</h2>
                <p>You need to be logged in to send us a message.</p>
                <div class="auth-modal-buttons">
                    <a href="login.html" class="modal-btn login">Login</a>
                    <a href="register.html" class="modal-btn register">Register</a>
                </div>
                <button class="modal-close">×</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function showSuccessModal(message) {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <h2>Success!</h2>
                <p>${message}</p>
                <button class="modal-close">OK</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Add floating label effect
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    function updateFloatingLabels() {
        formInputs.forEach(input => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    }

    formInputs.forEach(input => {
        // Check initial state
        if (input.value) {
            input.classList.add('has-value');
        }

        // Handle input changes
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Initial setup
    updateAuthUI();
});