document.addEventListener('DOMContentLoaded', function() {
    // Fetch user info
    fetch('/api/auth/myInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {

                const user = data.result;

                // Update profile information
                document.getElementById('center-name').textContent = user.name;
                document.getElementById('center-avatar').src = user.avatar || '/images/default-center.jpg';
                document.getElementById('center-role').textContent = user.role;
                document.getElementById('center-email').textContent = user.email;
                document.getElementById('center-phone').textContent = user.phone;
                document.getElementById('center-address').textContent = user.address;
                document.getElementById('center-description').textContent = user.description;

            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});