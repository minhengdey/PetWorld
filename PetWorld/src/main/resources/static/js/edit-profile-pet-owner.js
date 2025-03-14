document.addEventListener('DOMContentLoaded', function() {

    let userId = null;
    // Handle password visibility toggling
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
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

    // Avatar preview functionality
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatarPreview');

    avatarInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
            }

            reader.readAsDataURL(this.files[0]);
        }
    });

    // Load user profile data
    loadUserProfile();

    // Form submission
    const form = document.getElementById('edit-profile-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var fileInput = document.getElementById('avatar');
        var file = fileInput.files[0];

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
                    const avatar = responseData.result;

                    var avatarUrlInput = document.getElementById('avatarUrl');
                    avatarUrlInput.value = avatar; // Lưu URL ảnh vào input hidden
                } else {
                    alert('File upload failed');
                }
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }
        updateProfile();
    });
});

function loadUserProfile() {
    fetch('/api/auth/myInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
        .then(data => {
            userId = data.result.id;
            // Populate form fields with user data
            document.getElementById('name').value = data.result.name || '';
            document.getElementById('email').value = data.result.email || '';
            document.getElementById('phone').value = data.result.phone || '';
            document.getElementById('address').value = data.result.address || '';
            document.getElementById('description').value = data.result.description || '';

            console.log(data)
            // Set avatar preview if available
            if (data.result.avatar) {
                document.getElementById('avatarPreview').src = data.result.avatar;
                document.getElementById('avatarUrl').value = data.result.avatar;
            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            alert('Failed to load profile data. Please try again later.');
        });
}

function updateProfile() {
    if (userId) {
        const form = document.getElementById('edit-profile-form');

        // Add the data that's not directly in form fields
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let currentPassword = document.getElementById('currentPassword').value;

        // Password validation
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }

            if (!currentPassword) {
                alert('Current password is required to change password');
                return;
            }

            currentPassword = newPassword;
        }

        // Send update request
        fetch(`/pet-owner/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                password: currentPassword,
                description: document.getElementById('description').value,
                avatar: document.getElementById('avatarUrl').value
            })
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Current password is incorrect');
                    }
                    throw new Error('Failed to update profile');
                }
                return response.json();
            })
            .then(data => {
                alert('Profile updated successfully!');

                // Redirect to profile page after a short delay
                setTimeout(() => {
                    window.location.href = '/user-profile';
                }, 2000);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            });
    }
}