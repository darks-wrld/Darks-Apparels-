document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                window.location.href = 'index.html'; // Redirect to admin panel on success
            } else {
                const data = await response.json();
                errorMessage.textContent = data.message || 'Login failed.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
});
