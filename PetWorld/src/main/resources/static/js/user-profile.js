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
                document.getElementById('name').textContent = data.result.name || 'Unknown';
                document.getElementById('avatar').src = data.result.avatar || '/images/default-avatar.png';
                document.getElementById('role').textContent = data.result.role || 'Unknown Role';
                document.getElementById('profile-name').textContent = data.result.name || 'Unknown';
                document.getElementById('profile-address').textContent = data.result.address || 'Unknown';
                document.getElementById('profile-email').textContent = data.result.email || 'Unknown';
                document.getElementById('profile-description').textContent = data.result.description || '';
                document.getElementById('profile-avatar').src = data.result.avatar || '/images/default-avatar.png';

                // Show menu based on role
                const role = data.result.role;
                hideAllMenus();
                showMenuForRole(role);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    function hideAllMenus() {
        document.getElementById('petOwnerMenu').style.display = 'none';
        document.getElementById('petMenu').style.display = 'none';
        document.getElementById('doctorMenu').style.display = 'none';
        document.getElementById('petCenterMenu').style.display = 'none';
    }

    function showMenuForRole(role) {
        const menuMap = {
            'PET_OWNER': 'petOwnerMenu',
            'PET': 'petMenu',
            'PET_CARE_SERVICES': 'doctorMenu',
            'PET_CENTER': 'petCenterMenu'
        };

        const menuId = menuMap[role];
        if (menuId) {
            document.getElementById(menuId).style.display = 'block';
        }
    }
});