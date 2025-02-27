document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const petsContainer = document.getElementById('petsContainer');
    const avatarPreview = document.getElementById('avatarPreview');
    const petDetailsModal = document.getElementById('petDetailsModal');
    const closePetDetailsModal = document.getElementById('closePetDetailsModal');

    fetchAllPets();

    function fetchAllPets() {
        fetch('/adoption/all-requests', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    const requestedPets = data.result.filter(req => req.status === 'Pending').map(request => request.pet);
                    const adoptedPets = data.result.filter(req => req.status === 'Approved').map(request => request.pet);
                    document.querySelector('[data-tab="requested"] .tab-badge').textContent = requestedPets.length;
                    document.querySelector('[data-tab="approved"] .tab-badge').textContent = adoptedPets.length;
                    renderPets('requested', requestedPets);
                    renderPets('approved', adoptedPets);
                }
            })
            .catch(error => console.error("Error fetching adoption requests:", error));

        fetch('/pet/pets-pc', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    document.querySelector('[data-tab="available"] .tab-badge').textContent = data.result.length;
                    renderPets('available', data.result);
                }
            })
            .catch(error => console.error("Error fetching available pets:", error));
    }

    function renderPets(tabId, pets) {
        const container = document.querySelector(`#${tabId} .pets-grid`);
        if (!pets || pets.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No Pets Found</h3><p>${getEmptyStateMessage(tabId)}</p></div>`;
            return;
        }
        container.innerHTML = '';
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
            petCenter.href = '/pet-center-profile';  // Đường dẫn muốn mở
            petCenter.textContent = pet.petCenter.name; // Nội dung hiển thị

            petInfo.appendChild(petName);
            petInfo.appendChild(petBreed);
            petInfo.appendChild(petCenter);

            petCard.appendChild(petImage);
            petCard.appendChild(petInfo);
            petCard.addEventListener('click', function() {
                showPetDetails(pet);
            });
            container.appendChild(petCard);
        });
    }

    function getEmptyStateMessage(tabId) {
        switch(tabId) {
            case 'requested': return "You haven't requested to adopt any pets yet.";
            case 'approved': return "You haven't successfully adopted any pets yet.";
            case 'available': return "There are no pets available for adoption at the moment.";
            default: return "No pets found.";
        }
    }

    function showPetDetails(pet) {
        document.getElementById('detailsPetImage').src = pet.avatar || '/images/default-pet.png';
        document.getElementById('detailsPetName').textContent = pet.name || 'No Name';
        document.getElementById('detailsPetBreed').textContent = "Breed: " + (pet.breed || 'Unknown');
        document.getElementById('detailsPetDob').textContent = "Date of Birth: " + (pet.dob || 'N/A');
        document.getElementById('detailsPetGender').textContent = "Gender: " + (pet.gender || 'N/A');
        document.getElementById('detailsPetWeight').textContent = "Weight: " + (pet.weight ? pet.weight + " kg" : 'N/A');
        document.getElementById('detailsPetSpecies').textContent = "Species: " + (pet.species || 'N/A');
        document.getElementById('is_neutered').textContent = pet.isNeutered ? "This pet has been neutered/spayed." : "This pet has not been neutered/spayed.";
        document.getElementById('is_vaccinated').textContent = pet.isVaccinated ? "This pet has been vaccinated." : "This pet has not been vaccinated.";

        const galleryContainer = document.getElementById("petGallery");
        galleryContainer.innerHTML = pet.gallery && pet.gallery.length > 0
            ? pet.gallery.map(imageUrl => `<img src="${imageUrl}" alt="Pet Photo" class="pet-gallery-img">`).join('')
            : "<p>No gallery images available</p>";

        if (pet.adoption === null) {
            document.getElementById('adoptPetBtn').onclick = () => {
                window.location.href = `http://localhost:8080/adoption-form?id=${pet.id}`;
            };
        }

        petDetailsModal.style.display = 'flex';
        closePetDetailsModal.addEventListener('click', () => petDetailsModal.style.display = 'none');
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    document.getElementById('petAvatar').addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = event => avatarPreview.src = event.target.result;
            reader.readAsDataURL(file);
        }
    });
});