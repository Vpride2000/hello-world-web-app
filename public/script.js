let isEditMode = false;
let originalData = [];

function enableEdit() {
    isEditMode = true;
    const table = document.getElementById('dataTable');
    const cells = table.querySelectorAll('tbody td');
    
    // Save original data
    originalData = Array.from(cells).map(cell => cell.textContent);
    
    // Convert cells to input fields
    cells.forEach(cell => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell.textContent;
        cell.textContent = '';
        cell.appendChild(input);
    });
    
    // Toggle buttons visibility
    document.getElementById('editBtn').classList.add('hidden');
    document.getElementById('saveBtn').classList.remove('hidden');
    document.getElementById('cancelBtn').classList.remove('hidden');
}

function saveChanges() {
    const table = document.getElementById('dataTable');
    const cells = table.querySelectorAll('tbody td');
    
    // Convert inputs back to text
    cells.forEach(cell => {
        const input = cell.querySelector('input');
        if (input) {
            const value = input.value;
            cell.textContent = value;
        }
    });
    
    isEditMode = false;
    
    // Toggle buttons visibility
    document.getElementById('editBtn').classList.remove('hidden');
    document.getElementById('saveBtn').classList.add('hidden');
    document.getElementById('cancelBtn').classList.add('hidden');
    
    // Show notification
    alert('✅ Данные успешно сохранены!');
}

function cancelEdit() {
    const table = document.getElementById('dataTable');
    const cells = table.querySelectorAll('tbody td');
    
    // Restore original data
    cells.forEach((cell, index) => {
        cell.textContent = originalData[index];
    });
    
    isEditMode = false;
    
    // Toggle buttons visibility
    document.getElementById('editBtn').classList.remove('hidden');
    document.getElementById('saveBtn').classList.add('hidden');
    document.getElementById('cancelBtn').classList.add('hidden');
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId + '-page').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Initialize map when map page is shown
    if (pageId === 'map') {
        setTimeout(initMap, 100);
    }
}

function initMap() {
    // Check if map is already initialized
    if (window.mapInitialized) return;
    
    // Coordinates for center of Russia
    const russiaCenter = [61.5240, 105.3188];
    
    // Create map
    const map = L.map('map').setView(russiaCenter, 4);
    window.mapObject = map;
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add marker at center
    L.marker(russiaCenter).addTo(map)
        .bindPopup('<b>Центр России</b><br/>Россия')
        .openPopup();
            // Add markers for Tyumen and Ekaterinburg
    const tyumenCoords = [57.1522, 65.5272];
    L.marker(tyumenCoords).addTo(map)
        .bindPopup('<b>Тюмень</b><br/>Россия');
    
    const ekaterinburgCoords = [56.8389, 60.6057];
    L.marker(ekaterinburgCoords).addTo(map)
        .bindPopup('<b>Екатеринбург</b><br/>Россия');
    
    
    window.mapInitialized = true;
}

function goToCity(cityId, lat, lng, zoomLevel = 10) {
    // If map is not initialized, initialize it first
    if (!window.mapObject) {
        setTimeout(() => goToCity(cityId, lat, lng, zoomLevel), 100);
        return;
    }
    
    // Center map on the city and zoom in
    window.mapObject.setView([lat, lng], zoomLevel);
}

function updateDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const now = new Date();
    const dateString = now.toLocaleDateString('ru-RU', options);
    document.getElementById('dateDisplay').textContent = dateString;
}

// Update date on load
updateDate();

// Update date every second
setInterval(updateDate, 1000);
