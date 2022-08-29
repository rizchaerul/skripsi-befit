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

ALTER TABLE
  user_workout
ADD
  COLUMN progress_json text
