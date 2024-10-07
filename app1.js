var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var heatLayer;

function loadHeatLayer() {
  return new Promise((resolve, reject) => {
    Papa.parse('complete.csv', {
      download: true,
      header: true,
      complete: function(results) {
        var heatData = [];

        results.data.forEach(function(row) {
          var lat = parseFloat(row.latitude);
          var lon = parseFloat(row.longitude);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            heatData.push([lat, lon, 1]);
          }
        });

        heatLayer = L.heatLayer(heatData, {
          radius: 25,
          max: 1.0,
          blur: 15,
          maxZoom: 17
        }).addTo(map);
        resolve();
      },
      error: reject
    });
  });
}

loadHeatLayer()
  .then(() => {
    console.log('Heat layer loaded successfully');
  })
  .catch(error => console.error('Error loading heat layer:', error));