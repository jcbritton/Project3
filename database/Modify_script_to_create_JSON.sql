SELECT array_to_json(array_agg(row_to_json(t)))
FROM (
SELECT event_id_cnty, event_id, event_date, year, incident_category, event_type, sub_event_type, actor1, assoc_actor_1, inter1, actor2, assoc_actor_2, inter2, interaction, civilian_targeting, region, country, state, county, city, latitude, longitude, source, source_scale, notes, fatalities
	FROM public.acled;
) t;
