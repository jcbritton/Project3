// eric_functions.js
let data_json = `../data/ACLED.json`;

export function barChart(data, year) {
    // Filter the events for the selected year
    let resultArray = data.filter(eventObj => new Date(eventObj.event_date).getFullYear() === year);
    
    // Map to state array
    let state_array = resultArray.map(event => event.state);

    // Array of US states
    let usStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
        "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
        "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
        "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
        "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
        "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    // Count events per state
    let state_sum = usStates.reduce((acc, state) => {
        acc[state] = state_array.filter(item => item === state).length;
        return acc;
    }, {});

    // Create the trace for the bar chart
    let trace = {
        x: Object.keys(state_sum),
        y: Object.values(state_sum),
        type: "bar",
    };

    // Define the layout
    let layout = {
        title: `Total Events per State in ${year}`,
        margin: { t: 30, l: 150 },
        xaxis: {
            title: 'States',
            tickangle: 45 // Rotate labels by 45 degrees
        }
    };

    // Plot the bar chart
    Plotly.newPlot("bar-chart", [trace], layout);
}


export function pieChart(data, year) {
    // Filter the events for the selected year
    let resultArray = data.filter(eventObj => new Date(eventObj.event_date).getFullYear() === year);
    
    // Map to event type array
    let event_type_array = resultArray.map(event => event.event_type);

    // Define event types
    let event_types = ['battles', 'Explosions/Remote Violence', 'Protests', 'Riots', 'Strategic Developments', 'Violence against civilians'];

    // Count events by type
    let event_sum = event_types.reduce((acc, eventType) => {
        acc[eventType] = event_type_array.filter(item => item === eventType).length;
        return acc;
    }, {});

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

