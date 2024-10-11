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
        // let event_type_array = resultArray.event_types;
        let state_array = resultArray.state;

        // We need to total the number of times each state happens in state_array

        // Array of values to count
        let usStates = usStates = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
            "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
            "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
            "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
            "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
            "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ];

        // Object to store the counts
        let state_sum = usStates.reduce((acc, value) => {
            acc[value] = state_array.filter(item => item === value).length;
            return acc;
        }, {});
        

        console.log(state_sum); 
 
        // Create the trace for the bar chart
        let trace = {
            x: state_array,
            y: state_sum,
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

        // We need to total the number of times each state happens in event_type_array
        // Array of values to count
        let event_types = ['battles','Explosions/Remote Violence','Protests','Riots','Strategic Developements','Violence aganist civilians'];

        // Object to store the counts
        let event_sum = event_types.reduce((acc, value) => {
            acc[value] = event_type_array.filter(item => item === value).length;
            return acc;
        }, {});

        console.log(event_sum);
 
        // Create the trace for the pie chart
        let trace = {
            values: event_sum,
            labels: state_array,
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