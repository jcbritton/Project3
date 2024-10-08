let map, heatLayer;
let allData = [];

// Initialize the map
function initMap() {
  map = L.map('map').setView([37.8, -96], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

// Make a fetch request to the server to get the data
function loadHeatLayer() {
  return fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      allData = data;
      updateHeatmap();
    });
}

// Update the heatmap with the loaded data
function updateHeatmap() {
  if (heatLayer) {
    map.removeLayer(heatLayer);
  }

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

// Initialize the map and load data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initMap();
  loadHeatLayer()
    .then(() => {
      console.log('Data loaded successfully');
    })
    .catch(error => console.error('Error loading data:', error));
});