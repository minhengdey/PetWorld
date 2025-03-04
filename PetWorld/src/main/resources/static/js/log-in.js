document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn reload trang

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('/api/auth/log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        if (response.ok) {
            window.location.href = '/home';
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
});