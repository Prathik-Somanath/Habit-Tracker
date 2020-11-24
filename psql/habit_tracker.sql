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
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (gen_random_uuid()),
  "full_name" varchar(25) NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "habits" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user" uuid,
  "name" varchar(50) NOT NULL,
  "unit" habit_unit NOT NULL,
  "remainder_note" varchar,
  "reminder_times" time[],
  "bad_habit" boolean DEFAULT false,
  "habit_cycle" habit_interval[],
  "start_date" date NOT NULL,
  "end_date" date,
  "streak" int DEFAULT 0
);

CREATE TABLE "history" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (gen_random_uuid()),
  "habit" uuid,
  "user" uuid,
  "date" date NOT NULL,
  "val" int NOT NULL
);

ALTER TABLE "habits" ADD FOREIGN KEY ("user") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "history" ADD FOREIGN KEY ("habit") REFERENCES "habits" ("id");

ALTER TABLE "history" ADD FOREIGN KEY ("user") REFERENCES "users" ("id") ON DELETE CASCADE;
