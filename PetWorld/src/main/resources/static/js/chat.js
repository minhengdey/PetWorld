// DOM elements
const friendsContainer = document.getElementById("friends-container")
const messagesContainer = document.getElementById("messages-container")
const messageInput = document.getElementById("message-input")
const sendButton = document.getElementById("send-button")
const currentChatName = document.getElementById("current-chat-name")
const currentChatAvatar = document.getElementById("current-chat-avatar")

let currentFriend = null
let currentUser = null
let friends = []
let socket = new SockJS('/ws'); // Kết nối tới endpoint WebSocket
let stompClient = Stomp.over(socket);

// ✅ 1. Kết nối WebSocket (STOMP)
function connectWebSocket() {
    console.log('🔄 Đang kết nối WebSocket...');

    stompClient.connect({}, function (frame) {
        console.log('✅ WebSocket đã kết nối:', frame);
        stompClient.subscribe('/topic/messages', function (message) {
            const notification = JSON.parse(message.body);
            console.log('📩 Thông báo mới:', notification); // Hiển thị tất cả các tin nhắn nhận được
            renderMessages([notification]); // Cập nhật tin nhắn ngay lập tức
        });

    }, function (error) {
        console.error('❌ Lỗi WebSocket:', error);
        setTimeout(connectWebSocket, 5000); // Tự động kết nối lại sau 5s
    });
}

connectWebSocket(); // Kết nối ngay khi trang tải xong

// Load friends list
function loadFriends() {
    fetch('/api/auth/myInfo', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                currentUser = data.result;
                return fetch('/friendship/friends')
                    .then(response => response.json())
                    .then(data => {
                        const friendships = data.result
                        for (let friendship of friendships) {
                            if (friendship.pet1.id === currentUser.id) {
                                friends.push(friendship.pet2)
                            } else {
                                friends.push(friendship.pet1)
                            }
                        }
                        console.log(currentUser)
                        renderFriends(friends)
                    })
                    .catch((error) => {
                        console.error("Error loading friends:", error);
                        throw error;
                    });
            }
        })
        .catch(error => console.error("Error fetching user info:", error));
}

// Load chat messages
async function loadMessages(friend) {
    return await fetch(`/chat/messages/${friend.id}`)
        .then(response => response.json())
        .then(data => {
            return data.result; // Assumes API returns messages in the 'messages' property
        })
        .catch((error) => {
            console.error("Error loading messages:", error);
            throw error;
        });
}

// Send a message
function sendMessage(friend, text) {
    const messageData = {
        content: text,
        sender: currentUser,
        receiver: friend
    };


    return fetch(`/chat/send-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
    })
        .then(response => response.json())
        .then(data => {
            stompClient.send("/topic/messages", {}, JSON.stringify(data.result));
            return data.result; // Assumes API returns the sent message in the 'message' property
        })
        .catch((error) => {
            console.error("Error sending message:", error);
            throw error;
        });
}

// Get current time in format HH:MM AM/PM
function getCurrentTime(now) {
    let hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutesStr} ${ampm}`
}

// Render friends list
function renderFriends(friendsList) {
    friendsContainer.innerHTML = ""

    friendsList.forEach((friend) => {
        const friendElement = document.createElement("div")
        friendElement.className = "friend-item"
        friendElement.dataset.id = friend.id

        friendElement.classList.add("active")

        friendElement.innerHTML = `
      <img class="friend-avatar" src="${friend.avatar}" alt="${friend.name}">
      <div class="friend-info">
        <div class="friend-name">${friend.name}</div>
      </div>
    `

        friendElement.addEventListener("click", () => selectFriend(friend))

        friendsContainer.appendChild(friendElement)
    })
}

// Render chat messages
function renderMessages(messages) {
    messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${message.sender.id === currentUser.id ? "message-sent" : "message-received"}`;

        messageElement.innerHTML = `
            <div class="message-text">${message.content}</div>
            <div class="message-time">${getCurrentTime(new Date(message.createdAt))}</div>
        `;

        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Select a friend and load their chat
function selectFriend(friend) {
    // Update UI to show selected friend
    console.log(friend)
    currentFriend = friend
    currentChatName.textContent = friend.name
    currentChatAvatar.src = friend.avatar

    // Enable message input and send button
    messageInput.disabled = false
    sendButton.disabled = false

    // Update active friend in the list
    document.querySelectorAll(".friend-item").forEach((item) => {
        item.classList.remove("active")
    })
    document.querySelector(`.friend-item[data-id="${friend.id}"]`).classList.add("active")

    // Show loading state
    messagesContainer.innerHTML = '<div class="empty-chat-message">Loading messages...</div>'

    // Load and render messages
    loadMessages(friend)
        .then((messages) => {
            console.log(messages)
            renderMessages(messages)
        })
        .catch((error) => {
            console.error("Error loading messages:", error)
            messagesContainer.innerHTML = '<div class="empty-chat-message">Error loading messages. Please try again.</div>'
        })
}

// Handle sending a message
function handleSendMessage() {
    const text = messageInput.value.trim()
    console.log(text)

    if (text && currentFriend) {
        // Clear input
        messageInput.value = ""

        // Send message
        sendMessage(currentFriend, text)
            .then(() => {
                // Update the last message in the friends list
                const friendIndex = friends.findIndex((f) => f.id === currentFriend.id)
                if (friendIndex !== -1) {
                    friends[friendIndex].lastMessage = text
                    friends[friendIndex].lastMessageTime = getCurrentTime(new Date())
                    renderFriends(friends)
                }

                // Reload and render messages
                return loadMessages(currentFriend)
            })
            .then((messages) => {
                renderMessages(messages)
            })
            .catch((error) => {
                console.error("Error sending message:", error)
            })
    }
}

// Event listeners
sendButton.addEventListener("click", handleSendMessage)

messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSendMessage()
    }
})

const backButton = document.getElementById("back-button")

backButton.addEventListener("click", () => {
    window.location.href = '/home'
})

// Initialize the app
function initApp() {
    loadFriends()

}

connectWebSocket();
// Start the app
initApp()
