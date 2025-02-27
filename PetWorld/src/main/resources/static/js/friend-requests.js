document.addEventListener("DOMContentLoaded", async () => {
    let receivedRequests = [];
    let sentRequests = [];
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return { error: true, message: error.message };
        }
    }
    function createRequestCard(request, type) {
        return `
                <div class="request-card" id="request-${request.id}">
                    <div class="request-content">
                        <div class="request-image">
                            <img src="${request.pet1.avatar || '/images/default-pet.png'}"
                                 alt="${request.pet1.name}"
                                 loading="lazy"
                                 onload="this.style.opacity = 1">
                        </div>
                        <div class="request-info">
                            <h3>${request.pet1.name}</h3>
                            <p>${request.pet1.breed} • ${request.pet1.species}</p>
                        </div>
                    </div>
                    ${type === 'received' ? `
                        <div class="request-actions">
                            <button class="action-button accept" onclick="handleRequest(${request.id}, true)">
                                <i class="fas fa-check"></i>
                                Accept
                            </button>
                            <button class="action-button reject" onclick="handleRequest(${request.id}, false)">
                                <i class="fas fa-times"></i>
                                Reject
                            </button>
                        </div>
                    ` : `
                        <button class="action-button cancel" onclick="handleRequest(${request.id}, 'cancel')">
                            <i class="fas fa-times"></i>
                            Cancel Request
                        </button>
                    `}
                </div>
            `;
    }
    async function loadRequests(type) {
        const container = document.querySelector(`#${type} .requests-container`);
        try {
            const res = await fetch(`/friendship/friend-requests`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const response = await res.json();
            if (response.error) throw new Error(response.message);
            const requests = response.result;
            if (requests.length > 0) {
                container.innerHTML = requests
                    .map(request => createRequestCard(request, type))
                    .join('');
            } else {
                container.innerHTML = `
                        <div class="no-requests">
                            <i class="fas fa-inbox"></i>
                            <p>No ${type} requests</p>
                        </div>
                    `;
            }
        } catch (error) {
            container.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading requests: ${error.message}</p>
                    </div>
                `;
        }
    }
    window.handleRequest = async function(requestId, isAccepted) {
        const card = document.getElementById(`request-${requestId}`);
        try {
            const response = await fetch(`/friendship/${requestId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(isAccepted)
            });

            if (!response.ok) throw new Error('Failed to process request');

            card.classList.add('fade-out');
            setTimeout(() => {
                card.remove();
                checkEmptyContainer();
            }, 300);
        } catch (error) {
            console.error("Error processing request:", error);
        }
    }
    function checkEmptyContainer() {
        const activeTab = document.querySelector('.tab-content.active');
        const container = activeTab.querySelector('.requests-container');
        if (!container.children.length) {
            const type = activeTab.id;
            container.innerHTML = `
                    <div class="no-requests">
                        <i class="fas fa-inbox"></i>
                        <p>No ${type} requests</p>
                    </div>
                `;
        }
    }
    // Tab switching
    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab-button").forEach(btn =>
                btn.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tab =>
                tab.classList.remove("active"));
            const tabName = button.getAttribute("data-tab");
            document.getElementById(tabName).classList.add("active");
            button.classList.add("active");
            loadRequests(tabName);
        });
    });
    // Initial load
    await loadRequests('received');
});