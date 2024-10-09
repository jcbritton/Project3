// Load the JSON data
d3.json('static/data/data.json').then(data => {
    const events = data; // Adjust based on your data structure

    // Populate dropdowns with unique values
    populateDropdowns(events);

    // Create initial visualizations
    createVisualizations(events);

    // Add event listeners for dropdown changes
    d3.selectAll('select').on('change', () => {
        const filteredData = filterData(events);
        createVisualizations(filteredData);
    });
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

    // Create charts
    createBarChart(data);
    createLineChart(data);
    createPieChart(data);
}

// Function to create a bar chart
function createBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.event_type))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.fatalities)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.event_type))
        .attr("y", d => y(d.fatalities))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.fatalities));
}

// Function to create a line chart
function createLineChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.event_date)))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.fatalities)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(new Date(d.event_date)))
        .y(d => y(d.fatalities));

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);
}

// Function to create a pie chart
function createPieChart(data) {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
        .value(d => d.fatalities)
        .sort(null);

    const dataReady = pie(data);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('slice')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

    svg.selectAll('text')
        .data(dataReady)
        .enter()
        .append('text')
        .text(d => d.data.event_type)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle');
}
