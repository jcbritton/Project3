document.addEventListener('DOMContentLoaded', function() {
  let map, heatLayer, markerClusterGroup;
  let allData = [];
  const baseIntensity = 1;
  const zoomThreshold = 10; // Adjust this value as needed

  map = L.map('map', {
      zoomControl: false  // This disables the default zoom control
  }).setView([37.8, -96], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  function loadHeatLayer() {
      return new Promise((resolve, reject) => {
          Papa.parse('ACLED.csv', {
              download: true,
              header: true,
              complete: function(results) {
                  allData = results.data;
                  updateFilters();
                  updateHeatmap();
                  resolve();
              },
              error: reject
          });
      });
  }

  function updateFilters() {
      const stateFilter = document.getElementById('stateFilter');
      const cityFilter = document.getElementById('cityFilter');
      const yearFilter = document.getElementById('yearFilter');
      const eventTypeFilter = document.getElementById('eventTypeFilter');

      // Populate state filter
      const states = [...new Set(allData.map(item => item.state))].filter(Boolean).sort();
      populateFilter(stateFilter, states, "States");

      // Populate year filter
      const years = [...new Set(allData.map(item => item.year))].filter(Boolean).sort();
      populateFilter(yearFilter, years, "Years");

      // Populate city and event type filters with all options initially
      const cities = [...new Set(allData.map(item => item.city))].filter(Boolean).sort();
      populateFilter(cityFilter, cities, "Cities");

      const eventTypes = [...new Set(allData.map(item => item.event_type))].filter(Boolean).sort();
      populateFilter(eventTypeFilter, eventTypes, "Event Types");

      // Add event listeners
      stateFilter.addEventListener('change', updateDependentFilters);
  }

  function populateFilter(selectElement, options, columnName) {
      selectElement.innerHTML = `<option value="">All ${columnName}</option>`;
      options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          selectElement.appendChild(optionElement);
      });
  }

  function updateDependentFilters() {
      const stateFilter = document.getElementById('stateFilter');
      const cityFilter = document.getElementById('cityFilter');
      const eventTypeFilter = document.getElementById('eventTypeFilter');
      const selectedState = stateFilter.value;

      if (selectedState) {
          // Filter cities based on selected state
          const cities = [...new Set(allData
              .filter(item => item.state === selectedState)
              .map(item => item.city))]
              .filter(Boolean)
              .sort();
          populateFilter(cityFilter, cities, "Cities");

          // Filter event types based on selected state
          const eventTypes = [...new Set(allData
              .filter(item => item.state === selectedState)
              .map(item => item.event_type))]
              .filter(Boolean)
              .sort();
          populateFilter(eventTypeFilter, eventTypes, "Event Types");
      } else {
          // If no state is selected, show all cities and event types
          const allCities = [...new Set(allData.map(item => item.city))].filter(Boolean).sort();
          populateFilter(cityFilter, allCities, "Cities");

          const allEventTypes = [...new Set(allData.map(item => item.event_type))].filter(Boolean).sort();
          populateFilter(eventTypeFilter, allEventTypes, "Event Types");
      }

      updateHeatmap();
  }

  function updateVisualization(filteredData) {
      const currentZoom = map.getZoom();

      if (map.hasLayer(heatLayer)) {
          map.removeLayer(heatLayer);
      }
      if (map.hasLayer(markerClusterGroup)) {
          map.removeLayer(markerClusterGroup);
      }

      if (currentZoom < zoomThreshold) {
          // Use heatmap for lower zoom levels
          const heatData = filteredData.map(row => {
              const lat = parseFloat(row.latitude);
              const lon = parseFloat(row.longitude);
              return [lat, lon, baseIntensity];
          }).filter(point => !isNaN(point[0]) && !isNaN(point[1]));

          heatLayer = L.heatLayer(heatData, {
              radius: 25,
              max: baseIntensity,
              blur: 15,
              maxZoom: zoomThreshold,
              gradient: {0.25: 'blue', 0.50: 'lime', 0.75: 'orange', 1: 'red'}
          }).addTo(map);
      } else {
          // Use marker clusters for higher zoom levels
          markerClusterGroup = L.markerClusterGroup();
          filteredData.forEach(row => {
              const lat = parseFloat(row.latitude);
              const lon = parseFloat(row.longitude);
              if (!isNaN(lat) && !isNaN(lon)) {
                  const marker = L.marker([lat, lon]);
                  
                  // Create popup content
                  const popupContent = `
                      <strong>Event Type:</strong> ${row.event_type}<br>
                      <strong>Date:</strong> ${row.event_date}<br>
                      <strong>Location:</strong> ${row.city}, ${row.state}<br>
                      <strong>Notes:</strong> ${row.notes}
                  `;
                  
                  marker.bindPopup(popupContent);
                  markerClusterGroup.addLayer(marker);
              }
          });
          map.addLayer(markerClusterGroup);
      }
  }

  function updateHeatmap() {
      const stateFilter = document.getElementById('stateFilter');
      const cityFilter = document.getElementById('cityFilter');
      const yearFilter = document.getElementById('yearFilter');
      const eventTypeFilter = document.getElementById('eventTypeFilter');

      const filteredData = allData.filter(row => {
          return (
              (!stateFilter.value || row.state === stateFilter.value) &&
              (!cityFilter.value || row.city === cityFilter.value) &&
              (!yearFilter.value || row.year === yearFilter.value) &&
              (!eventTypeFilter.value || row.event_type === eventTypeFilter.value)
          );
      });

      updateVisualization(filteredData);
  }

  function clearFilters() {
      document.getElementById('stateFilter').value = '';
      document.getElementById('cityFilter').value = '';
      document.getElementById('yearFilter').value = '';
      document.getElementById('eventTypeFilter').value = '';
      
      updateDependentFilters();
      updateHeatmap();
  }

  loadHeatLayer()
      .then(() => {
          console.log('Data loaded successfully');
          document.getElementById('stateFilter').addEventListener('change', updateHeatmap);
          document.getElementById('cityFilter').addEventListener('change', updateHeatmap);
          document.getElementById('yearFilter').addEventListener('change', updateHeatmap);
          document.getElementById('eventTypeFilter').addEventListener('change', updateHeatmap);
          document.getElementById('clearFilters').addEventListener('click', clearFilters);
          map.on('zoomend', updateHeatmap);
      })
      .catch(error => console.error('Error loading data:', error));

  window.addEventListener('resize', function() {
      map.invalidateSize();
  });
});