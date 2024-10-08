CREATE TABLE "acled" (
    "event_id_cnty" VARCHAR NOT NULL,
	"event_id" INTEGER PRIMARY KEY NOT NULL,
    "event_date" DATE NOT NULL,
    "year" VARCHAR NOT NULL,
	"incident_category" VARCHAR NOT NULL,
	"event_type" VARCHAR NOT NULL,
	"sub_event_type" VARCHAR NOT NULL,
	"actor1" VARCHAR NOT NULL,
	"assoc_actor_1" VARCHAR,
	"inter1" VARCHAR NOT NULL,
	"actor2" VARCHAR,
	"assoc_actor_2" VARCHAR,
	"inter2" VARCHAR,
	"interaction" VARCHAR NOT NULL,
	"civilian_targeting" VARCHAR,
	"region" VARCHAR NOT NULL,
	"country" VARCHAR NOT NULL,
	"state" VARCHAR NOT NULL,
	"county" VARCHAR,
	"city" VARCHAR NOT NULL,
	"latitude" DECIMAL NOT NULL,
	"longitude" DECIMAL NOT NULL,
	"source" VARCHAR NOT NULL,
	"source_scale" VARCHAR NOT NULL, 
	"fatalities" INTEGER
);


