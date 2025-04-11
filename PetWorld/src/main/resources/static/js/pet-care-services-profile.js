document.addEventListener('DOMContentLoaded', function() {
    // Fetch center profile data
    fetchCenterProfile();

    // Fetch services data
    fetchServices();

    // Set up modal event listeners
    setupModal();

    // Fetch center profile data
    async function fetchCenterProfile() {
        try {
            const response = await fetch('/api/auth/myInfo');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (data.code === 1000) {
                renderCenterProfile(data.result);
            }
        } catch (error) {
            console.error('Error fetching center profile:', error);
        }
    }

    // Render center profile data
    function renderCenterProfile(center) {
        document.getElementById('center-name').textContent = center.name || 'Pet Care Center';
        document.getElementById('center-address').textContent = center.address || 'Address not provided';
        document.getElementById('center-email').textContent = center.email || 'Email not provided';
        document.getElementById('center-phone').textContent = center.phone || 'Phone not provided';
        document.getElementById('center-description').textContent = center.description || 'No description available';

        // Set center avatar
        const centerAvatar = document.getElementById('center-avatar');
        if (center.avatar) {
            centerAvatar.src = center.avatar;
        } else {
            centerAvatar.src = '/images/default-avatar.png';
        }

        // Update page title
        document.title = `${center.name} - Pet World`;
    }

    // Fetch services data
    async function fetchServices() {
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

    // Render services data
    function renderServices(services) {
        const servicesGrid = document.getElementById('servicesGrid');

        // Clear existing content
        servicesGrid.innerHTML = '';

        if (services.length === 0) {
            servicesGrid.innerHTML = `
                <div class="empty-state">
                    <p>No services available yet</p>
                    <button id="empty-add-service" class="add-service-btn">Add Your First Service</button>
                </div>
            `;

            document.getElementById('empty-add-service').addEventListener('click', function() {
                window.location.href = '/add-service';
            });

            return;
        }

        // Loop through services and create elements
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');
            serviceCard.dataset.serviceId = service.id;

            serviceCard.innerHTML = `
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <div class="service-price-section">
                        <p class="price">$${service.price}</p>
                        ${service.discount ? `<p class="discount">${service.discount}% OFF</p>` : ''}
                    </div>
                    <p class="duration">
                        <span class="material-symbols-outlined">schedule</span>
                        ${service.durationTime} minutes
                    </p>
                </div>
                <div class="service-actions">
                    <button class="edit-service-btn" data-id="${service.id}">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="delete-service-btn" data-id="${service.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;

            // Add click event to show service details
            serviceCard.addEventListener('click', function(e) {
                // Don't trigger if clicking on action buttons
                if (!e.target.closest('.service-actions')) {
                    showServiceDetails(service);
                }
            });

            // Add service card to grid
            servicesGrid.appendChild(serviceCard);
        });

        // Add event listeners for action buttons
        document.querySelectorAll('.edit-service-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const serviceId = this.dataset.id;
                window.location.href = `/service/edit/${serviceId}`;
            });
        });

        document.querySelectorAll('.delete-service-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const serviceId = this.dataset.id;
                confirmDeleteService(serviceId);
            });
        });
    }

    // Show service details in modal
    function showServiceDetails(service) {
        document.getElementById('detailsServiceName').textContent = service.name;
        document.getElementById('detailsServicePrice').textContent = `$${service.price.toFixed(2)}`;
        document.getElementById('detailsServiceDiscount').textContent = service.discount ? `${service.discount}% OFF` : '';
        document.getElementById('detailsServiceDurationTime').textContent = service.durationTime + " minutes";
        document.getElementById('detailsServiceUsedCount').textContent = "Used: " + service.usedCount || '0';


        // Set up action buttons
        document.getElementById('editServiceBtn').onclick = () => window.location.href = `/service/edit/${service.id}`;
        document.getElementById('deleteServiceBtn').onclick = () => confirmDeleteService(service.id);

        // Show modal
        document.getElementById('serviceDetailsModal').style.display = 'flex';
    }

    // Confirm service deletion
    function confirmDeleteService(serviceId) {
        if (confirm('Are you sure you want to delete this service?')) {
            deleteService(serviceId);
        }
    }

    // Delete service
    async function deleteService(serviceId) {
        try {
            const response = await fetch(`/service/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Delete request failed');

            const data = await response.json();
            if (data.code === 1000) {
                // Close modal if open
                document.getElementById('serviceDetailsModal').style.display = 'none';

                // Refresh services
                fetchServices();

                // Show success message
                alert('Service deleted successfully');
            } else {
                alert(data.message || 'Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('An error occurred while deleting the service');
        }
    }

    // Set up modal events
    function setupModal() {
        const modal = document.getElementById('serviceDetailsModal');
        const closeBtn = document.getElementById('closeServiceDetailsModal');

        // Close modal when clicking close button
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle "Add New Service" button
        document.getElementById('add-service-btn').addEventListener('click', () => {
            window.location.href = '/add-service';
        });
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
});
