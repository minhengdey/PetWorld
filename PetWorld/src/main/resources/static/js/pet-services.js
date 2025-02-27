document.addEventListener('DOMContentLoaded', function() {
    fetchCenters();
    fetchServices();

    const serviceDetailsModal = document.getElementById('serviceDetailsModal');
    const closeServiceDetailsModal = document.getElementById('closeServiceDetailsModal');
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
                        <img src="${center.avatar || '/placeholder.svg'}" alt="${center.avatar}">
                    </div>
                    <div class="center-info">
                        <h3>${center.name}</h3>
                    </div>
                </div>
            `).join('');
        // Gán sự kiện click để hiển thị chi tiết
        centerCards.addEventListener('click', function () {
            window.location.href = "/pet-care-services-profile";
        });
    }

    // Render services
    function renderServices(services) {
        const servicesGrid = document.getElementById('servicesGrid');

        // Xóa nội dung cũ
        servicesGrid.innerHTML = '';

        // Duyệt từng service và tạo phần tử HTML
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');
            serviceCard.dataset.serviceId = service.id; // Lưu id vào attribute

            // Thêm nội dung HTML vào card
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

            // Gán sự kiện click để hiển thị chi tiết
            serviceCard.addEventListener('click', function () {
                console.log('Clicked service ID:', service.id, service);
                showServiceDetails(service);
            });

            // Thêm vào grid
            servicesGrid.appendChild(serviceCard);
        });
    }

    // Hàm hiển thị modal chi tiết service
    function showServiceDetails(service) {
        document.getElementById('detailsServiceName').textContent = service.name;
        document.getElementById('detailsServicePrice').textContent = `$${service.price.toFixed(2)}`;
        document.getElementById('detailsServiceDiscount').textContent = service.discount ? `${service.discount}% OFF` : '';
        document.getElementById('detailsServiceDuration').querySelector('span:last-child').textContent = `${service.duration} minutes`;
        document.getElementById('detailsServiceDescription').textContent = service.description;

        serviceDetailsModal.style.display = 'flex';

        // Set up action buttons
        document.getElementById('bookingBtn').onclick = () => window.location.href = `http://localhost:8080/booking-service?id=${service.id}`;
    }

    // Close modal
    closeServiceDetailsModal.addEventListener('click', () => {
        serviceDetailsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === serviceDetailsModal) {
            serviceDetailsModal.style.display = 'none';
        }
    });

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

    // Initialize fetching
    fetchCenters();
    fetchServices();
});