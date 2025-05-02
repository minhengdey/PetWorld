document.addEventListener('DOMContentLoaded', function() {
    // Fetch centers data
    async function fetchCenters(page = 0, size = 3) {
        try {
            const response = await fetch(`/pet-care-services/all?page=${page}&size=${size}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.code === 1000) {
                renderCenters(data.result);
                renderCentersPagination(data.result, page);
            }
        } catch (error) {
            console.error('Error fetching centers:', error);
            showError('centerCards', 'Failed to load centers');
        }
    }

    // Fetch services data
    async function fetchServices(page = 0, size = 3) {
        try {
            const response = await fetch(`/service/all?page=${page}&size=${size}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.code === 1000) {
                renderServices(data.result);
                renderServicesPagination(data.result, page);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            showError('servicesGrid', 'Failed to load services');
        }
    }

    // Render centers pagination
    function renderCentersPagination(pageData, currentPage) {
        const paginationContainer = document.getElementById('centersPaginationContainer');
        if (!paginationContainer) return;

        const totalPages = pageData.totalPages;
        paginationContainer.innerHTML = '';

        // Previous button with icon
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('pagination-btn', 'prev-btn');
        prevBtn.disabled = currentPage === 0;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.onclick = () => fetchCenters(currentPage - 1);
        paginationContainer.appendChild(prevBtn);

        // Current page info
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        // Next button with icon
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('pagination-btn', 'next-btn');
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => fetchCenters(currentPage + 1);
        paginationContainer.appendChild(nextBtn);
    }

    // Render services pagination
    function renderServicesPagination(pageData, currentPage) {
        const paginationContainer = document.getElementById('servicesPaginationContainer');
        if (!paginationContainer) return;

        const totalPages = pageData.totalPages;
        paginationContainer.innerHTML = '';

        // Previous button with icon
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('pagination-btn', 'prev-btn');
        prevBtn.disabled = currentPage === 0;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.onclick = () => fetchServices(currentPage - 1);
        paginationContainer.appendChild(prevBtn);

        // Current page info
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        // Next button with icon
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('pagination-btn', 'next-btn');
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => fetchServices(currentPage + 1);
        paginationContainer.appendChild(nextBtn);
    }

    // Render centers
    function renderCenters(pageData) {
        const centerCards = document.getElementById('centerCards');
        const centers = pageData.content;
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
    function renderServices(pageData) {
        const servicesGrid = document.getElementById('servicesGrid');
        const services = pageData.content;
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