document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('addServiceForm');

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Prepare service data
        const serviceData = {
            name: document.getElementById('serviceName').value,
            price: document.getElementById('servicePrice').value,
            discount: document.getElementById('serviceDiscount').value,
            durationTime: document.getElementById('serviceDurationTime').value
        };

        // Send service data
        const serviceResponse = await fetch('/service', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });

        const result = await serviceResponse.json();
        if (result.code === 1000) {
            window.location.href = '/pet-care-services-profile';
        } else {
            alert('Failed to add service');
        }
    });

    // Cancel button
    document.getElementById('cancelAddService').addEventListener('click', function() {
        window.history.back();
    });
});