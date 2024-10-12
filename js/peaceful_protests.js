// function to build the chart
function buildPeacefulProtestsChart() {
    const div = document.createElement('div'); // Smith - Create a new div for the chart
    div.id = "peacefulProtestsDiv"; // Smith - Set the ID for the Plotly chart
    div.style.width = "100%"; // Smith - Set desired styles

    d3.json("data/ACLED.json").then((data) => {

        // count occurrences of each sub_event_type
        let subEventCounts = {};
        data.forEach(d => {
            let subEvent = d.sub_event_type;
            if (subEventCounts[subEvent]) {
                subEventCounts[subEvent] += 1;
            } else {
                subEventCounts[subEvent] = 1;
            }
        });

        // convert the object to an array of [subEvent, count] pairs
        let subEventArray = Object.entries(subEventCounts);

        // separate "Peaceful protest" from the others
        let peacefulProtestsCount = subEventCounts["Peaceful protest"] || 0;
        let otherEvents = subEventArray.filter(([event]) => event !== "Peaceful protest");

        // sort remaining events by count and get the top 5
        otherEvents.sort((a, b) => b[1] - a[1]);
        let top5Events = otherEvents.slice(0, 5);
        
        // count remaining events and add to "Misc."
        let miscCount = otherEvents.slice(5).reduce((acc, [_, count]) => acc + count, 0);

        // prepare data for bar chart
        let eventLabels = top5Events.map(([event]) => event);
        let eventCounts = top5Events.map(([, count]) => count);
        
        // add "Peaceful protest" and "Misc." to the data
        eventLabels.push("Peaceful protest", "Misc.");
        eventCounts.push(peacefulProtestsCount, miscCount);

        // sort the event labels and counts in descending order of eventCounts
        let sortedData = eventLabels.map((label, i) => [label, eventCounts[i]]);
        sortedData.sort((a, b) => b[1] - a[1]);

        // separate sorted labels and counts
        eventLabels = sortedData.map(d => d[0]);
        eventCounts = sortedData.map(d => d[1]);

        // add line breaks for long labels
        let formattedLabels = eventLabels.map(label => {
            if (label.length > 15) {
                return label.replace(" ", "\n");
            }
            return label;
        });

        // build the bar chart
        let barData = [{
            x: eventLabels,
            y: eventCounts,
            type: 'bar'
        }];

        let layout = {
            title: "Peaceful Protest Events",
            xaxis: {//title: "Event Type",
                    tickvals: eventLabels,
                    ticktext: formattedLabels,
                    tickangle: 45 // Smith change
            },
            yaxis: {title: "Number of events"}
        };

        // render the chart
        Plotly.newPlot(div.id, barData, layout); // Smith - Use the div ID to render the chart
        // Plotly.newPlot("peacefulProtestsDiv", barData, layout);

        console.log("Peaceful protests bar chart built successfully");
    });

    return div; // Smith - Return the created div
}

// Default export
export default buildPeacefulProtestsChart; //Smith added this 

// function to run on page load
function init() {
    buildPeacefulProtestsChart();
}

// initialize the dashboard
init();
