// Location of the JSON and CSV files
let data_json = `../data/ACLED.json`; // Use relative paths correctly
let data_csv = `../data/ACLED.csv`;

// Code to create the bar chart from the year
export function barChart(year) {  // Add export here
    // We read in the data from the JSON
    d3.json(data_json).then((data) => {
        let events = data.ACLED.event;
        let resultArray = events.filter(eventObj => eventObj.event_date == `*${year}`);
        let state_array = resultArray.state;

        let usStates = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
            "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
            "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
            "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
            "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
            "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ];

        let state_sum = usStates.reduce((acc, value) => {
            acc[value] = state_array.filter(item => item === value).length;
            return acc;
        }, {});

        console.log(state_sum); 

        let trace = {
            x: Object.keys(state_sum),
            y: Object.values(state_sum),
            type: "bar",
        };

        let layout = {
            title: `Total Events per state in ${year}`,
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", [trace], layout);
    });
}

// Code to create the pie chart from the year
export function pieChart(year) {  // Add export here
    d3.json(data_json).then((data) => {
        let events = data.ACLED.event;
        let resultArray = events.filter(eventObj => eventObj.event_date == `*${year}`);
        let event_type_array = resultArray.event_types;

        let event_types = ['battles', 'Explosions/Remote Violence', 'Protests', 'Riots', 'Strategic Developments', 'Violence against civilians'];

        let event_sum = event_types.reduce((acc, value) => {
            acc[value] = event_type_array.filter(item => item === value).length;
            return acc;
        }, {});

        console.log(event_sum);

        let trace = {
            values: Object.values(event_sum),
            labels: Object.keys(event_sum),
            type: "pie",
        };

        let layout = {
            title: `Events by type in ${year}`,
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("pie", [trace], layout);
    });
}
