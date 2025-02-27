document.addEventListener('DOMContentLoaded', async function() {
    let petId;
    // Fetch user info
    await fetch('/api/auth/myInfo', {
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

                petId = data.result.id;
                initialize();

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
    let allFriends = [];
    const searchInput = document.getElementById('searchInput');
    const friendsGrid = document.getElementById('friendsGrid');
    async function fetchFriends() {
        try {
            const response = await fetch('/friendship/friends');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log(data.result);
            return data.result;
        } catch (error) {
            console.error("Fetch error:", error);
            return { error: true, message: error.message };
        }
    }
    function createFriendCard(friend) {
        return `
                    <div class="friend-card" id="friend-${friend.id}">
                        <img src="${friend.avatar}"
                             alt="${friend.name}"
                             class="friend-image"
                             loading="lazy">
                        <div class="friend-info">
                            <h3 class="friend-name">${friend.name}</h3>
                            <p class="friend-breed">${friend.breed} • ${friend.species}</p>
                            <div class="friend-actions">
                                <button class="action-button message-btn" onclick="handleMessage(${friend.id})">
                                    <i class="fas fa-comment"></i>
                                    Message
                                </button>
                                <button class="action-button unfriend-btn" onclick="handleUnfriend(${friend.id})">
                                    <i class="fas fa-user-times"></i>
                                    Unfriend
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    }
    function filterFriends(searchTerm) {
        const filtered = allFriends.filter(friend =>
            friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.species.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayFriends(filtered);
    }
    function displayFriends(friendships) {
        if (friendships.error) {
            friendsGrid.innerHTML = `
                        <div class="error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Error loading friends: ${friends.message}</p>
                        </div>
                    `;
            return;
        }
        if (friendships.length === 0) {
            friendsGrid.innerHTML = `
                        <div class="no-friends">
                            <i class="fas fa-user-friends"></i>
                            <p>No friends found</p>
                        </div>
                    `;
            return;
        }

        const friends = friendships.map(friendship => {
            console.log(petId);
            return friendship.pet1.id === petId ? friendship.pet2 : friendship.pet1;
        });

        friendsGrid.innerHTML = friends.map(friend => createFriendCard(friend)).join('');
    }
    window.handleMessage = function(friendId) {
        // Implement message functionality
        window.location.href = `/chat/${friendId}`;
    };
    window.handleUnfriend = async function(friendId) {
        const card = document.getElementById(`friend-${friendId}`);
        try {
            const response = await fetch(`/friendship/${friendId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Failed to unfriend');
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                allFriends = allFriends.filter(f => f.id !== friendId);
                if (allFriends.length === 0) {
                    displayFriends([]);
                }
            }, 300);
        } catch (error) {
            console.error("Error unfriending:", error);
        }
    };
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        filterFriends(e.target.value);
    });
    // Initial load
    async function initialize() {
        const friends = await fetchFriends();
        allFriends = friends;
        displayFriends(friends);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const switchToOwner = document.getElementById('switch-to-owner');
    switchToOwner.onclick = async function(event) {
        try {
            const response = await fetch(`/api/auth/switch-to-owner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                window.location.href = '/home';
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
})