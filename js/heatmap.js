let map, heatLayer;
let allData = [];

document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([37.8, -96], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function loadHeatLayer() {
        return new Promise((resolve, reject) => {
            Papa.parse('data/ACLED.csv', {
                download: true,
                header: true,
                complete: function(results) {
                    allData = results.data;
                    resolve();
                },
                error: reject
            });
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
        }).addTo(map);
    }

    loadHeatLayer()
        .then(() => {
            console.log('Data loaded successfully');
            createHeatmap();
        })
        .catch(error => console.error('Error loading data:', error));
});