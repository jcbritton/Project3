// function to build the chart
function buildChart() {
    d3.json("data/ACLED.json").then((data) => {
        // count the number of events per year by looping through data
        let eventCounts = {};
        data.forEach(d => {
            let year = d.year;
            eventCounts[year] = (eventCounts[year] || 0) + 1;
        });

        // extract years and counts to plot them in the chart
        let years = Object.keys(eventCounts);
        let counts = Object.values(eventCounts);

        // build the bar chart
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

        // render the chart
        Plotly.newPlot("timeSeriesDiv", barData, layout);
        console.log("Time series bar chart built successfully");
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
