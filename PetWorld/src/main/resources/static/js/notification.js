document.addEventListener('DOMContentLoaded', function() {
    const notificationBell = document.getElementById('notificationBell');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const notificationsList = document.getElementById('notificationsList');
    const notificationCount = document.getElementById('notificationCount');
    const markAllReadBtn = document.getElementById('markAllRead');

    let stompClient = null;
    let socket = null;

    // ✅ 1. Connect WebSocket (STOMP)
    function connectWebSocket() {
        console.log('🔄 Connecting to WebSocket...');
        socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function(frame) {
            console.log('✅ WebSocket connected:', frame);
            stompClient.subscribe('/topic/notifications', function(message) {
                const notification = JSON.parse(message.body);
                console.log('📩 New notification:', notification);
                showRealtimeNotification(notification);
            });
        }, function(error) {
            console.error('❌ WebSocket error:', error);
            setTimeout(connectWebSocket, 5000);
        });
    }

    connectWebSocket();

    // ✅ 2. Toggle dropdown when clicking the bell
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationsDropdown.classList.toggle('show');

        if (notificationsDropdown.classList.contains('show')) {
            fetchNotifications();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationsDropdown.contains(e.target) && e.target !== notificationBell) {
            notificationsDropdown.classList.remove('show');
        }
    });

    // ✅ 3. Fetch notifications from API
    function fetchNotifications() {
        fetch('/notification/get-all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1000) {
                    updateNotifications(data.result);
                }
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }

    // ✅ 4. Update notifications UI
    function updateNotifications(notifications) {
        const unreadCount = notifications.filter(n => !n.isRead).length;

        if (unreadCount > 0) {
            notificationCount.textContent = unreadCount > 99 ? '99+' : unreadCount;
            notificationCount.style.display = 'flex';
        } else {
            notificationCount.style.display = 'none';
        }

        notificationsList.innerHTML = '';

        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="no-notifications">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }

        notifications.forEach(notification => {
            const notificationClass = notification.isRead ? 'notification-item' : 'notification-item unread';
            const formattedDate = formatDate(notification.createdAt);

            // Determine notification type and icon
            let iconSvg = '';
            let notificationType = notification.type || 'system';

            switch(notificationType.toLowerCase()) {
                case 'appointment':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>`;
                    break;
                case 'reminder':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>`;
                    break;
                case 'message':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>`;
                    break;
                default:
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>`;
            }

            const notificationItem = document.createElement('div');
            notificationItem.className = notificationClass;
            notificationItem.dataset.id = notification.id;
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    ${iconSvg}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title || 'Notification'}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${formattedDate}
                    </div>
                </div>
            `;

            notificationItem.addEventListener('click', function() {
                markAsRead(notification.id);
                notificationItem.classList.remove('unread');
                if (notification.path) {
                    window.location.href = notification.path;
                }
            });

            notificationsList.appendChild(notificationItem);
        });
    }

    // ✅ 5. Mark a notification as read
    function markAsRead(notificationId) {
        fetch(`/notification/mark-as-read/${notificationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => fetchNotifications())
            .catch(error => console.error('Error marking notification as read:', error));
    }

    // ✅ 6. Mark all notifications as read
    markAllReadBtn.addEventListener('click', function() {
        fetch('/notification/read-all', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => {
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                fetchNotifications();
            })
            .catch(error => console.error('Error marking all notifications as read:', error));
    });

    // ✅ 7. Handle real-time notifications from WebSocket
    function showRealtimeNotification(notification) {
        // Determine notification type and icon
        let iconSvg = '';
        let notificationType = notification.type || 'system';

        switch(notificationType.toLowerCase()) {
            case 'appointment':
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>`;
                break;
            case 'reminder':
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>`;
                break;
            case 'message':
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`;
                break;
            default:
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>`;
        }

        const formattedDate = formatDate(notification.createdAt);

        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item unread';
        notificationItem.dataset.id = notification.id;
        notificationItem.innerHTML = `
            <div class="notification-icon">
                ${iconSvg}
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title || 'Notification'}</div>
                <div class="notification-message">${notification.message || notification.content}</div>
                <div class="notification-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${formattedDate}
                </div>
            </div>
        `;

        notificationItem.addEventListener('click', function() {
            markAsRead(notification.id);
            notificationItem.classList.remove('unread');
            if (notification.path) {
                window.location.href = notification.path;
            }
        });

        notificationsList.prepend(notificationItem);

        // Update notification count
        const currentCount = parseInt(notificationCount.textContent || '0');
        const newCount = currentCount + 1;
        notificationCount.textContent = newCount > 99 ? '99+' : newCount;
        notificationCount.style.display = 'flex';
    }

    // Format date to relative time (e.g., "2 hours ago")
    function formatDate(dateString) {
        const date = new Date(dateString);
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
        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }

        return date.toLocaleDateString();
    }

    // Initial data fetch
    fetchNotifications();
});