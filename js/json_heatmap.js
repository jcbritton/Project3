let map, heatLayer, fatalityMarkers, layerControl;
let allData = [];

document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([37.8, -96], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    layerControl = L.control.layers(null, null, { collapsed: false }).addTo(map);

    function loadHeatLayer() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.overrideMimeType("application/json");
            xhr.open('GET', 'data/ACLED.json', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        allData = JSON.parse(xhr.responseText);
                        resolve();
                    } else {
                        reject(new Error(`Failed to load data: ${xhr.status}`));
                    }
                }
            };
            xhr.onerror = () => reject(new Error('XHR error'));
            xhr.send(null);
        });
    }

    function createHeatmap() {
        const heatData = allData.map(row => {
            const lat = parseFloat(row.latitude);
            const lon = parseFloat(row.longitude);
            return [lat, lon, 1]; // Using a constant intensity of 1
        }).filter(point => !isNaN(point[0]) && !isNaN(point[1]));

        heatLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17
        });

        layerControl.addOverlay(heatLayer, "Heatmap");
    }

    function addFatalityMarkers() {
        fatalityMarkers = L.layerGroup();

        allData.forEach(row => {
            const fatalities = parseInt(row.fatalities);
            if (fatalities > 0) {
                const lat = parseFloat(row.latitude);
                const lon = parseFloat(row.longitude);
                if (!isNaN(lat) && !isNaN(lon)) {
                    const marker = L.marker([lat, lon]);

                    const popupContent = `
                        <strong>${row.event_date}</strong><br>
                        <strong>Fatalities:</strong> ${fatalities}<br>
                        ${row.city}, ${row.state}<br>
                        ${row.notes}
                    `;

                    marker.bindPopup(popupContent);
                    fatalityMarkers.addLayer(marker);
                }
            }
        });

        layerControl.addOverlay(fatalityMarkers, "Fatality Markers");
    }

    loadHeatLayer()
        .then(() => {
            console.log('Data loaded successfully');
            createHeatmap();
            addFatalityMarkers();
            map.addLayer(heatLayer);
            map.addLayer(fatalityMarkers);
        })
        .catch(error => console.error('Error loading data:', error));
});