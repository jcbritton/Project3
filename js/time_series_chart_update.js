// function to build the chart
function buildChart() {
    const div = document.createElement('div'); // Create a new div for the chart
    div.id = "timeSeriesDiv"; // Set the ID for the Plotly chart
    div.style.width = "100%"; // Set any desired styles

    return d3.json("data/ACLED.json").then((data) => {
        // Count the number of events per year
        let eventCounts = {};
        data.forEach(d => {
            let year = d.year;
            eventCounts[year] = (eventCounts[year] || 0) + 1;
        });

        // Extract years and counts
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
            xaxis: { title: "Year", tickvals: years, ticktext: years },
            yaxis: { title: "Number of Events" }
        };

        // Append the div to the dashboard before plotting
        const dashboardContainer = document.getElementById('dashboard');
        dashboardContainer.appendChild(div); // Append the div here

        // Render the chart
        Plotly.newPlot(div.id, barData, layout); // Use the div ID to render the chart
        console.log("Time series bar chart built successfully");
        
        return div; // Return the created div
    }).catch((error) => {
        console.error("Error loading data:", error);
        return div; // Return the div even on error (if needed)
    });
}


// Default export
export default buildChart;


// function to run on page load
function init() {
    buildChart();
}

// initialize the dashboard
init();

