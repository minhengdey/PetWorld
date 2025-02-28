document.addEventListener("DOMContentLoaded", function () {
    const notificationBell = document.getElementById("notificationBell");
    const notificationsDropdown = document.getElementById("notificationsDropdown");
    let notificationCount = document.getElementById("notificationCount");
    const notificationsList = document.getElementById("notificationsList");
    const markAllReadBtn = document.getElementById("markAllRead");

    let stompClient = null;
    let socket = null;

    // ✅ 1. Kết nối WebSocket (STOMP)
    function connectWebSocket() {
        console.log('🔄 Đang kết nối WebSocket...');
        socket = new SockJS('/ws'); // Kết nối tới endpoint WebSocket
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('✅ WebSocket đã kết nối:', frame);
            stompClient.subscribe('/topic/notifications', function (message) {
                const notification = JSON.parse(message.body);
                console.log('📩 Thông báo mới:', notification);
                showRealtimeNotification(notification);
            });
        }, function (error) {
            console.error('❌ Lỗi WebSocket:', error);
            setTimeout(connectWebSocket, 5000); // Tự động kết nối lại sau 5s
        });
    }

    connectWebSocket(); // Kết nối ngay khi trang tải xong

    // ✅ 2. Toggle dropdown khi click chuông
    notificationBell.addEventListener("click", function () {
        notificationsDropdown.classList.toggle("show");
        if (notificationsDropdown.classList.contains("show")) {
            fetchNotifications(); // Fetch thông báo mỗi lần mở
        }
    });

    // ✅ 3. Fetch danh sách thông báo từ API
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

    // ✅ 4. Cập nhật UI thông báo
    function updateNotifications(notifications) {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        if (unreadCount > 0) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = "flex"; // Hiển thị
        } else {
            notificationCount.textContent = "";
            notificationCount.style.display = "none"; // Ẩn đi nếu không có thông báo
        }
        notificationsList.innerHTML = '';

        if (notifications.length === 0) {
            notificationsList.innerHTML = `<div class="no-notifications">No notifications</div>`;
            return;
        }

        notifications.forEach(notification => {
            const notificationItem = document.createElement("div");
            notificationItem.classList.add("notification-item");
            if (!notification.isRead) notificationItem.classList.add("unread");
            notificationItem.dataset.id = notification.id;
            notificationItem.innerHTML = `
                <div class="notification-message">${notification.message}</div>
                <div class="notification-date">${new Date(notification.createdAt).toLocaleString()}</div>
            `;
            notificationItem.addEventListener("click", function () {
                markAsRead(notification.id);
                notificationItem.classList.remove("unread");
                if (notification.path) {
                    window.location.href = notification.path; // Chuyển hướng nếu có URL
                }
            });
            notificationsList.appendChild(notificationItem);
        });
    }

    // ✅ 5. Đánh dấu 1 thông báo là đã đọc
    function markAsRead(notificationId) {
        fetch(`/notification/mark-as-read/${notificationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(() => fetchNotifications()); // Cập nhật lại danh sách thông báo
    }

    // ✅ 6. Đánh dấu tất cả thông báo là đã đọc
    markAllReadBtn.addEventListener("click", function () {
        fetch(`/notification/read-all`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(() => {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread'); // Xóa class unread
            });
            fetchNotifications();
        });
    });

    // ✅ 7. Nhận thông báo real-time từ WebSocket
    function showRealtimeNotification(notification) {
        const notificationItem = document.createElement("div");
        notificationItem.classList.add("notification-item", "unread");
        notificationItem.dataset.id = notification.id;
        notificationItem.innerHTML = `
            <div class="notification-message">${notification.content}</div>
            <div class="notification-date">${new Date(notification.createdAt).toLocaleString()}</div>
        `;
        notificationItem.addEventListener("click", function () {
            markAsRead(notification.id);
            notificationItem.classList.remove("unread");
            if (notification.path) {
                window.location.href = notification.path;
            }
        });

        notificationsList.prepend(notificationItem);
        notificationCount.textContent = parseInt(notificationCount.textContent || 0) + 1; // Tăng số lượng chưa đọc
    }

    connectWebSocket();
    fetchNotifications();
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
// Logout button functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    fetch('/api/auth/log-out', {
        method: 'POST',
        credentials: 'include', // Quan trọng: gửi cookie JWT kèm request
    })
        .then(response => {
            if (response.ok) {
                alert("Logout thành công!");
                window.location.href = "/"; // Quay về trang chính
            } else {
                alert("Logout thất bại!");
            }
        })
        .catch(error => console.error("Logout failed:", error));
});