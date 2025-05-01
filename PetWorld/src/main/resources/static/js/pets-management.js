document.addEventListener('DOMContentLoaded', function() {
    const addPetBtn = document.getElementById('add-pet-btn');
    addPetBtn.addEventListener('click', () => {
        window.location.href = '/add-pet';
    });

    // Pagination state
    let currentPage = 0;
    const pageSize = 3;
    let totalPages = 0;
    let currentFilter = 'all';
    let searchQuery = '';
    let totalAdoptedCount = 0;
    let totalAvailableCount = 0;

    // Fetch pets data with pagination
    function fetchPets(page) {
        return fetch(`/pet/my-pets?page=${page}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                const pets = data.result.content;
                totalPages = data.result.totalPages;

                // Update total statistics
                document.getElementById('total-pets').textContent = data.result.totalElements.toString();
                
                // Count adopted and available pets for current page
                const adoptedCount = pets.filter(pet => pet.isAdopted).length;
                const availableCount = pets.filter(pet => !pet.isAdopted).length;

                // If we're on the first page, reset the total counts
                if (page === 0) {
                    totalAdoptedCount = 0;
                    totalAvailableCount = 0;
                }

                // Add to total counts
                totalAdoptedCount += adoptedCount;
                totalAvailableCount += availableCount;

                // Update the statistics display
                document.getElementById('adopted-pets').textContent = totalAdoptedCount.toString();
                document.getElementById('available-pets').textContent = totalAvailableCount.toString();

                // Update pets grid
                updatePetsGrid(pets);
                updatePagination();
            }
        })
        .catch(error => {
            console.error("Error fetching pets data:", error);
        });
    }

    function updatePetsGrid(pets) {
        const petsGrid = document.getElementById('pets-grid');
        petsGrid.innerHTML = '';
        
        // Apply filter
        let filteredPets = pets;
        if (currentFilter === 'available') {
            filteredPets = pets.filter(pet => !pet.isAdopted);
        } else if (currentFilter === 'adopted') {
            filteredPets = pets.filter(pet => pet.isAdopted);
        }
        
        // Apply search
        if (searchQuery) {
            filteredPets = filteredPets.filter(pet => 
                pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filteredPets.forEach(pet => {
            petsGrid.appendChild(createPetCard(pet, pet.isAdopted));
        });
    }

    function updatePagination() {
        document.getElementById('pageInfo').textContent = `Page ${currentPage + 1} of ${totalPages}`;
        document.getElementById('prevPage').disabled = currentPage === 0;
        document.getElementById('nextPage').disabled = currentPage >= totalPages - 1;
    }

    // Event listeners for pagination buttons
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            fetchPets(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            fetchPets(currentPage);
        }
    });

    // Filter buttons event listeners
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update current filter
            currentFilter = button.dataset.filter;
            // Refresh pets grid
            fetchPets(currentPage);
        });
    });

    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value;
            fetchPets(currentPage);
        }, 300);
    });

    // Initial fetch
    fetchPets(currentPage);

    function createPetCard(pet, isAdopted) {
        const div = document.createElement('div');
        div.className = 'pet-card';
        div.onclick = () => showPetDetails(pet);
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
                    <button class="action-btn delete" onclick="event.stopPropagation()">
                        <span class="material-symbols-outlined">delete</span>
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