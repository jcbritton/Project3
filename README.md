# Project3

## Topic: Public Demonstrations Post Covid

### Team Members
* Chris Kellam
* Eric Lidiak
* Jason Britton
* Matthew Smith
* Molly Fox

### Description
Create a dashboard to visualize various categories of public demonstrations in the post-COVID United States. The dashboard will include four charts showing demonstration activity over time, by state, and by event type. The dashboard will also include an interactive geographic representation with a heatmap overlay, a choropleth overlay, and a fatalities overlay. The dashboard will utilize information from a SQL database created from the original comma delimited dataset download subsequent to ETL. This process utilized a PostgreSQL adapter Python library called "Psycopg".

### Research Questions
1. What types of public demonstration events have occurred post-COVID in the US?
2. When are these events occurring?
3. Where are these events occurring?
4. What portion of the events were peaceful?
5. How many fatalities were there?

### Project Tasks
1. Gather, clean, and store the dataset in a chosen database
    * Identify the data sources needed for the dashboard.
    * Clean the data for inconsistencies and missing values.
    * Store the dataset in the selected database and ensure it contains at least 100 records.
    * Write SQL queries to extract data for visualizations.
2. Develop Dashboard Visualization Components
    * Pie chart showing the distribution of event types.
    * Bar chart showing total events by state.
    * Time series chart showing total events per year.
    * Bar chart showing the number of protests by type.
    * Interactive Map with Layer Filters
        * Heatmap layer of event types in the US (markers on zoom).
        * Choropleth layer (colormap) of event types for each state.
        * Markers layer for incidents involving fatalities.
4. Integrate Visualizations into a Dashboard
    * Create HTML menus and dropdowns for users to filter visualizations based on event types.
    * Ensure that visualizations update dynamically based on user-selected filters.
    * Integrate all visualizations into a dashboard.
    * Design the layout to ensure usability and clarity.
5. Presentation and Documentation
    * Create the GitHub repo.
    * Prepare a 10-minute presentation that outlines the project theme, coding approach, data wrangling techniques, and final dashboard.
    * Write a paragraph summarizing ethical considerations made in the project (e.g., data privacy, source attribution).
    * Update the GitHub Repo README and publish the dashboard to Pages.

### Data Sources
* ACLED (Armed Conflict Location and Event Data): acleddata.com
* States Data: https://leafletjs.com/examples/choropleth/
