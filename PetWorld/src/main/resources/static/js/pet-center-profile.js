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

                const center = data.result;

                // Update profile information
                document.getElementById('center-name').textContent = center.name;
                document.getElementById('center-avatar').src = center.avatar || '/images/default-center.jpg';
                document.getElementById('center-role').textContent = center.role;
                document.getElementById('center-email').textContent = center.email;
                document.getElementById('center-phone').textContent = center.phone;
                document.getElementById('center-address').textContent = center.address;
                document.getElementById('center-description').textContent = center.description;

                // Update pets count
                const petsCount = center.petsAvailable ? center.petsAvailable.length : 0;
                document.getElementById('pets-count').textContent = `${petsCount} pets`;

                // Load pets grid
                const petsGrid = document.getElementById('pets-grid');
                if (center.petsAvailable && center.petsAvailable.length > 0) {
                    center.petsAvailable.forEach(pet => {
                        const petCard = createPetCard(pet);
                        petsGrid.appendChild(petCard);
                    });
                }

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

    function createPetCard(pet) {
        const div = document.createElement('div');
        div.className = 'pet-card';
        div.innerHTML = `
            <img src="${pet.avatar || '/images/default-pet.jpg'}" alt="${pet.name}">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p>${pet.breed}</p>
            </div>
        `;
        return div;
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const switchToOwner = document.getElementById('switch-to-owner');
    switchToOwner.onclick = async function(event) {
        try {
            const response = await fetch(`/api/auth/switch-to-owner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                window.location.href = '/home';
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
})