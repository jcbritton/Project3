// Load the JSON data
d3.json('static/data/data.json').then(data => {
    // Check if the data is an array
    if (!Array.isArray(data) || data.length === 0) {
        console.error('Data is not in the expected format:', data);
        return;
    }

    const events = data; // Use the entire array of events

    // Populate dropdowns with unique values
    populateDropdowns(events);

    // Create initial visualizations
    createVisualizations(events);

    // Add event listeners for dropdown changes
    d3.selectAll('select').on('change', () => {
        const filteredData = filterData(events);
        createVisualizations(filteredData);
    });

    // Initialize additional charts
    buildChart();
    buildPeacefulProtestsChart();
});

// Function to populate dropdown menus
function populateDropdowns(events) {
    const states = [...new Set(events.map(d => d.state))];
    const eventTypes = [...new Set(events.map(d => d.event_type))];
    const actors1 = [...new Set(events.map(d => d.actor1))];
    const actors2 = [...new Set(events.map(d => d.actor2))].filter(Boolean);
    const fatalities = [...new Set(events.map(d => d.fatalities))];

    populateDropdown('#state-filter', states);
    populateDropdown('#event-type-filter', eventTypes);
    populateDropdown('#actor-filter', [...actors1, ...actors2]);
    populateDropdown('#fatalities-filter', fatalities);
}

// Helper function to populate a dropdown
function populateDropdown(selector, options) {
    d3.select(selector).selectAll('option').remove();
    d3.select(selector)
        .append('option')
        .text('Select an option')
        .attr('value', '');

    d3.select(selector)
        .selectAll('option')
        .data(options)
        .enter()
        .append('option')
        .text(d => d)
        .attr('value', d => d);
}

// Function to filter data based on dropdown selections
function filterData(events) {
    const selectedState = d3.select('#state-filter').property('value');
    const selectedEventType = d3.select('#event-type-filter').property('value');
    const selectedActor = d3.select('#actor-filter').property('value');
    const selectedFatalities = d3.select('#fatalities-filter').property('value');

    return events.filter(event => {
        const stateMatch = selectedState === '' || event.state === selectedState;
        const eventTypeMatch = selectedEventType === '' || event.event_type === selectedEventType;
        const actorMatch = selectedActor === '' || event.actor1 === selectedActor || event.actor2 === selectedActor;
        const fatalitiesMatch = selectedFatalities === '' || event.fatalities.toString() === selectedFatalities;

        return stateMatch && eventTypeMatch && actorMatch && fatalitiesMatch;
    });
}

// Function to create visualizations
function createVisualizations(data) {
    // Clear existing charts
    d3.selectAll('.chart').selectAll('*').remove();

    // Extract year from the first event (or adjust as needed)
    const year = new Date(data[0].event_date).getFullYear(); // Extracting year from the first event

    // Create charts
    barChart(data, year);
    pieChart(data, year);
}

// Code to create the bar chart from the year
function barChart(events, year) {
    let resultArray = events.filter(eventObj => new Date(eventObj.event_date).getFullYear() === year);
    let state_array = resultArray.map(event => event.state);

    let usStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", 
        "Colorado", "Connecticut", "Delaware", "Florida", 
        "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", 
        "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
        "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        "Mississippi", "Missouri", "Montana", "Nebraska", 
        "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
        "New York", "North Carolina", "North Dakota", 
        "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
        "Rhode Island", "South Carolina", "South Dakota", 
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", 
        "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    let state_sum = usStates.reduce((acc, value) => {
        acc[value] = state_array.filter(item => item === value).length;
        return acc;
    }, {});

    console.log(state_sum);

    // Create the trace for the bar chart
    let trace = {
        x: Object.keys(state_sum),
        y: Object.values(state_sum),
        type: "bar",
    };

    // Define the layout
    let layout = {
        title: `Total Events per State in ${year}`,
        margin: { t: 30, l: 150 }
    };

    // Plot the bar chart
    Plotly.newPlot("bar-chart", [trace], layout);
}

// Code to create the pie chart from the year
function pieChart(events, year) {
    let resultArray = events.filter(eventObj => new Date(eventObj.event_date).getFullYear() === year);
    let event_type_array = resultArray.map(event => event.event_type);

    let event_types = ['Protests', 'Demonstrations', 'Violence against civilians', 'Explosions', 'Riots'];

    let event_sum = event_types.reduce((acc, value) => {
        acc[value] = event_type_array.filter(item => item === value).length;
        return acc;
    }, {});

    console.log(event_sum);

    // Create the trace for the pie chart
    let trace = {
        values: Object.values(event_sum),
        labels: Object.keys(event_sum),
        type: "pie",
    };

    // Define the layout
    let layout = {
        title: `Events by Type in ${year}`,
        margin: { t: 30, l: 150 }
    };

    // Plot the pie chart
    Plotly.newPlot("pie-chart", [trace], layout);
}

// Function to build the time series chart
function buildChart() {
    d3.json("static/data/data.json").then((data) => {
        // Count the number of events per year
        let eventCounts = {};
        data.forEach(d => {
            let year = d.year;
            if (eventCounts[year]) {
                eventCounts[year] += 1;
            } else {
                eventCounts[year] = 1;
            }
        });

        // Extract years and counts to plot them in the chart
        let years = Object.keys(eventCounts);
        let counts = Object.values(eventCounts);

        // Build the bar chart
        let barData = [{
            x: years, 
            y: counts, 
            type: 'bar',
            text: counts.map(count => `Number of Events: ${count}`),
            hoverinfo: 'text'
        }];

        let layout = {
            title: "Total Number of Events per Year",
            xaxis: {title: "Year"},
            yaxis: {title: "Number of Events"}
        };

        // Render the chart
        Plotly.newPlot("timeSeriesDiv", barData, layout);

        console.log("Time series bar chart built successfully");
    });
}

// Function to build the peaceful protests chart
function buildPeacefulProtestsChart() {
    d3.json("static/data/data.json").then((data) => {
        // Count occurrences of each sub_event_type
        let subEventCounts = {};
        data.forEach(d => {
            let subEvent = d.sub_event_type;
            if (subEventCounts[subEvent]) {
                subEventCounts[subEvent] += 1;
            } else {
                subEventCounts[subEvent] = 1;
            }
        });

        // Convert the object to an array of [subEvent, count] pairs
        let subEventArray = Object.entries(subEventCounts);

        // Separate "Peaceful protest" from the others
        let peacefulProtestsCount = subEventCounts["Peaceful protest"] || 0;
        let otherEvents = subEventArray.filter(([event]) => event !== "Peaceful protest");

        // Sort remaining events by count and get the top 5
        otherEvents.sort((a, b) => b[1] - a[1]);
        let top5Events = otherEvents.slice(0, 5);

        // Count remaining events and add to "Misc."
        let miscCount = otherEvents.slice(5).reduce((acc, [_, count]) => acc + count, 0);

        // Prepare data for bar chart
        let eventLabels = top5Events.map(([event]) => event);
        let eventCounts = top5Events.map(([, count]) => count);
        
        // Add "Peaceful protest" and "Misc." to the data
        eventLabels.push("Peaceful protest", "Misc.");
        eventCounts.push(peacefulProtestsCount, miscCount);

        // Sort the event labels and counts in descending order of eventCounts
        let sortedData = eventLabels.map((label, i) => [label, eventCounts[i]]);
        sortedData.sort((a, b) => b[1] - a[1]);

        // Separate sorted labels and counts
        eventLabels = sortedData.map(d => d[0]);
        eventCounts = sortedData.map(d => d[1]);

        // Add line breaks for long labels
        let formattedLabels = eventLabels.map(label => {
            if (label.length > 15) {
                return label.replace(" ", "\n");
            }
            return label;
        });

        // Build the bar chart
        let barData = [{
            x: eventLabels,
            y: eventCounts,
            type: 'bar'
        }];

        let layout = {
            title: "Number of Events by Event Type",
            xaxis: {
                title: "Event Type",
                tickvals: eventLabels,
                ticktext: formattedLabels,
                tickangle: 0
            },
            yaxis: { title: "Number of Events" }
        };

        // Render the chart
        Plotly.newPlot("peacefulProtestsDiv", barData, layout);

        console.log("Peaceful protests bar chart built successfully");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Load JSON data and create charts
    d3.json('static/data/data.json').then(data => {
        // Your existing data processing code...
    });

    // Initialize the map
    let map, heatLayer, fatalityMarkers, choroplethLayer, layerControl;
    let allData = [];

    // Create the base layer for the map
    var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Create the map
    map = L.map('map', {
        layers: [osmLayer]
    }).setView([37.8, -96], 4);

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
            d3.json("static/data/data.json"),
            d3.json("data/gz_2010_us_040_00_500k.json")
        ]).then(([eventData, statesData]) => {
            allData = eventData;
            return { eventData, statesData };
        });
    }

    // Existing heatmap, markers, and choropleth functions...

    loadData()
        .then(({ eventData, statesData }) => {
            console.log('Data loaded successfully');
            createHeatmap();
            addFatalityMarkers();
            createChoropleth(eventData, statesData);
        })
        .catch(error => console.error('Error loading data:', error));
});


