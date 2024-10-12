// dashboard.js
import { initializeMap } from './choropleth_heat-fatal_markers.js';  // Import map module
import { barChart, pieChart } from './eric_functions_update.js';  // Import visualizations
import buildPeacefulProtestsChart from './peaceful_protests.js';  // Import visualization
import buildChart from './time_series_chart_update.js'; // Import time series chart
import statesData from './states.js';  // Import states data

function createDashboard() {
    const dashboardContainer = document.getElementById('dashboard');
    
    // Load event data
    d3.json("data/ACLED.json").then(data => {
        console.log("Data loaded:", data); // Log the entire data structure
        // Get the current year or specify a year
        const year = new Date().getFullYear(); 

        // Initialize the map with statesData
        initializeMap(statesData);

        // Call the barChart function with the entire data and the current year
        barChart(data, year); 
        
        // Call the pieChart function with the entire data and the current year
        pieChart(data, year); 
        
        // Create and append the peaceful protests chart
        const peacefulProtestsChart = buildPeacefulProtestsChart(data);
        dashboardContainer.appendChild(peacefulProtestsChart);

        // Create and append the time series chart
        buildChart(data).then((timeSeriesChart) => {
            dashboardContainer.appendChild(timeSeriesChart);
            console.log("Time series chart created and appended.");
        }).catch((error) => {
            console.error("Failed to build time series chart:", error);
        });

    }).catch((error) => {
        console.error("Error loading event data:", error);
    });
}

// Call the function to create the dashboard
createDashboard();

