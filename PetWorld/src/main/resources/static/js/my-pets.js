document.addEventListener('DOMContentLoaded', function() {
    fetchPets();
    const petsContainer = document.getElementById('petsContainer');
    const addPetBtn = document.getElementById('add-pet-btn');
    const addPetModal = document.getElementById('addPetModal');
    const closeAddPetModal = document.getElementById('closeAddPetModal');
    const cancelAddPet = document.getElementById('cancelAddPet');
    const avatarPreview = document.getElementById('avatarPreview');

    const petDetailsModal = document.getElementById('petDetailsModal');
    const closePetDetailsModal = document.getElementById('closePetDetailsModal');

    // Hiển thị modal thêm pet
    addPetBtn.addEventListener('click', () => {
        window.location.href = '/add-pet';
    });

    // Hàm đóng modal thêm pet
    function closeAddPet() {
        addPetModal.style.display = 'none';
        avatarPreview.src = '/images/default-pet.png';
    }
    closeAddPetModal.addEventListener('click', closeAddPet);
    cancelAddPet.addEventListener('click', closeAddPet);

    // Đăng ký sự kiện thay đổi file để preview ảnh
    document.getElementById('petAvatar').addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Hàm fetch danh sách pets
    function fetchPets() {
        fetch('/pet/my-pets', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    renderPets(data.result);
                }
            })
            .catch(error => {
                console.error("Error fetching pets:", error);
            });
    }

    // Hàm render danh sách pet vào grid
    function renderPets(pets) {
        if (!petsContainer) return;
        petsContainer.innerHTML = ''; // Xóa nội dung cũ
        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-card');
            petCard.dataset.petId = pet.id;

            // Tạo phần ảnh
            const petImage = document.createElement('div');
            petImage.classList.add('pet-image');
            const img = document.createElement('img');
            img.src = pet.avatar || '/images/default-pet.png';
            img.alt = pet.name || 'Unknown Pet';
            petImage.appendChild(img);

            // Tạo phần thông tin
            const petInfo = document.createElement('div');
            petInfo.classList.add('pet-info');
            const petName = document.createElement('h3');
            petName.textContent = pet.name || 'No Name';
            const petBreed = document.createElement('p');
            petBreed.textContent = pet.breed || 'Unknown Breed';
            petInfo.appendChild(petName);
            petInfo.appendChild(petBreed);

            // Ghép các phần lại với nhau
            petCard.appendChild(petImage);
            petCard.appendChild(petInfo);

            // Thêm sự kiện click để hiển thị chi tiết pet
            petCard.addEventListener('click', function() {
                showPetDetails(pet);
            });

            petsContainer.appendChild(petCard);
        });
    }

    // Hàm hiển thị modal chi tiết pet
    function showPetDetails(pet) {
        document.getElementById('detailsPetImage').src = pet.avatar || '/images/default-pet.png';
        document.getElementById('detailsPetName').textContent = pet.name || 'No Name';
        document.getElementById('detailsPetBreed').textContent = "Breed: " + (pet.breed || 'Unknown');
        document.getElementById('detailsPetDob').textContent = "Date of Birth: " + (pet.dob || 'N/A');
        document.getElementById('detailsPetGender').textContent = "Gender: " + (pet.gender || 'N/A');
        document.getElementById('detailsPetWeight').textContent = "Weight: " + (pet.weight ? pet.weight + " kg" : 'N/A');
        document.getElementById('detailsPetSpecies').textContent = "Species: " + (pet.species || 'N/A');
        if (pet.isNeutered) {
            document.getElementById('is_neutered').textContent = "This pet has been neutered/spayed.";
        } else {
            document.getElementById('is_neutered').textContent = "This pet has not been neutered/spayed.";
        }

        if (pet.isVaccinated) {
            document.getElementById('is_vaccinated').textContent = "This pet has been vaccinated.";
        } else {
            document.getElementById('is_vaccinated').textContent = "This pet has not been vaccinated.";
        }

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

        // Gán sự kiện click cho nút chuyển role
        const switchRoleBtn = document.getElementById('switchRoleBtn');
        switchRoleBtn.onclick = async function(event) {
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
                    alert('Invalid credentials');
                }
            } catch (error) {
                console.error('Login failed:', error);
            }
        };

        petDetailsModal.style.display = 'flex';

        closePetDetailsModal.addEventListener('click', function() {
            petDetailsModal.style.display = 'none';
        });
    }

    // Đóng modal nếu click bên ngoài nội dung modal (cho cả 2 modal)
    window.addEventListener('click', function(e) {
        if (e.target === addPetModal) {
            closeAddPet();
        }
        if (e.target === petDetailsModal) {
            petDetailsModal.style.display = 'none';
        }
    });

    // Fetch danh sách pets khi load trang
    fetchPets();
});
document.getElementById('petAvatar').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imgElement = document.getElementById('avatarPreview');
            imgElement.src = event.target.result;
            imgElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});