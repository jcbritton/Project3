// function to build the chart
// load the local JSON file
function buildChart() {
    d3.json("data/ACLED.json").then((data) => {

// count the number of events per year by looping through data, extracting the year, and storing how many events occured each year
        let eventCounts = {};
        data.forEach(d => {
            let year = d.year;
            if (eventCounts[year]) {
                eventCounts[year] += 1;
            } else {
                eventCounts[year] = 1;
            }
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
            xaxis: {title: "Year",
                    tickvals: years,
                    ticktext: years
            }, 
            yaxis: {title: "Number of Events"}
        };

        // render the chart
        Plotly.newPlot("timeSeriesDiv", barData, layout);

        console.log("Time series bar chart built successfully");
    });
}

// function to run on page load
function init() {
    buildChart();
}

// initialize the dashboard
init();