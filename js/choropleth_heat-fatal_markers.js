// Initialize the map
let map, legend, heatLayer, fatalityMarkers, choroplethLayer, layerControl;
let allData = [];

// document.addEventListener('DOMContentLoaded', function() { Smith moved this line further down
// Function to create and initialize the map
export function initializeMap(statesData) { // Smith added this in order to export
    if (map) return; // Smith added to prevent reinitialization
    // Create the base layer for the map
    var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Create the map
    map = L.map('map', {
        layers: [osmLayer]
    }).setView([37.8, -96], 4);

    // Load data
    loadData();

    // Create layer groups
    const heatmapOverlay = L.layerGroup().addTo(map);
    const choroplethOverlay = L.layerGroup().addTo(map);
    fatalityMarkers = L.layerGroup().addTo(map);

    // Create an object to contain overlays
    var overlayMaps = {
        "Heatmap": heatmapOverlay,
        "Colormap": choroplethOverlay,
        "Fatality Markers": fatalityMarkers
    };

    // Add layer controls to the map
    layerControl = L.control.layers({ "OpenStreetMap": osmLayer }, overlayMaps, { collapsed: false }).addTo(map);

    // Load the data for use by the layers
    function loadData() {
        return Promise.all([
            d3.json("data/ACLED.json")
        ]).then(([eventData]) => {
            allData = eventData;
            console.log('Data loaded successfully');
            createHeatmap();
            addFatalityMarkers();
            createChoropleth(eventData, statesData);
        })
        .catch(error => console.error('Error loading data:', error));
    }

    // Create the heatmap layer
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

        heatmapOverlay.addLayer(heatLayer);
    }

    // Add markers for events with fatalities
    function addFatalityMarkers() {
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
    }

    // Create the choropleth layer
    function createChoropleth(eventData, statesData) {
        let stateEventsCount = {};

        // Count events by state
        eventData.forEach(event => {
            let state = event.state;
            let eventType = event.event_type;
            if (!stateEventsCount[state]) {
                stateEventsCount[state] = { total: 0 };
            }
            if (!stateEventsCount[state][eventType]) {
                stateEventsCount[state][eventType] = 0;
            }
            stateEventsCount[state][eventType]++;
            stateEventsCount[state].total++;
        });

        // Define event ranges and colors
        let eventRanges = [
            { range: "<200", color: "#9ACD32", min: -Infinity, max: 200 },
            { range: "200-400", color: "#FFFF00", min: 200, max: 400 },
            { range: "400-600", color: "#FFD700", min: 400, max: 600 },
            { range: "600-800", color: "#FFA500", min: 600, max: 800 },
            { range: "800-1000", color: "#FF4500", min: 800, max: 1000 },
            { range: "1000+", color: "#FF0000", min: 1000, max: Infinity }
        ];

        function getColor(e) {
            for (let range of eventRanges) {
                if (e >= range.min && e < range.max) {
                    return range.color;
                }
            }
            return "#9ACD32";
        }

        choroplethLayer = L.geoJSON(statesData, {
            style: function(feature) {
                const state = feature.properties.name;
                return {
                    fillColor: getColor(stateEventsCount[state]?.total || 0),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: function(e) {
                        let layer = e.target;
                        layer.setStyle({
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                        layer.bringToFront();

                        const state = feature.properties.name;
                        const totalEvents = stateEventsCount[state]?.total || 0;
                        let eventDetails = `<b>${state}</b><br>Total Events: ${totalEvents}<br>`;

                        for (const [eventType, count] of Object.entries(stateEventsCount[state] || {})) {
                            if (eventType !== 'total') {
                                eventDetails += `${eventType}: ${count}<br>`;
                            }
                        }
                        layer.bindPopup(eventDetails).openPopup();
                    },
                    mouseout: function(e) {
                        choroplethLayer.resetStyle(e.target);
                        e.target.closePopup();
                    },
                    click: function(e) {
                        map.fitBounds(e.target.getBounds());
                    }
                });
            }
        }).addTo(choroplethOverlay);

        // Add legend initially
        if (!legend) {
            legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
                let div = L.DomUtil.create("div", "info legend");
                eventRanges.forEach(function(range) {
                    div.innerHTML += "<div style='display: flex; align-items: center;'>" +
                        "<div style='background-color: " + range.color +
                        "; width: 20px; height: 20px; margin-right: 5px;'></div>" +
                        range.range + "</div>";
                });
                return div;
            };
            legend.addTo(map); // Add the legend to the map
        };

        // Remove the legend when the choropleth layer is removed
        choroplethOverlay.on('remove', function() {
            if (legend) {
                map.removeControl(legend);
                legend = null;
            }
        });

        // Add legend when the choropleth layer is added back with toggle
        choroplethOverlay.on('add', function() {
            if (!legend) {
                legend = L.control({ position: "bottomright" });
                legend.onAdd = function() {
                    let div = L.DomUtil.create("div", "info legend");
                    eventRanges.forEach(function(range) {
                        div.innerHTML += "<div style='display: flex; align-items: center;'>" +
                            "<div style='background-color: " + range.color +
                            "; width: 20px; height: 20px; margin-right: 5px;'></div>" +
                            range.range + "</div>";
                    });
                    return div;
                };
                legend.addTo(map); // Add the legend to the map
            }
        });
    }

// This event listener will call initializeMap when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {  //Smith moved the event listener here
    initializeMap(statesData); // Make sure to pass statesData
})};  