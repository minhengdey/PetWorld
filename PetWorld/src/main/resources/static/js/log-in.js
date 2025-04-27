// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        }
    });
});

// Login form submission
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const rememberMe = document.getElementById('remember').checked;

    try {
        const response = await fetch('/api/auth/log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                role,
                rememberMe
            })
        });

        if (response.ok) {
            if (role === "ADMIN") {
                window.location.href = '/admin-dashboard';
            } else {
                window.location.href = '/home';
            }
        } else {
            const data = await response.json();
            alert(data.message || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login failed:', error);
        alert('Connection error. Please try again later.');
    }
});