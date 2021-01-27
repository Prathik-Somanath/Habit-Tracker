CREATE TYPE "habit_unit" AS ENUM (
  'REPS',
  'DURATION',
  'CHECK'
);

CREATE TYPE "habit_interval" AS ENUM (
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT'
);

CREATE TABLE "users" (
  "email" varchar PRIMARY KEY NOT NULL,
  "full_name" varchar(25) NOT NULL,
  "password" varchar NOT NULL,
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "habits" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user" varchar,
  "name" varchar(50) NOT NULL,
  "unit" habit_unit NOT NULL,
  "reps" int,
  "duration" int,
  "remainder_note" varchar,
  "reminder_times" time[],
  "bad_habit" boolean DEFAULT false,
  "habit_cycle" habit_interval[],
  "start_date" date NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "end_date" date,
  "streak" int DEFAULT 0
);

CREATE TABLE "history" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "habit" uuid,
  "user" varchar,
  "date" date NOT NULL,
  "val" int NOT NULL
);

ALTER TABLE "habits" ADD FOREIGN KEY ("user") REFERENCES "users" ("email") ON DELETE CASCADE;

ALTER TABLE "history" ADD FOREIGN KEY ("habit") REFERENCES "habits" ("id");

ALTER TABLE "history" ADD FOREIGN KEY ("user") REFERENCES "users" ("email") ON DELETE CASCADE;
