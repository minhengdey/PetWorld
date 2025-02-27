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

                const pet = data.result;

                // Update profile information
                document.getElementById('pet-name').textContent = pet.name;
                document.getElementById('pet-avatar').src = pet.avatar || '/images/default-pet.jpg';
                document.getElementById('pet-dob').textContent = new Date(pet.dob).toLocaleDateString();
                document.getElementById('pet-gender').textContent = pet.gender;
                document.getElementById('pet-species').textContent = pet.species;
                document.getElementById('pet-breed').textContent = pet.breed;
                document.getElementById('pet-weight').textContent = `${pet.weight} kg`;
                document.getElementById('pet-color').textContent = pet.color;

                // Update badges
                document.getElementById('neutered-badge').style.display = pet.isNeutered ? 'flex' : 'none';
                document.getElementById('vaccinated-badge').style.display = pet.isVaccinated ? 'flex' : 'none';

                // Load gallery
                const galleryContainer = document.getElementById('pet-gallery');
                if (pet.gallery && pet.gallery.length > 0) {
                    pet.gallery.forEach(imageUrl => {
                        const imgDiv = document.createElement('div');
                        imgDiv.className = 'gallery-item';
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = 'Pet gallery image';
                        imgDiv.appendChild(img);
                        galleryContainer.appendChild(imgDiv);
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