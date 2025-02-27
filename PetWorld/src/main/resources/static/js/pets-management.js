document.addEventListener('DOMContentLoaded', function() {
    const addPetBtn = document.getElementById('add-pet-btn');
    addPetBtn.addEventListener('click', () => {
        window.location.href = '/add-pet';
    });
    // Fetch pets data
    fetch('/pet/my-pets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                const pets = data.result;

                let adoptedPets = [];
                let availablePets = [];

                for (let pet of pets) {
                    if (pet.isAdopted) {
                        adoptedPets.push(pet);
                    } else {
                        availablePets.push(pet);
                    }
                }
                // Update statistics
                document.getElementById('total-pets').textContent = pets.length.toString();
                document.getElementById('adopted-pets').textContent = adoptedPets.length.toString();
                document.getElementById('available-pets').textContent = availablePets.length.toString();

                // Load available pets
                const availablePetsGrid = document.getElementById('available-pets-grid');
                availablePets.forEach(pet => {
                    availablePetsGrid.appendChild(createPetCard(pet, false));
                });
                console.log(availablePets);
                // Load adopted pets
                const adoptedPetsGrid = document.getElementById('adopted-pets-grid');
                adoptedPets.forEach(pet => {
                    adoptedPetsGrid.appendChild(createPetCard(pet, true));
                });
            }
        })
        .catch(error => {
            console.error("Error fetching pets data:", error);
        });
    function createPetCard(pet, isAdopted) {
        const div = document.createElement('div');
        div.className = 'pet-card';
        div.onclick = () => showPetDetails(pet);  // Add click handler
        div.innerHTML = `
            <div class="pet-image">
                <img src="${pet.avatar || '/images/default-pet.jpg'}" alt="${pet.name}">
                <span class="status-badge ${isAdopted ? 'adopted' : 'available'}">
                    ${isAdopted ? 'Adopted' : 'Available'}
                </span>
            </div>
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <div class="pet-details">
                    <span class="detail">
                        <span class="material-symbols-outlined">pets</span>
                        ${pet.breed}
                    </span>
                    <span class="detail">
                        <span class="material-symbols-outlined">cake</span>
                        ${pet.dob}
                    </span>
                </div>
                <div class="pet-actions">
                    ${!isAdopted ? `
                        <button class="action-btn edit" onclick="event.stopPropagation()">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    ` : ''}
                    <button class="action-btn view" onclick="event.stopPropagation()">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    // Add modal functionality
    const modal = document.getElementById('petDetailsModal');
    const closeModal = document.getElementById('closePetDetailsModal');

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    function showPetDetails(pet) {
        document.getElementById('modalPetImage').src = pet.avatar || '/images/default-pet.jpg';
        document.getElementById('modalPetName').textContent = pet.name;
        document.getElementById('modalPetBreed').textContent = pet.breed;
        document.getElementById('modalPetDOB').textContent = pet.dob;
        document.getElementById('modalPetGender').textContent = pet.gender || 'Not specified';
        document.getElementById('modalPetStatus').textContent = pet.isAdopted ? 'Adopted' : 'Available';

        // Hiển thị danh sách ảnh gallery
        const galleryContainer = document.getElementById("petGallery");
        galleryContainer.innerHTML = ""; // Xóa nội dung cũ trước khi hiển thị mới

        if (pet.gallery && pet.gallery.length > 0) {
            pet.gallery.forEach(imageUrl => {
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = "Pet Photo";
                imgElement.classList.add("pet-gallery-img"); // Thêm class CSS nếu cần

                galleryContainer.appendChild(imgElement);
            });
        } else {
            galleryContainer.innerHTML = "<p>No gallery images available</p>";
        }

        const adopterInfo = document.getElementById('adopterInfo');
        if (pet.isAdopted && pet.adoption.petOwner) {
            adopterInfo.style.display = 'block';
            document.getElementById('modalAdopterName').textContent = pet.adoption.petOwner.name;
            document.getElementById('modalAdopterContact').textContent = pet.adoption.petOwner.phone;
            document.getElementById('modalAdoptionDate').textContent = new Date(pet.adoption.adoptionDate).toLocaleDateString();
        } else {
            adopterInfo.style.display = 'none';
        }

        modal.style.display = "block";
    }

    // Make showPetDetails available globally
    window.showPetDetails = showPetDetails;
});