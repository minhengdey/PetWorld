document.addEventListener('DOMContentLoaded', async function() {
    fetchAppointments();
    const appointmentsContainer = document.getElementById('appointmentsContainer');
    const appointmentDetailsModal = document.getElementById('appointmentDetailsModal');
    const closeAppointmentDetailsModal = document.getElementById('closeAppointmentDetailsModal');

    // Close modal when clicking X
    closeAppointmentDetailsModal.addEventListener('click', () => {
        appointmentDetailsModal.style.display = 'none';
    });
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === appointmentDetailsModal) {
            appointmentDetailsModal.style.display = 'none';
        }
    });
    // Fetch and render appointments
    function fetchAppointments() {
        fetch('/appointment/my-appointments', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    renderAppointments(data.result);
                }
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    }
    // Render appointments
    function renderAppointments(appointments) {
        if (!appointmentsContainer) return;
        appointmentsContainer.innerHTML = '';


        appointments.forEach(appointment => {
            const appointmentCard = document.createElement('div');
            appointmentCard.classList.add('appointment-card');
            appointmentCard.classList.add(`status-${appointment.status}`);

            appointmentCard.innerHTML = `
    <div class="appointment-header">
    <div class="appointment-titles">
        <h3 class="service-name">${appointment.service.name}</h3>
        <h4 class="pet-name">${appointment.pet.name}</h4>
    </div>
    <span class="status-badge ${appointment.status}">${appointment.status}</span>
</div>
<div class="appointment-content">
    <div class="appointment-detail">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        <span class="detail-text">${new Date(appointment.preferredDateTime).toLocaleString()}</span>
    </div>
    <a href="/pet-care-services-profile" class="service-link">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="detail-text">${appointment.service.petCareServices.name}</span>
    </a>
</div>
`;

            appointmentCard.addEventListener('click', () => {
                showAppointmentDetails(appointment);
            });
            appointmentsContainer.appendChild(appointmentCard);
        });
    }
    function showAppointmentDetails(appointment) {
        // Set the service and pet names
        document.getElementById('detailsAppointmentServiceName').textContent = appointment.service.name;
        document.getElementById('detailsAppointmentPetName').textContent = appointment.pet.name;

        // Format and set the date
        const formattedDate = new Date(appointment.preferredDateTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('detailsAppointmentDate').textContent = formattedDate;

        // Format and set the price
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(appointment.service.price);
        document.getElementById('detailsAppointmentServicePrice').textContent = `Price: ${formattedPrice}`;

        // Format and set the discount
        const formattedDiscount = `${appointment.service.discount}%`;
        document.getElementById('detailsAppointmentServiceDiscount').textContent = `Discount: ${formattedDiscount}`;

        // Set the status with proper styling
        const statusElement = document.getElementById('detailsAppointmentStatus');
        statusElement.textContent = appointment.status;
        statusElement.className = `status-badge ${appointment.status}`;

        document.getElementById('detailsAppointmentServiceNote').textContent = `Special Notes: ${appointment.specialNotes}`;


        // Show the modal
        appointmentDetailsModal.style.display = 'flex';

        document.getElementById('cancelAppointmentBtn').onclick = () => deleteAppointment(appointment.id);
    }
    window.deleteAppointment = async function(appointmentId, event) {
        if (event) event.stopPropagation();
        if (!confirm('Are you sure you want to delete this appointment?')) return;

        try {
            const response = await fetch(`/appointment/${appointmentId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');

            appointmentDetailsModal.style.display = 'none';
            await fetchAppointments();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };
    // Initial fetch
    await fetchAppointments();
});