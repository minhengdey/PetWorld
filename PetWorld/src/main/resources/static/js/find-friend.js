document.addEventListener("DOMContentLoaded", () => {
    let currentPetIndex = 0;
    let pets = [];

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

    function createPetCard(pet) {
        const images = [pet.avatar, ...pet.gallery || []].filter(Boolean);
        const galleryDots = images.map((_, i) =>
            `<div class="gallery-dot ${i === 0 ? 'active' : ''}"></div>`
        ).join('');

        return `
                    <div class="discover-card" id="pet-${pet.id}">
                        <div class="gallery-container">
                            <div class="gallery-images" style="width: ${images.length * 50}%">
                                ${images.map(img => `
                                    <div class="gallery-image-wrapper">
                                        <img
                                            src="${img || '/placeholder.svg'}"
                                            alt="${pet.name}"
                                            class="discover-image"
                                            loading="lazy"
                                            onload="this.style.opacity = 1"
                                            style="opacity: 0; transition: opacity 0.3s ease"
                                        >
                                    </div>
                                `).join('')}
                            </div>
                            <div class="gallery-nav">
                                <button class="gallery-button prev" onclick="navigateGallery(${pet.id}, 'prev')">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="gallery-button next" onclick="navigateGallery(${pet.id}, 'next')">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <div class="gallery-dot-nav">
                                ${galleryDots}
                            </div>
                        </div>
                        <div class="discover-info">
                            <h2>${pet.name}</h2>
                            <p>
                                ${pet.breed} • ${pet.gender}<br>
                                ${pet.isNeutered ? 'Neutered' : 'Not Neutered'} • ${pet.species}
                            </p>
                        </div>
                        <div class="discover-actions">
                            <button class="action-button dislike" onclick="handleSwipe('left', ${pet.id})">
                                <i class="fas fa-times"></i>
                            </button>
                            <button class="action-button like" onclick="handleSwipe('right', ${pet.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="action-button superlike" onclick="handleSwipe('super', ${pet.id})">
                                <i class="fas fa-star"></i>
                            </button>
                        </div>
                    </div>
                `;
    }

    // Add gallery navigation function
    window.navigateGallery = function(petId, direction) {
        const card = document.getElementById(`pet-${petId}`);
        const images = card.querySelector('.gallery-images');
        const dots = card.querySelectorAll('.gallery-dot');
        const totalImages = dots.length;
        let currentImage = parseInt(images.style.transform?.match(/-?\d+/)?.[0] || '0') / 100 || 0;

        if (direction === 'next' && Math.abs(currentImage) < totalImages - 1) {
            currentImage--;
        } else if (direction === 'prev' && currentImage < 0) {
            currentImage++;
        }

        images.style.transform = `translateX(${currentImage * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.abs(currentImage));
        });
    };

    async function handleSwipe(direction, petId) {
        const card = document.getElementById(`pet-${petId}`);
        if (direction === 'left') {
            card.classList.add('swiped-left');
        } else {
            const response = await fetch(`/friendship/${petId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            card.classList.add('swiped-right');
        }

        setTimeout(() => {
            card.remove();
            currentPetIndex++;
            if (currentPetIndex < pets.length) {
                const container = document.querySelector('.discover-container');
                container.insertAdjacentHTML('beforeend', createPetCard(pets[currentPetIndex]));
            } else {
                const container = document.querySelector('.discover-container');
                container.innerHTML = '<div class="loading">No more pets to show</div>';
            }
        }, 500);
    }

    async function loadDiscover() {
        const container = document.querySelector('.discover-container');
        try {
            const response = await fetchData("/pet/friend-suggestions");
            if (response.error) throw new Error(response.message);

            pets = response.result;
            if (pets.length > 0) {
                container.innerHTML = createPetCard(pets[0]);
            } else {
                container.innerHTML = '<div class="loading">No pets found</div>';
            }
        } catch (error) {
            container.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading pets: ${error.message}</p>
                    </div>
                `;
        }
    }

    // Make handleSwipe available globally
    window.handleSwipe = handleSwipe;

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

            loadDiscover();
        });
    });

    // Initial load
    loadDiscover();
});