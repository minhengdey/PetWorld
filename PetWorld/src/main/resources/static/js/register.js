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
document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn reload trang

    var fileInput = document.getElementById('avatar');
    var file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    var formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const responseData = await response.json();
            const avatarUrl = responseData.result;

            var avatarUrlInput = document.getElementById('avatarUrl');
            if (!avatarUrlInput) {
                console.error("Input hidden avatarUrl không tồn tại!");
                return;
            }

            avatarUrlInput.value = avatarUrl; // Lưu URL ảnh vào input hidden

            // 🚨 **Thiếu đoạn này**: Submit form sau khi cập nhật avatar thành công
            event.target.submit();
        } else {
            alert('File upload failed');
        }
    } catch (error) {
        console.error('Upload failed:', error);
    }
});