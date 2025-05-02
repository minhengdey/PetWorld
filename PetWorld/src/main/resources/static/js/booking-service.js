document.addEventListener("DOMContentLoaded", function() {
    fetchServiceDetails();
    fetchPets();

    // Fetch service details
    async function fetchServiceDetails() {
        const serviceId = sessionStorage.getItem('selectedServiceId');
        if (!serviceId) {
            console.error('Service ID not found in session storage');
            return;
        }

        try {
            const response = await fetch(`/service/${serviceId}`);
            const data = await response.json();
            if (data.code === 1000) {
                const service = data.result;
                renderServiceDetails(service);
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        }
    }

    // Render service details
    function renderServiceDetails(service) {
        const serviceBox = document.getElementById('service-details');
        serviceBox.innerHTML = `
                    <div class="service-card">
                        <div class="service-info">
                            <h3>${service.name}</h3>
                            <div class="service-price-section">
                                <p class="price">$${service.price.toFixed(2)}</p>
                                ${service.discount ? `<p class="discount">${service.discount}% OFF</p>` : ''}
                            </div>
                            <a href="/pet-care-services-profile" class="provider">${service.petCareServices.name}</a>
                            <div class="used-count">
                                <i class="fas fa-chart-bar"></i> 
                                <p>Used: ${service.usedCount}</p>
                            </div>
                            <div class="duration-time">
                                <i class="fas fa-clock"></i> 
                                <p>Duration: ${service.durationTime} minutes</p>
                            </div>
                        </div>
                    </div>
                `;
    }

    // Fetch user's pets with pagination
    function fetchPets(page = 0, size = 3) {
        fetch(`/pet/my-pets?page=${page}&size=${size}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    renderPets(data.result, page);
                }
            })
            .catch(error => {
                console.error("Error fetching pets:", error);
            });
    }

    let petId = null;

    // Render pets and pagination
    function renderPets(pageData, currentPage) {
        const pets = pageData.content;
        const petsContainer = document.getElementById('petsContainer');
        petsContainer.innerHTML = '';

        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.dataset.petId = pet.id;

            // Pet image
            const petImage = document.createElement('div');
            petImage.className = 'pet-image';
            const img = document.createElement('img');
            img.src = pet.avatar || '/placeholder.svg';
            img.alt = pet.name || 'Unknown Pet';
            petImage.appendChild(img);

            // Pet info
            const petInfo = document.createElement('div');
            petInfo.className = 'pet-info';
            const petName = document.createElement('h3');
            petName.textContent = pet.name || 'No Name';
            petInfo.appendChild(petName);

            // Assemble card
            petCard.appendChild(petImage);
            petCard.appendChild(petInfo);

            // Click to select
            petCard.addEventListener('click', function() {
                petId = pet.id;
                selectPet(petCard);
            });

            petsContainer.appendChild(petCard);
        });

        renderPetsPagination(pageData, currentPage);
    }

    // Render pagination controls for pets
    function renderPetsPagination(pageData, currentPage) {
        const paginationContainer = document.getElementById('petsPaginationContainer');
        if (!paginationContainer) return;

        const totalPages = pageData.totalPages;
        paginationContainer.innerHTML = '';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.classList.add('pagination-btn', 'prev-btn');
        prevBtn.disabled = currentPage === 0;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.onclick = () => fetchPets(currentPage - 1);
        paginationContainer.appendChild(prevBtn);

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.classList.add('pagination-btn', 'next-btn');
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => fetchPets(currentPage + 1);
        paginationContainer.appendChild(nextBtn);
    }

    // Handle pet selection
    function selectPet(element) {
        document.querySelectorAll('.pet-card').forEach(card => {
            card.classList.remove('selected');
        });
        element.classList.add('selected');
    }

    // Form submission
    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!petId) {
            alert('Please select a pet');
            return;
        }

        const bookingData = {
            preferredDateTime: document.getElementById('datetime').value,
            idPet: petId,
            specialNotes: document.getElementById('notes').value
        }

        const serviceId = sessionStorage.getItem('selectedServiceId');

        try {
            const response = await fetch(`/appointment/${serviceId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (result.code === 1000) {
                alert('Booking submitted successfully!');
                window.location.href = '/pet-services';
            } else {
                alert('Failed to book service');
            }
        } catch (error) {
            console.error('Error booking service:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Set min date to today for datetime
    const datetimeInput = document.getElementById('datetime');
    if (datetimeInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        datetimeInput.min = now.toISOString().slice(0, 16);
    }
});