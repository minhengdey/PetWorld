document.addEventListener('DOMContentLoaded', function() {
    const billsContainer = document.querySelector('.bills-container');
    const searchInput = document.querySelector('.search-box input');
    const newBillBtn = document.querySelector('.new-bill-btn');
    const modal = document.getElementById('billDetailsModal');
    const closeModal = document.getElementById('closeBillDetailsModal');

    // Close modal when clicking X
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // Fetch bills data
    function fetchBills() {
        fetch('/appointment/my-appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    renderBills(data.result);
                } else {
                    console.error('Failed to fetch bills');
                }
            })
            .catch(error => {
                console.error('Error fetching bills:', error);
                billsContainer.innerHTML = '<div class="error-message">Error loading bills. Please try again later.</div>';
            });
    }

    // Show bill details
    function showBillDetails(bill) {
        document.getElementById('detailsBillNumber').textContent = bill.id;
        document.getElementById('detailsCustomerName').textContent = bill.pet.name;
        document.getElementById('detailsDate').textContent = new Date(bill.preferredDateTime).toLocaleDateString();
        document.getElementById('detailsAmount').textContent = `$${bill.service.price.toFixed(2)}`;
        document.getElementById('detailsStatus').textContent = bill.status;
        document.getElementById('detailsNote').textContent = bill.specialNotes;
        modal.style.display = "block";
    }

    // Render bills to the container
    function renderBills(bills) {
        console.log(bills);
        billsContainer.innerHTML = bills.map(bill => `
                        <div class="bill-card" onclick="showBillDetails(${JSON.stringify(bill).replace(/"/g, '&quot;')})">
                            <div class="bill-header">
                                <div class="bill-info">
                                    <h3>${bill.service.name}</h3>
                                    <span class="status-badge ${bill.status.toLowerCase}">${bill.status}</span>
                                </div>
                                <div class="bill-actions">
                                    <button class="action-btn print" onclick="event.stopPropagation(); handlerBill('${bill.id}', 'Accepted')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                    </button>
                                    <button class="action-btn edit" onclick="event.stopPropagation(); handlerBill('${bill.id}', 'Rejected')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="bill-content">
                    <div class="bill-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>${bill.pet.name}</span>
                    </div>
                    <div class="bill-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                            <line x1="16" x2="16" y1="2" y2="6"/>
                            <line x1="8" x2="8" y1="2" y2="6"/>
                            <line x1="3" x2="21" y1="10" y2="10"/>
                        </svg>
                        <span>${new Date(bill.preferredDateTime).toLocaleString()}</span>
                    </div>
                    <div class="bill-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M16 8h-6a2 2 0 1 0-2 2h8"/>
                        </svg>
                        <span>$${bill.service.price.toFixed(2)}</span>
                    </div>
                    <a href="/user-profile" class="pet-owner-link">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span class="detail-text">${bill.pet.petOwner.name}</span>
                    </a>
                </div>
                        </div>
                    `).join('');
    }

    // Make showBillDetails available globally
    window.showBillDetails = showBillDetails;

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const billCards = document.querySelectorAll('.bill-card');

        billCards.forEach(card => {
            const billNumber = card.querySelector('h3').textContent.toLowerCase();
            const customerName = card.querySelector('.bill-detail span').textContent.toLowerCase();

            if (billNumber.includes(searchTerm) || customerName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    window.handlerBill = async function(billId, ans, event) {
        if (event) event.stopPropagation();
        if (!confirm(`Are you sure you want to ${ans} this appointment?`)) return;

        try {
            const response = await fetch(`/appointment/${billId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    preferredDateTime: null,
                    idPet: null,
                    specialNotes: null,
                    status: ans
                })
            });
            if (!response.ok) throw new Error('Network response was not ok');

            await fetchBills();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Initial fetch
    fetchBills();
});