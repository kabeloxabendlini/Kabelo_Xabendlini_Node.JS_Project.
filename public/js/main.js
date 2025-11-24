// public/js/main.js

// Example: DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Browser JS loaded');

    // Example: Highlight input fields on focus
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#4CAF50'; // green border on focus
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = ''; // reset border
        });
    });

    // Example: Flash messages auto-hide after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000);
    });

    // Example: Simple client-side form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const username = loginForm.querySelector('input[name="username"]').value.trim();
            const password = loginForm.querySelector('input[name="password"]').value.trim();

            if (!username || !password) {
                e.preventDefault(); // stop form submission
                alert('Please fill in both username and password.');
            }
        });
    }
});
