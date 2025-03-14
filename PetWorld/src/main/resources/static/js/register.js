// Avatar preview functionality
document.getElementById('avatar').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('avatarPreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        }
    });
});

// Form submission
document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Password validation
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    var fileInput = document.getElementById('avatar');
    var file = fileInput.files[0];
    var avatarUrl = "/images/default-avatar.png"; // Default if no image

    // Upload image if available
    if (file) {
        var formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const responseData = await response.json();
                avatarUrl = responseData.result;
            } else {
                alert('File upload failed, using default avatar.');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }

    // Send registration data
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        password: password,
        role: document.getElementById('role').value,
        avatar: avatarUrl
    };

    console.log(userData);

    sessionStorage.setItem('userData', JSON.stringify(userData));
    window.location.href = '/auth/verify';
});