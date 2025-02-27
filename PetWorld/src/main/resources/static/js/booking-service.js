function getServiceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Sau đó gọi API để lấy dữ liệu chi tiết
async function fetchServiceDetails() {
    const serviceId = getServiceIdFromUrl();
    if (!serviceId) {
        console.error('Service ID not found in URL');
        return;
    }

    try {
        const response = await fetch(`/service/${serviceId}`);
        const data = await response.json();
        const service = data.result;
        const serviceBox = document.getElementById('service-details');
        const serviceCard = document.createElement('div');
        serviceCard.classList.add('service-card');
        serviceCard.dataset.serviceId = service.id;
        serviceCard.innerHTML = `
            <div class="service-info">
                <h3>${service.name}</h3>
                <div class="service-price-section">
                    <p class="price">$${service.price.toFixed(2)}</p>
                    ${service.discount ? `<p class="discount">${service.discount}% OFF</p>` : ''}
                </div>
                <a href="/pet-care-services-profile">${service.petCareServices.name}</a>
            </div>
        `;
        serviceBox.appendChild(serviceCard);
        console.log('Service Details:', data);
    } catch (error) {
        console.error('Error fetching service details:', error);
    }
}

fetchServiceDetails();
document.addEventListener("DOMContentLoaded", function() {
    fetchPets();
    const petsContainer = document.getElementById('petsContainer');
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

    let petId = null
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
            petInfo.appendChild(petName);

            // Ghép các phần lại với nhau
            petCard.appendChild(petImage);
            petCard.appendChild(petInfo);

            petCard.addEventListener('click', function() {
                petId = pet.id;
                selectPet(petCard);
            });

            petsContainer.appendChild(petCard);
        });
    }

    function selectPet(element) {
        // Remove selected class from all pet cards
        document.querySelectorAll('.pet-card').forEach(card => {
            card.classList.remove('selected');
        });
        // Add selected class to clicked card
        element.classList.add('selected');
    }

    document.getElementById('bookingForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const bookingData = {
            preferredDateTime: document.getElementById('datetime').value,
            idPet: petId,
            specialNotes: document.getElementById('notes').value
        }
        const serviceId = getServiceIdFromUrl();
        const response = await fetch(`/appointment/${serviceId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bookingData)
        });
        console.log(response);
        const result = await response.json();
        if (result.code === 1000) {
            alert('Booking submitted successfully!');
            window.location.href = '/pet-services';
        } else {
            alert('Failed to book service');
        }
    });
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    dateInput.min = new Date().toISOString().split('T')[0];
    fetchPets();
});