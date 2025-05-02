document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const petsContainer = document.getElementById('petsContainer');
    const avatarPreview = document.getElementById('avatarPreview');
    const petDetailsModal = document.getElementById('petDetailsModal');
    const closePetDetailsModal = document.getElementById('closePetDetailsModal');

    // Pagination state
    const paginationState = {
        available: { page: 0, size: 8, total: 0 },
        requested: { page: 0, size: 8, total: 0 },
        accepted: { page: 0, size: 8, total: 0 }
    };

    fetchAllPets();

    function fetchAllPets() {
        // Fetch available pets with pagination
        fetch(`/pet/pets-pc?page=${paginationState.available.page}&size=${paginationState.available.size}`, { 
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' } 
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    const pets = data.result.content;
                    paginationState.available.total = data.result.totalElements;
                    document.querySelector('[data-tab="available"] .tab-badge').textContent = paginationState.available.total;
                    renderPets('available', pets);
                    updatePaginationControls('available');
                }
            })
            .catch(error => console.error("Error fetching available pets:", error));

        // Fetch adoption requests
        fetch('/adoption/all-requests', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    const requestedPets = data.result.filter(req => req.status === 'Pending').map(request => request.pet);
                    const acceptedPets = data.result.filter(req => req.status === 'Accepted').map(request => request.pet);
                    
                    paginationState.requested.total = requestedPets.length;
                    paginationState.accepted.total = acceptedPets.length;
                    
                    document.querySelector('[data-tab="requested"] .tab-badge').textContent = paginationState.requested.total;
                    document.querySelector('[data-tab="accepted"] .tab-badge').textContent = paginationState.accepted.total;
                    
                    renderPets('requested', requestedPets);
                    renderPets('accepted', acceptedPets);
                }
            })
            .catch(error => console.error("Error fetching adoption requests:", error));
    }

    function updatePaginationControls(tabId) {
        const container = document.querySelector(`#${tabId} .pets-grid`);
        const state = paginationState[tabId];
        
        // Remove existing pagination if any
        const existingPagination = container.querySelector('.pagination-controls');
        if (existingPagination) {
            existingPagination.remove();
        }

        // Only add pagination for available pets tab
        if (tabId === 'available') {
            const pagination = document.createElement('div');
            pagination.className = 'pagination-controls';
            
            const prevButton = document.createElement('button');
            prevButton.className = 'pagination-button';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.disabled = state.page === 0;
            prevButton.onclick = () => {
                if (state.page > 0) {
                    state.page--;
                    fetchAllPets();
                }
            };

            const nextButton = document.createElement('button');
            nextButton.className = 'pagination-button';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.disabled = (state.page + 1) * state.size >= state.total;
            nextButton.onclick = () => {
                if ((state.page + 1) * state.size < state.total) {
                    state.page++;
                    fetchAllPets();
                }
            };

            const pageInfo = document.createElement('span');
            pageInfo.className = 'page-info';
            const totalPages = Math.ceil(state.total / state.size);
            pageInfo.textContent = `Page ${state.page + 1} of ${totalPages}`;

            pagination.appendChild(prevButton);
            pagination.appendChild(pageInfo);
            pagination.appendChild(nextButton);
            container.appendChild(pagination);
        }
    }

    function renderPets(tabId, pets) {
        const container = document.querySelector(`#${tabId} .pets-grid`);
        if (!pets || pets.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No Pets Found</h3><p>${getEmptyStateMessage(tabId)}</p></div>`;
            return;
        }

        // Clear existing content except pagination
        const existingPagination = container.querySelector('.pagination-controls');
        container.innerHTML = '';
        if (existingPagination) {
            container.appendChild(existingPagination);
        }

        const petsGrid = document.createElement('div');
        petsGrid.className = 'pets-grid-content';
        
        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-card');
            petCard.dataset.petId = pet.id;

            const petImage = document.createElement('div');
            petImage.classList.add('pet-image');
            const img = document.createElement('img');
            img.src = pet.avatar || '/images/default-pet.png';
            img.alt = pet.name || 'Unknown Pet';
            petImage.appendChild(img);

            const petInfo = document.createElement('div');
            petInfo.classList.add('pet-info');
            const petName = document.createElement('h3');
            petName.textContent = pet.name || 'No Name';
            const petBreed = document.createElement('p');
            petBreed.textContent = pet.breed || 'Unknown Breed';
            const petCenter = document.createElement('a');
            petCenter.addEventListener('click', () => {
                sessionStorage.setItem('petCenterId', pet.petCenter.id);
                window.location.href = '/pet-center-profile';
            });
            petCenter.textContent = pet.petCenter.name;

            petInfo.appendChild(petName);
            petInfo.appendChild(petBreed);
            petInfo.appendChild(petCenter);

            petCard.appendChild(petImage);
            petCard.appendChild(petInfo);
            petCard.addEventListener('click', function() {
                showPetDetails(pet);
            });
            petsGrid.appendChild(petCard);
        });

        container.insertBefore(petsGrid, container.querySelector('.pagination-controls'));
    }

    function getEmptyStateMessage(tabId) {
        switch(tabId) {
            case 'requested': return "You haven't requested to adopt any pets yet.";
            case 'available': return "There are no pets available for adoption at the moment.";
            case 'accepted': return "You haven't had any pets accepted for adoption yet.";
            default: return "No pets found.";
        }
    }

    function showPetDetails(pet) {
        // Set the pet image and basic info
        document.getElementById('detailsPetImage').src = pet.avatar || '/images/default-pet.png';
        document.getElementById('detailsPetName').textContent = pet.name || 'No Name';
        document.getElementById('detailsPetBreed').textContent = pet.breed || 'Unknown';

        // Set the detailed information
        document.getElementById('detailsPetDob').textContent = formatDate(pet.dob) || 'N/A';
        document.getElementById('detailsPetGender').textContent = formatGender(pet.gender) || 'N/A';
        document.getElementById('detailsPetWeight').textContent = pet.weight ? `${pet.weight} kg` : 'N/A';
        document.getElementById('detailsPetSpecies').textContent = pet.species || 'N/A';

        // Update neutered status
        const neuteredBadge = document.getElementById('neuteredBadge');
        const neuteredText = document.getElementById('is_neutered');
        if (pet.isNeutered) {
            neuteredBadge.classList.add('badge-success');
            neuteredBadge.classList.remove('badge-warning');
            neuteredText.textContent = "Neutered/Spayed";
        } else {
            neuteredBadge.classList.add('badge-warning');
            neuteredBadge.classList.remove('badge-success');
            neuteredText.textContent = "Not Neutered/Spayed";
        }

        // Update vaccinated status
        const vaccinatedBadge = document.getElementById('vaccinatedBadge');
        const vaccinatedText = document.getElementById('is_vaccinated');
        if (pet.isVaccinated) {
            vaccinatedBadge.classList.add('badge-success');
            vaccinatedBadge.classList.remove('badge-warning');
            vaccinatedText.textContent = "Vaccinated";
        } else {
            vaccinatedBadge.classList.add('badge-warning');
            vaccinatedBadge.classList.remove('badge-success');
            vaccinatedText.textContent = "Not Vaccinated";
        }

        // Display gallery images
        const galleryContainer = document.getElementById("petGallery");
        galleryContainer.innerHTML = ""; // Clear current content

        if (pet.gallery && pet.gallery.length > 0) {
            pet.gallery.forEach(imageUrl => {
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = `${pet.name} Photo`;
                imgElement.addEventListener('click', () => {
                    openImageViewer(imageUrl);
                });
                galleryContainer.appendChild(imgElement);
            });
        } else {
            const noImagesMsg = document.createElement("p");
            noImagesMsg.textContent = "No gallery images available";
            noImagesMsg.style.textAlign = "center";
            noImagesMsg.style.padding = "2rem";
            noImagesMsg.style.color = "var(--text-muted)";
            galleryContainer.appendChild(noImagesMsg);
        }

        // Set up adopt button
        const adoptPetBtn = document.getElementById('adoptPetBtn');
        if (pet.adoption === null) {
            adoptPetBtn.style.display = 'flex';
            adoptPetBtn.onclick = () => {
                sessionStorage.setItem('selectedPetId', pet.id);
                window.location.href = '/adoption-form';
            };
        } else {
            adoptPetBtn.style.display = 'none';
        }

        // Show the modal
        const petDetailsModal = document.getElementById('petDetailsModal');
        const closePetDetailsModal = document.getElementById('closePetDetailsModal');
        petDetailsModal.style.display = 'flex';

        // Close modal handlers
        closePetDetailsModal.addEventListener('click', () => {
            petDetailsModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === petDetailsModal) {
                petDetailsModal.style.display = 'none';
            }
        });
    }

// Function to format date
    function formatDate(dateString) {
        if (!dateString) return null;

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateString;
        }
    }

// Function to format gender
    function formatGender(gender) {
        if (!gender) return null;

        switch(gender.toUpperCase()) {
            case 'MALE': return 'Male';
            case 'FEMALE': return 'Female';
            default: return gender;
        }
    }

// Function to open image viewer (simplified version)
    function openImageViewer(imageUrl) {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.innerHTML = `
            <div class="image-viewer-content">
                <button class="close-viewer">&times;</button>
                <img src="${imageUrl}" alt="Pet Image">
            </div>
        `;
        document.body.appendChild(viewer);

        // Close on button click
        viewer.querySelector('.close-viewer').addEventListener('click', () => {
            document.body.removeChild(viewer);
        });

        // Close on outside click
        viewer.addEventListener('click', (e) => {
            if (e.target === viewer) {
                document.body.removeChild(viewer);
            }
        });
    }

// Add some CSS for image viewer
    document.addEventListener('DOMContentLoaded', function() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
        .image-viewer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1200;
        }
        
        .image-viewer-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .image-viewer-content img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 4px;
        }
        
        .close-viewer {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }
    `;

        document.head.appendChild(styleElement);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });
});