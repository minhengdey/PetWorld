document.addEventListener('DOMContentLoaded', function() {
    fetchCenterServices();

    const servicesGrid = document.getElementById('servicesGrid');
    const addServiceBtn = document.getElementById('add-service-btn');
    const serviceDetailsModal = document.getElementById('serviceDetailsModal');
    const closeServiceDetailsModal = document.getElementById('closeServiceDetailsModal');

    // Add service button click
    addServiceBtn.addEventListener('click', () => {
        window.location.href = '/add-service';
    });

    // Fetch center services
    async function fetchCenterServices() {
        try {
            const response = await fetch('/service/my-services');
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
            <div class="service-actions">
                <button class="edit-service-btn">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="delete-service-btn">
                    <span class="material-symbols-outlined">delete</span>
                </button>
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
        document.getElementById('editServiceBtn').onclick = () => window.location.href = `/add-service`;
        document.getElementById('deleteServiceBtn').onclick = () => deleteService(service.id);
    }

    // Delete service
    window.deleteService = async function(serviceId, event) {
        if (event) event.stopPropagation();
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`/service/${serviceId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');

            serviceDetailsModal.style.display = 'none';
            await fetchCenterServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    // Edit service
    window.editService = function(serviceId, event) {
        if (event) event.stopPropagation();
        window.location.href = `/add-service`;
    };

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

    fetchCenterServices();
});
document.addEventListener('DOMContentLoaded', function() {
    // Fetch user info
    fetch('/api/auth/myInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                document.getElementById('name').textContent = data.result.name || 'Unknown';
                document.getElementById('avatar').src = data.result.avatar || '/images/default-avatar.png';
                document.getElementById('role').textContent = data.result.role || 'Unknown Role';
                document.getElementById('center-name').textContent = data.result.name;
                document.getElementById('center-address').textContent = data.result.address;
                document.getElementById('center-email').textContent = data.result.email;
                document.getElementById('center-phone').textContent = data.result.phone;
                document.getElementById('center-description').textContent = data.result.description;
                document.getElementById('center-avatar').src = data.result.avatar || '/placeholder.svg';

                // Show menu based on role
                const role = data.result.role;
                hideAllMenus();
                showMenuForRole(role);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    function hideAllMenus() {
        document.getElementById('petOwnerMenu').style.display = 'none';
        document.getElementById('petMenu').style.display = 'none';
        document.getElementById('doctorMenu').style.display = 'none';
        document.getElementById('petCenterMenu').style.display = 'none';
    }

    function showMenuForRole(role) {
        const menuMap = {
            'PET_OWNER': 'petOwnerMenu',
            'PET': 'petMenu',
            'PET_CARE_SERVICES': 'doctorMenu',
            'PET_CENTER': 'petCenterMenu'
        };

        const menuId = menuMap[role];
        if (menuId) {
            document.getElementById(menuId).style.display = 'block';
        }
    }
});