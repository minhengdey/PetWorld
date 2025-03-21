document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Mobile menu button
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
        });
    }

    // Tab navigation
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show selected section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId + '-section') {
                    section.classList.add('active');
                    // Update header title
                    document.querySelector('.header-left h1').textContent = this.querySelector('.nav-text').textContent;
                }
            });

            // On mobile, collapse sidebar after selection
            if (window.innerWidth < 992) {
                sidebar.classList.remove('expanded');
            }

            // Load data for the selected section
            loadSectionData(sectionId);
        });
    });

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-btn');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('open');
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('open');
            }
        });
    });

    // Status tabs
    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabGroup = this.closest('.status-tabs');
            tabGroup.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const status = this.getAttribute('data-status');
            // Filter data based on status
            if (this.closest('#adoptions-section')) {
                filterAdoptionsByStatus(status);
            } else if (this.closest('#reports-section')) {
                const tabType = this.textContent.toLowerCase();
                filterReportsByType(tabType);
            }
        });
    });

    // Initial data load
    loadInitialData();

    // Settings save buttons
    const saveSettingsButtons = document.querySelectorAll('.save-settings-btn');
    saveSettingsButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Settings saved successfully!');
        });
    });

    const sendNotificationBtn = document.querySelector('.send-notification-btn');
    if (sendNotificationBtn) {
        sendNotificationBtn.addEventListener('click', function() {
            const title = document.getElementById('notification-title').value;
            const message = document.getElementById('notification-message').value;
            if (title && message) {
                alert('Notification sent successfully!');
                document.getElementById('notification-title').value = '';
                document.getElementById('notification-message').value = '';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
});

function loadInitialData() {
    // Load dashboard stats and charts
    loadDashboardStats();
    createUserActivityChart();
    createUserDistributionChart();

    // Load data for the active section
    const activeNavItem = document.querySelector('.sidebar-nav li.active');
    if (activeNavItem) {
        const section = activeNavItem.getAttribute('data-section');
        loadSectionData(section);
    }
}

function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardStats();
            loadRecentActivities();
            break;
        case 'users':
            loadUsers();
            break;
        case 'pets':
            loadPets();
            break;
        case 'adoptions':
            loadAdoptions();
            break;
        case 'services':
            loadServices();
            break;
        case 'reports':
            loadReports();
            break;
        // Add other sections as needed
    }
}

async function loadDashboardStats() {
    try {
        // User count
        const usersResponse = await fetch('/admin/users');
        const usersData = await usersResponse.json();
        if (usersData.code === 1000) {
            document.getElementById('user-count').textContent = usersData.result.length;
        }

        // Pet count
        const petsResponse = await fetch('/admin/pets');
        const petsData = await petsResponse.json();
        if (petsData.code === 1000) {
            document.getElementById('pet-count').textContent = petsData.result.length;
        }

        // Adoption count (pending only)
        const adoptionsResponse = await fetch('/admin/adoptions');
        const adoptionsData = await adoptionsResponse.json();
        if (adoptionsData.code === 1000) {
            const pendingAdoptions = adoptionsData.result.filter(adoption =>
                adoption.status === 'PENDING');
            document.getElementById('adoption-count').textContent = pendingAdoptions.length;
        }

        // Service count
        const servicesResponse = await fetch('/admin/services');
        const servicesData = await servicesResponse.json();
        if (servicesData.code === 1000) {
            document.getElementById('service-count').textContent = servicesData.result.length;
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentActivities() {
    try {
        // Combine recent activities from different sources
        const [usersResponse, petsResponse, adoptionsResponse] = await Promise.all([
            fetch('/admin/users'),
            fetch('/admin/pets'),
            fetch('/admin/adoptions')
        ]);

        const [usersData, petsData, adoptionsData] = await Promise.all([
            usersResponse.json(),
            petsResponse.json(),
            adoptionsResponse.json()
        ]);

        if (usersData.code === 1000 && petsData.code === 1000 && adoptionsData.code === 1000) {
            // Create activities from the most recent data
            const activities = [];

            // Add recent user registrations
            usersData.result.slice(0, 3).forEach(user => {
                activities.push({
                    type: 'user',
                    icon: 'person',
                    iconBg: '#e8f5e9',
                    iconColor: '#2e7d32',
                    text: `${user.name} registered as a new user`,
                    time: new Date(user.createdAt)
                });
            });

            // Add recent pet registrations
            petsData.result.slice(0, 3).forEach(pet => {
                activities.push({
                    type: 'pet',
                    icon: 'pets',
                    iconBg: '#e3f2fd',
                    iconColor: '#1565c0',
                    text: `${pet.name} was registered as a new pet`,
                    time: new Date(pet.createdAt)
                });
            });

            // Add recent adoption requests
            adoptionsData.result.slice(0, 3).forEach(adoption => {
                activities.push({
                    type: 'adoption',
                    icon: 'favorite',
                    iconBg: '#fff3e0',
                    iconColor: '#e65100',
                    text: `New adoption request for ${adoption.pet ? adoption.pet.name : 'a pet'}`,
                    time: new Date(adoption.createdAt)
                });
            });

            // Sort activities by time (newest first)
            activities.sort((a, b) => b.time - a.time);

            // Display activities
            const activityList = document.getElementById('recent-activities');
            if (activities.length > 0) {
                activityList.innerHTML = '';
                activities.slice(0, 5).forEach(activity => {
                    activityList.innerHTML += `
                        <div class="activity-item">
                            <div class="activity-icon" style="background-color: ${activity.iconBg}">
                                <span class="material-symbols-outlined" style="color: ${activity.iconColor}">${activity.icon}</span>
                            </div>
                            <div class="activity-content">
                                <p class="activity-text">${activity.text}</p>
                                <p class="activity-time">${formatTimeAgo(activity.time)}</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                activityList.innerHTML = `
                    <div class="activity-empty">
                        <span class="material-symbols-outlined">history</span>
                        <p>No recent activities</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading recent activities:', error);
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    // For older dates, just return the formatted date
    return date.toLocaleDateString();
}

async function loadUsers() {
    try {
        const response = await fetch('/admin/users');
        const data = await response.json();

        if (data.code === 1000) {
            const users = data.result;
            const tableBody = document.getElementById('users-table-body');

            if (users.length > 0) {
                tableBody.innerHTML = '';

                users.forEach(user => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <span class="status-badge ${user.isDeleted ? 'disabled' : 'active'}">
                                    ${user.isDeleted ? 'Disabled' : 'Active'}
                                </span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="action-btn view-btn" onclick="viewUser(${user.id})">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                    <button class="action-btn edit-btn" onclick="editUser(${user.id})">
                                        <span class="material-symbols-outlined">edit</span>
                                    </button>
                                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                                        <span class="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">No users found</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-table-body').innerHTML =
            '<tr><td colspan="6" class="loading-cell">Error loading users</td></tr>';
    }
}

function viewUser(id) {
    console.log('View user:', id);
    // Implement view user functionality
}

function editUser(id) {
    console.log('Edit user:', id);
    // Get user data and populate modal
    const modal = document.getElementById('edit-user-modal');
    modal.classList.add('open');

    // In a real implementation, you would fetch the specific user data
    // and populate the form fields
    document.getElementById('edit-user-name').value = 'User ' + id;
    document.getElementById('edit-user-email').value = 'user' + id + '@example.com';

    // Set up save button
    document.getElementById('save-user-btn').onclick = function() {
        // In a real implementation, you would send the updated data to the server
        alert('User updated successfully!');
        modal.classList.remove('open');
        loadUsers(); // Reload user data
    };
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        console.log('Delete user:', id);
        // In a real implementation, you would send a delete request to the server
        alert('User deleted successfully!');
        loadUsers(); // Reload user data
    }
}

async function loadPets() {
    try {
        const response = await fetch('/admin/pets');
        const data = await response.json();

        if (data.code === 1000) {
            const pets = data.result;
            const tableBody = document.getElementById('pets-table-body');

            if (pets.length > 0) {
                tableBody.innerHTML = '';

                pets.forEach(pet => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${pet.id}</td>
                            <td>${pet.name}</td>
                            <td>${pet.petOwner ? pet.petOwner.name : pet.petCenter.name}</td>
                            <td>${pet.species}</td>
                            <td>${pet.breed}</td>
                            <td>
                                <span class="status-badge ${pet.isAdopted ? 'disabled' : 'active'}">
                                    ${pet.isAdopted ? 'Adopted' : 'Available'}
                                </span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="action-btn view-btn" onclick="viewPet(${pet.id})">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                    <button class="action-btn edit-btn" onclick="editPet(${pet.id})">
                                        <span class="material-symbols-outlined">edit</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="7" class="loading-cell">No pets found</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error loading pets:', error);
        document.getElementById('pets-table-body').innerHTML =
            '<tr><td colspan="7" class="loading-cell">Error loading pets</td></tr>';
    }
}

function viewPet(id) {
    console.log('View pet:', id);
    // Implement view pet functionality
}

function editPet(id) {
    console.log('Edit pet:', id);
    // Implement edit pet functionality
}

async function loadAdoptions() {
    try {
        const response = await fetch('/admin/adoptions');
        const data = await response.json();

        if (data.code === 1000) {
            const adoptions = data.result;

            // Store adoptions for filtering
            window.allAdoptions = adoptions;

            // Filter based on active tab
            const activeTab = document.querySelector('#adoptions-section .status-tab.active');
            if (activeTab) {
                const status = activeTab.getAttribute('data-status');
                filterAdoptionsByStatus(status);
            } else {
                displayAdoptions(adoptions);
            }
        }
    } catch (error) {
        console.error('Error loading adoptions:', error);
        document.getElementById('adoptions-table-body').innerHTML =
            '<tr><td colspan="6" class="loading-cell">Error loading adoption requests</td></tr>';
    }
}

function filterAdoptionsByStatus(status) {
    if (!window.allAdoptions) return;

    let filteredAdoptions;

    if (status === 'pending') {
        filteredAdoptions = window.allAdoptions.filter(a => a.status === 'PENDING');
    } else if (status === 'approved') {
        filteredAdoptions = window.allAdoptions.filter(a => a.status === 'APPROVED');
    } else if (status === 'rejected') {
        filteredAdoptions = window.allAdoptions.filter(a => a.status === 'REJECTED');
    } else {
        filteredAdoptions = window.allAdoptions;
    }

    displayAdoptions(filteredAdoptions);
}

function displayAdoptions(adoptions) {
    const tableBody = document.getElementById('adoptions-table-body');

    if (adoptions.length > 0) {
        tableBody.innerHTML = '';

        adoptions.forEach(adoption => {
            tableBody.innerHTML += `
                <tr>
                    <td>${adoption.id}</td>
                    <td>${adoption.pet ? adoption.pet.name : 'N/A'}</td>
                    <td>${adoption.petOwner ? adoption.petOwner.name : 'N/A'}</td>
                    <td>${new Date(adoption.createdAt).toLocaleDateString()}</td>
                    <td>
                        <span class="status-badge ${getStatusClass(adoption.status)}">
                            ${adoption.status}
                        </span>
                    </td>
                    <td>
                        <div class="action-cell">
                            <button class="action-btn view-btn" onclick="viewAdoption(${adoption.id})">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">No adoption requests found</td></tr>';
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'PENDING':
            return 'pending';
        case 'APPROVED':
            return 'active';
        case 'REJECTED':
            return 'disabled';
        default:
            return '';
    }
}

function viewAdoption(id) {
    console.log('View adoption:', id);
    // Get adoption data
    const adoption = window.allAdoptions?.find(a => a.id === id);
    if (!adoption) return;

    // Populate adoption details modal
    const modal = document.getElementById('view-adoption-modal');
    const detailsContainer = document.getElementById('adoption-details');

    detailsContainer.innerHTML = `
        <div class="form-group">
            <label>Adoption ID</label>
            <p>${adoption.id}</p>
        </div>
        <div class="form-group">
            <label>Pet</label>
            <p>${adoption.pet ? adoption.pet.name : 'N/A'}</p>
        </div>
        <div class="form-group">
            <label>Requester</label>
            <p>${adoption.petOwner ? adoption.petOwner.name : 'N/A'}</p>
        </div>
        <div class="form-group">
            <label>Request Date</label>
            <p>${new Date(adoption.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="form-group">
            <label>Status</label>
            <p>${adoption.status}</p>
        </div>
        <div class="form-group">
            <label>Adoption Reason</label>
            <p>${adoption.adoptionReason || 'No reason provided'}</p>
        </div>
        <div class="form-group">
            <label>Has Owned Pets Before</label>
            <p>${adoption.hasOwnedPetsBefore ? 'Yes' : 'No'}</p>
        </div>
        <div class="form-group">
            <label>Pet Experience</label>
            <p>${adoption.petExperience || 'No experience details provided'}</p>
        </div>
        <div class="form-group">
            <label>Residence Type</label>
            <p>${adoption.residenceType || 'Not specified'}</p>
        </div>
    `;

    // Show/hide approve/reject buttons based on status
    const approveBtn = document.getElementById('approve-adoption-btn');
    const rejectBtn = document.getElementById('reject-adoption-btn');

    if (adoption.status === 'PENDING') {
        approveBtn.style.display = 'block';
        rejectBtn.style.display = 'block';

        approveBtn.onclick = function() {
            approveAdoption(adoption.id);
            modal.classList.remove('open');
        };

        rejectBtn.onclick = function() {
            rejectAdoption(adoption.id);
            modal.classList.remove('open');
        };
    } else {
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
    }

    modal.classList.add('open');
}

function approveAdoption(id) {
    console.log('Approve adoption:', id);
    // In a real implementation, you would send an approval request to the server
    alert('Adoption approved successfully!');
    loadAdoptions(); // Reload adoption data
}

function rejectAdoption(id) {
    console.log('Reject adoption:', id);
    // In a real implementation, you would send a rejection request to the server
    alert('Adoption rejected successfully!');
    loadAdoptions(); // Reload adoption data
}

async function loadServices() {
    try {
        const response = await fetch('/admin/services');
        const data = await response.json();

        if (data.code === 1000) {
            const services = data.result;
            const tableBody = document.getElementById('services-table-body');

            if (services.length > 0) {
                tableBody.innerHTML = '';

                services.forEach(service => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${service.id}</td>
                            <td>${service.name}</td>
                            <td>${service.petCareServices ? service.petCareServices.name : 'N/A'}</td>
                            <td>$${service.price}</td>
                            <td>${service.usedCount || 0} times</td>
                            <td>
                                <span class="status-badge ${service.isDeleted ? 'disabled' : 'active'}">
                                    ${service.isDeleted ? 'Inactive' : 'Active'}
                                </span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="action-btn view-btn" onclick="viewService(${service.id})">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                    <button class="action-btn edit-btn" onclick="editService(${service.id})">
                                        <span class="material-symbols-outlined">edit</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="7" class="loading-cell">No services found</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('services-table-body').innerHTML =
            '<tr><td colspan="7" class="loading-cell">Error loading services</td></tr>';
    }
}

function viewService(id) {
    console.log('View service:', id);
    // Implement view service functionality
}

function editService(id) {
    console.log('Edit service:', id);
    // Implement edit service functionality
}

async function loadReports() {
    // For demo purposes, we'll display sample data
    // In a real implementation, you would fetch reports from the server
    const tableBody = document.getElementById('reports-table-body');

    // Sample reports data
    const reports = [
        {
            id: 1,
            reportedBy: 'John Doe',
            type: 'Inappropriate Content',
            content: 'Reported a pet image with inappropriate content',
            date: '2023-05-15',
            status: 'Pending'
        },
        {
            id: 2,
            reportedBy: 'Jane Smith',
            type: 'Scam',
            content: 'Reported a user for potential scam activity',
            date: '2023-05-10',
            status: 'Resolved'
        },
        {
            id: 3,
            reportedBy: 'Mike Johnson',
            type: 'Harassment',
            content: 'Reported harassment in chat messages',
            date: '2023-05-08',
            status: 'Under Review'
        }
    ];

    if (reports.length > 0) {
        tableBody.innerHTML = '';

        reports.forEach(report => {
            tableBody.innerHTML += `
                <tr>
                    <td>${report.id}</td>
                    <td>${report.reportedBy}</td>
                    <td>${report.type}</td>
                    <td>${report.content}</td>
                    <td>${report.date}</td>
                    <td>
                        <span class="status-badge ${getReportStatusClass(report.status)}">
                            ${report.status}
                        </span>
                    </td>
                    <td>
                        <div class="action-cell">
                            <button class="action-btn view-btn">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="action-btn edit-btn">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="7" class="loading-cell">No reports found</td></tr>';
    }
}

function getReportStatusClass(status) {
    switch(status) {
        case 'Pending':
            return 'pending';
        case 'Resolved':
            return 'active';
        case 'Under Review':
            return 'pending';
        default:
            return '';
    }
}

function filterReportsByType(type) {
    console.log('Filter reports by type:', type);
    // Implement report filtering by type
    loadReports();
}

function createUserActivityChart() {
    const ctx = document.getElementById('userActivityChart').getContext('2d');

    // Sample data for user activity
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'New Users',
                data: [5, 8, 6, 9, 12, 8, 7],
                backgroundColor: '#8B5CF6',
                borderColor: '#8B5CF6',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'New Pets',
                data: [3, 4, 5, 6, 8, 9, 5],
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

function createUserDistributionChart() {
    const ctx = document.getElementById('userDistributionChart').getContext('2d');

    // Sample data for user distribution
    const data = {
        labels: ['Pet Owners', 'Veterinarians', 'Admins'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B'],
            borderWidth: 0,
            hoverOffset: 5
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '65%'
        }
    };

    new Chart(ctx, config);
}
