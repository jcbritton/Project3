import psycopg2
import csv
from datetime import datetime

# Database connection parameters
db_params = {
    "dbname": "Project3",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432"
}

# Function to convert date from MM/DD/YYYY to YYYY-MM-DD
def convert_date(date_string):
    if date_string:
        return datetime.strptime(date_string, '%m/%d/%Y').strftime('%Y-%m-%d')
    return None

# Function to convert string to integer, returning None if conversion fails
def safe_int(value):
    try:
        return int(value)
    except ValueError:
        return None

# Function to convert string to float, returning None if conversion fails
def safe_float(value):
    try:
        return float(value)
    except ValueError:
        return None

# Main function to import CSV
def import_csv(file_path):
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()

    with open(file_path, 'r') as f:
        csv_reader = csv.reader(f)
        next(csv_reader)  # Skip header row

        for row in csv_reader:
            # Adjust the indices and conversions based on your CSV structure
            event_id_cnty = row[0]
            event_id = safe_int(row[1])
            event_date = convert_date(row[2])
            year = row[3]
            incident_category = row[4]
            event_type = row[5]
            sub_event_type = row[6]
            actor1 = row[7]
            assoc_actor_1 = row[8]
            inter1 = row[9]
            actor2 = row[10]
            assoc_actor_2 = row[11]
            inter2 = row[12]
            interaction = row[13]
            civilian_targeting = row[14]
            region = row[15]
            country = row[16]
            state = row[17]
            county = row[18]
            city = row[19]
            latitude = safe_float(row[20])
            longitude = safe_float(row[21])
            source = row[22]
            source_scale = row[23]
            notes = row[24]
            fatalities = safe_int(row[25])

            # SQL insert statement
            insert_query = """
            INSERT INTO acled_2 (
                event_id_cnty, event_id, event_date, year, incident_category, event_type,
                sub_event_type, actor1, assoc_actor_1, inter1, actor2, assoc_actor_2,
                inter2, interaction, civilian_targeting, region, country, state, county,
                city, latitude, longitude, source, source_scale, notes, fatalities
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            # Execute insert
            cur.execute(insert_query, (
                event_id_cnty, event_id, event_date, year, incident_category, event_type,
                sub_event_type, actor1, assoc_actor_1, inter1, actor2, assoc_actor_2,
                inter2, interaction, civilian_targeting, region, country, state, county,
                city, latitude, longitude, source, source_scale, notes, fatalities
            ))

    conn.commit()
    cur.close()
    conn.close()

# Run the import
import_csv('data/ACLED.csv')
print("Import completed successfully.")