document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('addPetForm');
    const avatarInput = document.getElementById('petAvatar');
    const galleryInput = document.getElementById('galleryImages');
    const galleryPreview = document.getElementById('galleryPreview');
    const avatarPreview = document.getElementById('avatarPreview');
    let galleryFiles = new Set();

    // Preview avatar image
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
                avatarPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Preview gallery images
    galleryInput.addEventListener('change', function(e) {
        Array.from(e.target.files).forEach(file => {
            galleryFiles.add(file);
            addGalleryPreview(file);
        });
    });

    function addGalleryPreview(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item-wrapper';

            galleryItem.innerHTML = `
                    <div class="gallery-item">
                        <img src="${event.target.result}" alt="Gallery preview" class="gallery-img">
                        <button type="button" class="remove-image" data-name="${file.name}">&times;</button>
                    </div>
                `;

            galleryPreview.appendChild(galleryItem);

            // Add remove button functionality
            const removeBtn = galleryItem.querySelector('.remove-image');
            removeBtn.addEventListener('click', function() {
                const fileName = this.getAttribute('data-name');
                galleryFiles = new Set([...galleryFiles].filter(f => f.name !== fileName));
                galleryItem.remove();
            });
        };
        reader.readAsDataURL(file);
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const avatarFile = avatarInput.files[0];
        if (!avatarFile) {
            alert("Please select a profile picture.");
            return;
        }

        try {
            // Upload avatar
            const avatarFormData = new FormData();
            avatarFormData.append("file", avatarFile);
            const avatarResponse = await fetch('/api/upload', {
                method: 'POST',
                body: avatarFormData
            });

            if (!avatarResponse.ok) throw new Error('Avatar upload failed');
            const avatarData = await avatarResponse.json();
            const avatar = avatarData.result;

            // Upload gallery images
            const galleryUrls = [];
            for (const file of galleryFiles) {
                const galleryFormData = new FormData();
                galleryFormData.append("file", file);

                const galleryResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: galleryFormData
                });

                if (galleryResponse.ok) {
                    const galleryData = await galleryResponse.json();
                    galleryUrls.push(galleryData.result);
                }
            }

            // Prepare pet data
            const petData = {
                name: document.getElementById('petName').value,
                dob: document.getElementById('petDob').value,
                gender: document.getElementById('petGender').value,
                species: document.getElementById('petSpecies').value,
                breed: document.getElementById('petBreed').value,
                weight: parseFloat(document.getElementById('petWeight').value),
                color: document.getElementById('color').value,
                isNeutered: document.getElementById('is_neutered').checked,
                isVaccinated: document.getElementById('is_vaccinated').checked,
                avatar: avatar,
                gallery: galleryUrls
            };

            // Send pet data
            const petResponse = await fetch('/pet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });

            const result = await petResponse.json();
            if (result.code === 1000) {
                if (result.result.petOwner != null) {
                    window.location.href = '/my-pets';
                } else {
                    window.location.href = '/pets-management';
                }
            } else {
                alert('Failed to add pet');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    });

    // Cancel button
    document.getElementById('cancelAddPet').addEventListener('click', function() {
        window.history.back();
    });
});