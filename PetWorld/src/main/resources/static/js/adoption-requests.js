document.addEventListener('DOMContentLoaded', async function() {
    let allRequests = [];
    let currentFilter = 'all';

    // Fetch adoption requests
    await fetch('/adoption/all-requests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                allRequests = data.result;
                updateStatistics(allRequests);
                displayRequests(allRequests);
            }
        })
        .catch(error => {
            console.error("Error fetching adoption requests:", error);
        });

    // Filter button click handlers
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply filter
            currentFilter = this.dataset.status;
            const filtered = currentFilter === 'all'
                ? allRequests
                : allRequests.filter(request => request.status === currentFilter);
            displayRequests(filtered);
        });
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allRequests.filter(request => {
            if (currentFilter !== 'all' && request.status !== currentFilter) {
                return false;
            }
            return request.petOwner.name.toLowerCase().includes(searchTerm) ||
                request.pet.name.toLowerCase().includes(searchTerm) ||
                request.message.toLowerCase().includes(searchTerm);
        });
        displayRequests(filtered);
    });

    function updateStatistics(requests) {
        const stats = requests.reduce((acc, request) => {
            acc[request.status] = (acc[request.status] || 0) + 1;
            return acc;
        }, {});

        document.getElementById('pending-count').textContent = stats.Pending || 0;
        document.getElementById('approved-count').textContent = stats.Scheduled || 0;
        document.getElementById('rejected-count').textContent = stats.Rejected || 0;
    }

    function displayRequests(requests) {
        const container = document.getElementById('requests-container');
        container.innerHTML = '';
        requests.forEach(request => {
            container.appendChild(createRequestCard(request));
        });
    }

    function createRequestCard(request) {
        const div = document.createElement('div');
        div.className = 'request-card';
        div.innerHTML = `
    <div class="request-header">
        <div class="requester-info">
            <img src="${request.petOwner.avatar || '/images/default-avatar.jpg'}"
                 alt="${request.petOwner.name}"
                 class="requester-avatar">
            <div class="requester-details">
                <h3>${request.petOwner.name}</h3>
                <h6>${request.petOwner.phone}</h6>
                <h6>${request.petOwner.email}</h6>
                <h6>${request.petOwner.address}</h6>
                <span class="request-date">
                    Requested on ${new Date(request.createdAt).toLocaleDateString()}
                    ${request.nextMeetingDate ? `<br>Next Meeting: ${new Date(request.nextMeetingDate).toLocaleDateString()}` : ''}
                </span>
            </div>
        </div>
        <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
    </div>
    <div class="pet-info">
        <img src="${request.pet.avatar || '/images/default-pet.jpg'}"
             alt="${request.pet.name}"
             class="pet-avatar">
        <div class="pet-details">
            <h4>${request.pet.name}</h4>
            <span class="pet-breed">${request.pet.breed}</span>
        </div>
    </div>
    <div class="request-details">
        <div class="detail-item">
            <span class="material-symbols-outlined">home</span>
            <div class="detail-content">
                <label>Residence</label>
                <span>${request.residenceType}</span>
                <div class="amenities">
                    ${request.hasYard ? '<span class="tag">Has Yard</span>' : ''}
                    ${request.hasFencedArea ? '<span class="tag">Fenced Area</span>' : ''}
                </div>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-symbols-outlined">pets</span>
            <div class="detail-content">
                <label>Pet Experience</label>
                <span>${request.hasOwnedPetsBefore ? 'Has previous experience' : 'First-time owner'}</span>
            </div>
        </div>
        <div class="detail-item">
            <span class="material-symbols-outlined">info</span>
            <div class="detail-content">
                <label>Experience Details</label>
                <span>${request.petExperience || 'No details provided'}</span>
            </div>
        </div>
    </div>
    ${request.hasOtherPets ? `
        <div class="other-pets-info">
            <h4><span class="material-symbols-outlined">pets</span> Current Pets</h4>
            <p>${request.otherPetsDetails || 'No details provided'}</p>
        </div>
    ` : ''}
    <div class="request-message">
        <h4><span class="material-symbols-outlined">comment</span> Adoption Reason</h4>
        <p>"${request.adoptionReason}"</p>
    </div>
    <div class="request-actions">
        ${request.status === 'Pending' ? `
            <button class="action-btn approve" onclick="{
                sessionStorage.setItem('requestId', ${request.id});
                window.location.href = '/calendar-request';
            }">
                <span class="material-symbols-outlined">check</span>
                Schedule
            </button>
            <button class="action-btn reject" onclick="handleRequestRejected(${request.id})">
                <span class="material-symbols-outlined">close</span>
                Reject
            </button>
        ` : ''}
        <button class="action-btn view" onclick="viewRequestDetails(${request.id})">
            <span class="material-symbols-outlined">visibility</span>
            View Details
        </button>
    </div>
`;
        return div;
    }
});

// Handle request actions
async function handleRequestRejected(requestId) {
    await fetch(`/adoption/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: "Rejected"
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                location.reload(); // Refresh the page to show updated status
            }
        })
        .catch(error => {
            console.error(`Error rejecting request:`, error);
        });
}

window.addEventListener("popstate", async function () {
    const requestId = sessionStorage.getItem('requestId');
    await fetch('/adoption/requestId', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: "Scheduled",
            nextMeetingDate: sessionStorage.getItem('dateTimeSelected')
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                location.reload(); // Refresh the page to show updated status
            }
        })
        .catch(error => {
            console.error(`Error schedule request:`, error);
        });
});

// View request details
function viewRequestDetails(requestId) {
    // Implement view details functionality
    console.log('Viewing details for request:', requestId);
}