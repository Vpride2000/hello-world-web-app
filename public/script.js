let isEditMode = false;
let originalData = [];

function enableEdit() {
    isEditMode = true;
    const table = document.getElementById('dataTable');
    const rows = table.querySelectorAll('tbody tr');
    
    // Save original data
    originalData = [];
    
    // Convert cells in columns 2-7 to input fields (indices 1-6)
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        // Process columns 2-7 (indices 1-6)
        for (let i = 1; i <= 6; i++) {
            if (cells[i]) {
                originalData.push(cells[i].textContent);
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cells[i].textContent;
                cells[i].textContent = '';
                cells[i].appendChild(input);
            }
        }
    });
    
    // Toggle buttons visibility
    document.getElementById('editBtn').classList.add('hidden');
    document.getElementById('saveBtn').classList.remove('hidden');
    document.getElementById('cancelBtn').classList.remove('hidden');
}

function saveChanges() {
    const table = document.getElementById('dataTable');
    const rows = table.querySelectorAll('tbody tr');
    
    // Convert inputs back to text (only in columns 2-7)
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        for (let i = 1; i <= 6; i++) {
            if (cells[i]) {
                const input = cells[i].querySelector('input');
                if (input) {
                    const value = input.value;
                    cells[i].textContent = value;
                }
            }
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
    const rows = table.querySelectorAll('tbody tr');
    
    // Restore original data (only in columns 2-7)
    let dataIndex = 0;
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        for (let i = 1; i <= 6; i++) {
            if (cells[i] && dataIndex < originalData.length) {
                cells[i].textContent = originalData[dataIndex];
                dataIndex++;
            }
        }
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
