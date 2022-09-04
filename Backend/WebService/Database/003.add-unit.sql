-- Add unit column
ALTER TABLE
  workout
ADD
  COLUMN unit text;

UPDATE
  workout
SET
  unit = 'T'
WHERE
  is_minute = FALSE;

UPDATE
  workout
SET
  unit = 'M'
WHERE
  is_minute = TRUE;

ALTER TABLE
  workout
ALTER COLUMN
  unit
SET
  NOT NULL;

-- Drop is_minute column
ALTER TABLE
  workout DROP COLUMN is_minute;

-- Add progress_json column
ALTER TABLE
  user_workout
ADD
  COLUMN progress_json text;

-- Add drink_reminder_times
alter TABLE
  user_account
ADD COLUMN drink_reminder_times text [];

-- Add drink_reminder_times
alter TABLE
  user_account
ADD COLUMN workout_reminder_times text [];
