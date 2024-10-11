// Location of the JSON and CSV files
let data_json = `..\data\ACLED.json`;
let data_csv = `..\data\ACLED.csv`;

// Code to create the bar chart from the year
function barChart(year) {
    // We read in the data from the JSON
    d3.json(data_json).then((data) => {

        // Collect in resultArray all the events that happened that year
        let events = data.ACLED.event;
        let resultArray = events.filter(eventObj => eventObj.event_date == `*${year}`);
 
        // Collect the types and states in an array
        let event_type_array = resultArray.event_types;
        let state_array = resultArray.state;

        // We need to total the number of times each state happens in state_array
 
        // Create the trace for the bar chart
        let trace = {
            x: state_array,
            y: event_sum,
            text: state_array,
            type: "bar",
        };
 
        // Define the layout
        let layout = {
            title: `Total Events per state in ${year}`,
            margin: { t: 30, l: 150 }
        };
 
        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout);
    });

}

// Code to create the pie chart from the year
function pieChart(year) {
    // We read in the data from the CSV or the JSON
    d3.json(data_json).then((data) => {

        // Collect in resultArray all the events that happened that year
        let events = data.ACLED.event;
        let resultArray = events.filter(eventObj => eventObj.event_date == `*${year}`);
 
        // Collect the types and states in an array
        let event_type_array = resultArray.event_types;
        let state_array = resultArray.state;

        // We need to total the number of times each type happens in event_type_array

 
        // Create the trace for the bar chart
        let trace = {
            x: state_array,
            y: event_sum,
            text: state_array,
            type: "pie",
        };
 
        // Define the layout
        let layout = {
            title: `Events by type in ${year}`,
            margin: { t: 30, l: 150 }
        };
 
        // Plot the bar chart
        Plotly.newPlot("pie", [trace], layout);
    });

}