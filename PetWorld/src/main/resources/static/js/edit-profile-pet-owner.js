document.addEventListener('DOMContentLoaded', async function() {
    let userId = null;
    try {
        const response = await fetch('/api/auth/myInfo');
        const data = await response.json();
        if (data.code === 1000) {
            userId = data.result.id;
            document.getElementById('name').value = data.result.name || '';
            document.getElementById('email').value = data.result.email || '';
            document.getElementById('phone').value = data.result.phone || '';
            document.getElementById('address').value = data.result.address || '';
            document.getElementById('description').value = data.result.description || '';
            document.getElementById('avatarUrl').value = data.result.avatar;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }

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

    document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!userId) {
            console.error("User ID not found!");
            return;
        }

        const formData = new FormData();
        const file = document.getElementById('avatar').files[0];
        if (file) {
            formData.append('file', file);
            try {
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    document.getElementById('avatarUrl').value = uploadData.result;
                } else {
                    alert('File upload failed');
                    return;
                }
            } catch (error) {
                console.error('Upload failed:', error);
                return;
            }
        }

        const updatedUser = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            description: document.getElementById('description').value,
            password: document.getElementById('password').value,
            avatar: document.getElementById('avatarUrl').value
        };

        try {
            const response = await fetch(`/pet-owner/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
            if (response.ok) {
                window.location.href = '/user-profile';
            } else {
                alert('Profile update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });
});