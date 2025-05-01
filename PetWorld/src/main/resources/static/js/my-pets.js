document.addEventListener('DOMContentLoaded', function() {
    fetchPets();
    const petsContainer = document.getElementById('petsContainer');
    const emptyState = document.getElementById('emptyState');
    const addPetBtn = document.getElementById('add-pet-btn');
    const emptyAddPetBtn = document.getElementById('empty-add-pet-btn');

    const petDetailsModal = document.getElementById('petDetailsModal');
    const closePetDetailsModal = document.getElementById('closePetDetailsModal');

    // Event listeners for Add Pet buttons
    addPetBtn.addEventListener('click', () => {
        window.location.href = '/add-pet';
    });

    if (emptyAddPetBtn) {
        emptyAddPetBtn.addEventListener('click', () => {
            window.location.href = '/add-pet';
        });
    }

    let currentPage = 0;

// Function to fetch all pets with pagination
    function fetchPets(page = 0, size = 3) {
        fetch(`/pet/my-pets?page=${page}&size=${size}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    renderPets(data.result.content); // dùng `.content` nếu backend trả về dạng Page
                    updatePagination(data.result.totalPages, data.result.number); // cập nhật phân trang

                    if (!data.result.content || data.result.content.length === 0) {
                        emptyState.style.display = 'block';
                        petsContainer.style.display = 'none';
                    } else {
                        emptyState.style.display = 'none';
                        petsContainer.style.display = 'grid';
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching pets:", error);
                emptyState.style.display = 'block';
                petsContainer.style.display = 'none';
            });
    }

// Function to render pets
    function renderPets(pets) {
        if (!petsContainer) return;
        petsContainer.innerHTML = '';

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
            petInfo.appendChild(petName);
            petInfo.appendChild(petBreed);

            petCard.appendChild(petImage);
            petCard.appendChild(petInfo);

            petCard.addEventListener('click', function () {
                showPetDetails(pet);
            });

            petsContainer.appendChild(petCard);
        });
    }

// Function to update pagination UI
    function updatePagination(totalPages, currentPageIndex) {
        const paginationContainer = document.getElementById('paginationContainer');
        paginationContainer.innerHTML = '';

        // Previous button with icon
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('pagination-btn', 'prev-btn');  // Thêm lớp CSS
        prevBtn.disabled = currentPageIndex === 0;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'; // Font Awesome icon cho Previous
        prevBtn.onclick = () => {
            currentPage--;
            fetchPets(currentPage);
        };
        paginationContainer.appendChild(prevBtn);

        // Current page info
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPageIndex + 1} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        // Next button with icon
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('pagination-btn', 'next-btn');  // Thêm lớp CSS
        nextBtn.disabled = currentPageIndex >= totalPages - 1;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'; // Font Awesome icon cho Next
        nextBtn.onclick = () => {
            currentPage++;
            fetchPets(currentPage);
        };
        paginationContainer.appendChild(nextBtn);
    }


    // Function to show pet details modal
    function showPetDetails(pet) {
        document.getElementById('detailsPetImage').src = pet.avatar || '/images/default-pet.png';
        document.getElementById('detailsPetName').textContent = pet.name || 'No Name';
        document.getElementById('detailsPetBreed').textContent = pet.breed || 'Unknown';
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

        // Add event listener to switch role button
        const switchRoleBtn = document.getElementById('switchRoleBtn');
        switchRoleBtn.onclick = async function() {
            try {
                const response = await fetch(`/api/auth/swap/${pet.id}`, {
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
                    showToast('Error switching roles. Please try again.');
                }
            } catch (error) {
                console.error('Role switch failed:', error);
                showToast('Error switching roles. Please try again.');
            }
        };

        // Show the modal
        petDetailsModal.style.display = 'flex';
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

    // Function to show toast notification
    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
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

    // Event listener to close the pet details modal
    closePetDetailsModal.addEventListener('click', function() {
        petDetailsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === petDetailsModal) {
            petDetailsModal.style.display = 'none';
        }
    });

    // Add CSS for toast and image viewer
    addExtraStyles();

    // Function to add extra CSS styles
    function addExtraStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s;
                z-index: 1100;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .toast-error {
                background-color: #EF4444;
            }
            
            .toast-success {
                background-color: #10B981;
            }
            
            .toast-warning {
                background-color: #F59E0B;
            }
            
            .badge-success {
                background-color: #ECFDF5 !important;
            }
            
            .badge-success i {
                color: #10B981 !important;
            }
            
            .badge-warning {
                background-color: #FFFBEB !important;
            }
            
            .badge-warning i {
                color: #F59E0B !important;
            }
            
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
    }

    // Fetch pets when the page loads
    fetchPets();
});