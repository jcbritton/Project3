var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function getColor(d) {
  return d > 3.0 ? '#665600' :  // Dark yellow
         d > 2.5 ? '#887300' :
         d > 2.0 ? '#AA9100' :
         d > 1.5 ? '#CCAE00' :
         d > 1.0 ? '#EECB00' :
         d > 0.5 ? '#FFE84D' :
                   '#FFF4B3';  // Light yellow
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.averageConsumption),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

var stateLayer, heatLayer;

function bringHeatLayerToFront() {
  if (heatLayer) {
    heatLayer.bringToFront();
  }
}

function loadStateLayer() {
  return new Promise((resolve, reject) => {
    Papa.parse('Alcohol_Consumption_US.csv', {
      download: true,
      header: true,
      complete: function(results) {
        var stateData = {};

        results.data.forEach(function(row) {
          if (row.State && row.Year && row['All beverages (Per capita consumption)']) {
            if (!stateData[row.State]) {
              stateData[row.State] = { total: 0, count: 0 };
            }
            stateData[row.State].total += parseFloat(row['All beverages (Per capita consumption)']);
            stateData[row.State].count++;
          }
        });

        Object.keys(stateData).forEach(function(state) {
          stateData[state] = stateData[state].total / stateData[state].count;
        });

        fetch('https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json')
          .then(response => response.json())
          .then(statesData => {
            statesData.features.forEach(function(feature) {
              var stateName = feature.properties.name;
              feature.properties.averageConsumption = stateData[stateName] || 0;
            });

            stateLayer = L.geoJson(statesData, {
              style: style,
              onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.name + ': ' + 
                                feature.properties.averageConsumption.toFixed(2) + ' gallons');
              }
            }).addTo(map);

            resolve();
          })
          .catch(reject);
      },
      error: reject
    });
  });
}

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

Promise.all([loadStateLayer(), loadHeatLayer()])
  .then(() => {
    bringHeatLayerToFront();
    map.on('overlayadd', bringHeatLayerToFront);
  })
  .catch(error => console.error('Error loading layers:', error));

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
      labels = [];
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(map);