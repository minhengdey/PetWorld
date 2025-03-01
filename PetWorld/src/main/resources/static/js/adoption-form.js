const petId = sessionStorage.getItem('selectedPetId');
// Fetch user info when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    fetch('/api/auth/myInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1000) {
                // Populate personal information fields
                document.getElementById('fullName').value = data.result.name || '';
                document.getElementById('phone').value = data.result.phone || '';
                document.getElementById('address').value = data.result.address || '';
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    document.getElementById('adoption-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const adoptionData = {
            hasOwnedPetsBefore: document.querySelector('input[name="hadPet"]:checked')?.value === "yes", // Chuyển thành Boolean
            petExperience: document.getElementById("petExperience").value.trim(),
            residenceType: document.querySelector("select").value,
            hasYard: document.getElementById("hasYard").checked,
            hasFence: document.getElementById("hasFence").checked,
            hasOtherPets: document.getElementById("hasOtherPets").checked,
            otherPetsDetails: document.getElementById("otherPetsDetails").value.trim(),
            adoptionReason: document.getElementById("adoptionReason").value.trim()
        };
        console.log(document.querySelector('input[name="hadPet"]:checked')?.value === "yes");
        try {
            const response = await fetch(`/adoption/${petId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adoptionData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                window.location.href = '/adopt-pets';
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    });
    document.getElementById('cancel-btn').addEventListener('click', function() {
        window.history.back();
    });
});