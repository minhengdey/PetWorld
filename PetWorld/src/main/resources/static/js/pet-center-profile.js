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
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

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