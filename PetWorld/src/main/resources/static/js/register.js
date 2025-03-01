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

document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    var fileInput = document.getElementById('avatar');
    var file = fileInput.files[0];
    var avatarUrl = "/images/default-avatar.png"; // Mặc định nếu không có ảnh

    // Nếu có ảnh thì upload trước
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

    // Gửi thông tin đăng ký
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        avatar: avatarUrl
    };

    console.log(userData)

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json());

        if (response.code === 1000) {
            alert('Registration successful!');
            window.location.href = "/auth/log-in"; // Chuyển hướng sau khi đăng ký thành công
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
});