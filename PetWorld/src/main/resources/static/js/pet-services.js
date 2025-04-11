document.addEventListener('DOMContentLoaded', function() {
    // Fetch centers data
    async function fetchCenters() {
        try {
            const response = await fetch('/pet-care-services/all');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.code === 1000) {
                renderCenters(data.result);
            }
        } catch (error) {
            console.error('Error fetching centers:', error);
            showError('centerCards', 'Failed to load centers');
        }
    }

    // Fetch services data
    async function fetchServices() {
        try {
            const response = await fetch('/service/all');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.code === 1000) {
                renderServices(data.result);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            showError('servicesGrid', 'Failed to load services');
        }
    }

    // Render centers
    function renderCenters(centers) {
        const centerCards = document.getElementById('centerCards');
        centerCards.innerHTML = centers.map(center => `
                <div class="center-card">
                    <div class="center-image">
                        <img src="${center.avatar || '/placeholder.svg'}" alt="${center.name}">
                    </div>
                    <div class="center-info">
                        <h3>${center.name}</h3>
                    </div>
                </div>
            `).join('');
    }

    // Render services
    function renderServices(services) {
        const servicesGrid = document.getElementById('servicesGrid');
        servicesGrid.innerHTML = services.map((service, index) => `
                <div class="service-card" data-service-id="${service.id}">
                    <div class="service-info">
                        <h3>${service.name}</h3>
                        <p class="price">$${service.price.toFixed(2)}</p>
                        ${service.discount ? `<p class="discount">${service.discount}% OFF</p>` : ''}
                        <p class="provider">${service.petCareServices.name}</p>
                        <div class="used-count">
                            <i class="fas fa-chart-bar"></i> <p>Used: ${service.usedCount}</p>
                        </div>
                        <div class="duration-time">
                            <i class="fas fa-clock"></i> <p>Duration: ${service.durationTime} minutes</p>
                        </div>
                    </div>
                </div>
            `).join('');

        // Add event listeners to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-service-id');
                const service = services.find(s => s.id.toString() === serviceId);
                if (service) {
                    showServiceDetails(service);
                }
            });
        });
    }

    // Show service details in modal
    function showServiceDetails(service) {
        document.getElementById('detailsServiceName').textContent = service.name;
        document.getElementById('detailsServicePrice').textContent = `$${service.price.toFixed(2)}`;
        document.getElementById('detailsServiceDiscount').textContent = service.discount ? `${service.discount}% OFF` : '';
        document.getElementById('detailsServiceUsedCount').textContent = service.usedCount || '0';
        document.getElementById("detailsServiceDurationTime").textContent = service.durationTime;

        document.getElementById('serviceDetailsModal').style.display = 'flex';

        // Set up booking button
        document.getElementById('bookingBtn').onclick = () => {
            sessionStorage.setItem('selectedServiceId', service.id);
            window.location.href = '/booking-service';
        };
    }

    // Show error message
    function showError(containerId, message) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
    }

    // Close modal functionality
    const closeModalBtn = document.getElementById('closeServiceDetailsModal');
    const modal = document.getElementById('serviceDetailsModal');

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initialize fetching
    fetchCenters();
    fetchServices();
});