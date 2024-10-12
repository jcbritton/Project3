// CREATE THE MAP

// Create the base layer for the map
var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Create the default map
var map = L.map('map', {
    layers: [osmLayer]
}).setView([37.8, -96], 5); // Set initial view to the US

// Create the layer groups for the overlays
// PLACEHOLDER const heatmapOverlay = L.layerGroup().addTo(map);
const choroplethOverlay = L.layerGroup().addTo(map);

// Create an object to contain overlays
var overlayMaps = {
    //PLACEHOLDER "Heatmap": heatmapOverlay,
    "Colormap": choroplethOverlay
};

// Add layers control to the map
var layerControl = L.control.layers({ "OpenStreetMap": osmLayer }, overlayMaps, { collapsed: false }).addTo(map);



// DATA FOR MAP

// Events Data
const events = "data/ACLED.json";

// States Data, SOURCE: https://eric.clst.org/tech/usgeojson/
const states = "data/gz_2010_us_040_00_500k.json";



// EVENT COUNTS BY STATE

// Read the protest and demonstrations endpoint
d3.json(events).then(function(eventData) {

    // Create an empty object for the count of event types by state
    let stateEventsCount = {};

    // Loop through the events
    for (let i = 0; i < eventData.length; i++) {

        // Get the state and event type from the current event
        let state = eventData[i].state;
        let eventType = eventData[i].event_type;

        // Check if the state is already in the stateEventsCount object
        if (!stateEventsCount[state]) {
            // If not, initialize it with an empty object and a total count
            stateEventsCount[state] = { total: 0 };
        }

        // Check if the event type is already in the state's object
        if (!stateEventsCount[state][eventType]) {
            // If not, initialize the count for that event type
            stateEventsCount[state][eventType] = 0;
        }

        // Update the count for the event type for that state
        stateEventsCount[state][eventType]++;

        // Increment the total count for the state
        stateEventsCount[state].total++;
    }

    // CHOROPLETH MAP OVERLAY

    // Read the United States - States endpoint and create the choropleth map overlay
    d3.json(states).then(function(choroData) {

        // Define event labels, colors, and ranges
        let eventRanges = [
            { range: "<200", color: "#9ACD32", min: -Infinity, max: 200 }, //yellow-green
            { range: "200-400", color: "#FFFF00", min: 200, max: 400 },    //yellow
            { range: "400-600", color: "#FFD700", min: 400, max: 600 },    //orange-yellow
            { range: "600-800", color: "#FFA500", min: 600, max: 800 },    //orange
            { range: "800-1000", color: "#FF4500", min: 800, max: 1000 },  //red-orange
            { range: "1000+", color: "#FF0000", min: 1000, max: Infinity } //red
        ];

        // Define a custom color function
        function getColor(e) {
            for (let range of eventRanges) {
                if (e >= range.min && e < range.max) {
                    return range.color; // Return the color
                }
            }
            return "#9ACD32"; // Default color
        };

        // Create a GeoJSON layer for the data and add it to the overlay
        L.geoJSON(choroData, {
            
            // Add the style for the states
            style: function(feature) {
                const state = feature.properties.NAME;
                return {
                    fillColor: getColor(stateEventsCount[state]?.total || 0),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            },

            // On each state add and remove event informaiton on hover over
            onEachFeature: function(feature, layer) {
                layer.on({
                    
                    // On mouseover highlight the state
                    mouseover: function(e) {
                        let layer = e.target;
                        layer.setStyle({
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                        layer.bringToFront();
            
                        // Create a popup with the state name and event data
                        const state = feature.properties.NAME;
                        const totalEvents = stateEventsCount[state]?.total || 0;
                        let eventDetails = `<b>${state}</b><br>Total Events: ${totalEvents}<br>`;
                        
                        // Add event type counts to the popup
                        for (const [eventType, count] of Object.entries(stateEventsCount[state])) {
                            if (eventType !== 'total') {
                                eventDetails += `${eventType}: ${count}<br>`;
                            }
                        }
                        // Bind and open the popup
                        layer.bindPopup(eventDetails).openPopup();
                    },
                    
                    mouseout: function(e) {
                        // Reset the style to the original style based on event counts
                        const state = e.target.feature.properties.NAME;
                        layer.setStyle({
                            fillColor: getColor(stateEventsCount[state]?.total || 0), // Reset color based on event counts
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        });

                        // Close the popup when the mouse leaves
                        layer.closePopup();
                    },
                    click: function(e) {
                        map.fitBounds(e.target.getBounds());
                    }
                });
            }
        }).addTo(choroplethOverlay);
    
        // Set up the  legend
        let legend = L.control({ position: "bottomright" });

        legend.onAdd = function() {
            let div = L.DomUtil.create("div", "info legend");

            // Loop through each range and create a label
            eventRanges.forEach(function(range) {
                div.innerHTML += "<div style='display: flex; align-items: center;'>" +
                    "<div style='background-color: " + range.color + 
                    "; width: 20px; height: 20px; margin-right: 5px;'></div>" +
                    range.range + "</div>";
            });
            return div;
        };

        legend.addTo(map); // Add legend to the map

    }).catch(error => {
        console.error("Error fetching states data: ", error);
    });

}).catch(error => {
    console.error("Error fetching events data: ", error);
});