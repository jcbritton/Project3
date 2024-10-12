// dashboard.js
import { initializeMap } from './choropleth_heat-fatal_markers.js';  // Import map module
import { barChart, pieChart } from './eric_functions_update.js';  // Import visualizations
import buildPeacefulProtestsChart from './peaceful_protests.js';  // Import visualization
import { buildChart } from './time_series_chart_update.js'; // Import visualization
import statesData from './states.js';  // Import states data

function createDashboard() {
    // Create a container for the dashboard layout
    const dashboardContainer = document.getElementById('dashboard');
    
    // Create and append the bar chart
    const barChart = new BarChart();
    dashboardContainer.appendChild(barChart.render());

    // Create and append the pie chart
    const pieChart = new PieChart();
    dashboardContainer.appendChild(pieChart.render());

    // Create and append the peaceful protests chart
    const peacefulProtestsChart = buildPeacefulProtestsChart();
    dashboardContainer.appendChild(peacefulProtestsChart);

    // Create and append the time series chart
    const timeSeriesChart = buildChart();
    dashboardContainer.appendChild(timeSeriesChart);

    // Initialize the map with statesData
    initializeMap(statesData);
}

// Call the function to create the dashboard
createDashboard();

