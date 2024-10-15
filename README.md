# Project3

## Topic: Public Demonstrations Post Covid

### Team Members
* Chris Kellam
* Eric Lidiak
* Jason Britton
* Matthew Smith
* Molly Fox

### Overview
In an effort to visualize protest activity in the United States subsequent to the onset of the COVID-19 pandemic, our team selected the Armed Conflict Location and Event Data (ACLED) database as the source for demonstration related activity. ACLED is a non-profit organization specializing in disaggregated conflict data collection, analysis, and crisis mapping. ACLED codes the dates, actors, locations, fatalities, and types of all reported political violence and demonstration events around the world in real time. As of 2022, ACLED has recorded more than 1.3 million individual events globally. The dataset downloaded for this project consisted of nearly 38,000 individual events over the three year period from September 28, 2021 to September 27, 2024. The original design was for information dating to the start of the pandemic in 2020. However, the ACLED dataset does not allow downloads of more than three years for unpaid accounts and other protest related data with similar granularity to cover the gap was scarce. The project shows geographic concentrations of activity including interactive functionality with clickable map feathures, as well as various graphs depicting events by year, state, overall event type, and varieties of peaceful protests. The various map layers can be selected or deselected based on the viewer's preferences and type of information desired. It was obvious, upon porject completion, that the highest concentration of activity occurred in the bicoastal regions of the U.S. Facilities appear to have occurred most in the eastern half of the U.S. with concentrations on the West Coast and along the southern border region. The number of events seem to be declining since 2022, given the caveat that 2024 is still in progress with a hotly contested presidential election in November. Events categorized as "protests" are the predominant activity with over 98 percent, followed by those events categorized as riots. And finally, New York and California show a stark contrast to other states in terms of the number of events perpetrated. The high event totals for California and New York could be explained by a number variables but would require further investigation.

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
