document.addEventListener('DOMContentLoaded', function() {
    let id = null; // Khai báo biến id để sử dụng sau
    fetch('/api/auth/myInfo', {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
    })
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data);
            if (data.code === 1000) {
                id = data.result.id;
                console.log("User ID:", id); // Kiểm tra ID lấy được

                document.getElementById('name').value = data.result.name || '';
                document.getElementById('email').value = data.result.email || '';
                document.getElementById('phone').value = data.result.phone || '';
                document.getElementById('address').value = data.result.address || '';
                document.getElementById('description').value = data.result.description || '';
                document.getElementById('avatarUrl').value = data.result.avatar;
            } else {
                console.error("API trả về lỗi:", data);
            }
        })
        .catch(error => {
            console.error("Lỗi khi fetch dữ liệu:", error);
        });

    // Cho phép chỉnh sửa khi click vào input
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('click', function() {
            this.removeAttribute('readonly');
            this.style.cursor = 'text';
        });
    });

    // Xử lý khi submit form chỉnh sửa profile
    const form = document.getElementById('edit-profile-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            if (!id) {
                console.error("Không có ID người dùng, không thể cập nhật profile!");
                return;
            }

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

            // Gửi thông tin đã cập nhật
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const description = document.getElementById('description').value;
            const avatar = document.getElementById('avatarUrl').value;

            try {
                const updateResponse = await fetch(`/pet-center/${id}`, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, address, phone, email, password, description, avatar })
                });

                if (updateResponse.ok) {
                    const data = await updateResponse.json();
                    console.log("Cập nhật thành công:", data);
                    window.location.href = '/pet-center-profile'; // Chuyển hướng sau khi cập nhật
                } else {
                    console.error("Lỗi khi cập nhật thông tin:", await updateResponse.text());
                    alert('Cập nhật thất bại!');
                }
            } catch (error) {
                console.error('Lỗi khi gửi request:', error);
            }
        });
    } else {
        console.error("Form chỉnh sửa không tồn tại!");
    }
});

document.getElementById('avatar').addEventListener('change', function(e) {
    var file = e.target.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imgElement = document.getElementById('avatarPreview');
            imgElement.src = event.target.result;
            imgElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
