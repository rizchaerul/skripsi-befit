DROP schema if EXISTS public cascade;

CREATE schema if NOT EXISTS public;

CREATE TABLE
    user_account (
        user_account_id uuid PRIMARY key,
        full_name text NOT NULL,
        email text NOT NULL UNIQUE,
        password text NOT NULL,
        picture_base64 text NULL,
        water_target INT NOT NULL,
        per_glass INT NOT NULL,
        is_admin bool NOT NULL DEFAULT FALSE,
        weight_goal DECIMAL NULL,
        fat_percentage_goal DECIMAL NULL,
        muscle_mass_goal DECIMAL NULL,
        is_reminder_notification_active bool NOT NULL DEFAULT TRUE,
        is_drink_notification_active bool NOT NULL DEFAULT TRUE,
        is_comment_notification_active bool NOT NULL DEFAULT TRUE,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    progress_category (
        progress_category_id INT PRIMARY key,
        name text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    report_progress (
        report_progress_id uuid PRIMARY key,
        progress_category_id INT NOT NULL REFERENCES progress_category,
        user_account_id uuid NOT NULL REFERENCES user_account
        ON DELETE cascade,
        progress DECIMAL NOT NULL,
        progress_date DATE NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    push_notification (
        push_notification_id uuid PRIMARY key,
        user_account_id uuid NOT NULL REFERENCES user_account
        ON DELETE cascade,
        endpoint text NOT NULL,
        p256dh text NOT NULL,
        auth text NOT NULL
    );

CREATE TABLE
    workout_category (
        workout_category_id uuid PRIMARY key,
        name text NOT NULL,
        is_hidden bool NOT NULL DEFAULT FALSE,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    workout (
        workout_id uuid PRIMARY key,
        workout_category_id uuid NOT NULL REFERENCES workout_category
        ON DELETE cascade,
        name text NOT NULL,
        icon_base64 text NULL,
        is_minute bool NOT NULL,
        video_url text NULL,
        description text NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    user_workout (
        user_workout_id uuid PRIMARY key,
        user_account_id uuid NOT NULL REFERENCES user_account
        ON DELETE cascade,
        is_active bool NOT NULL,
        days INT [] NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    user_workout_detail (
        user_workout_detail_id uuid PRIMARY key,
        user_workout_id uuid NOT NULL REFERENCES user_workout
        ON DELETE cascade,
        workout_id uuid NOT NULL REFERENCES workout
        ON DELETE cascade,
        UNIQUE (user_workout_id, workout_id),
        target INT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    workout_progress (
        workout_progress_id uuid PRIMARY key,
        user_account_id uuid NOT NULL REFERENCES user_account
        ON DELETE cascade,
        workout_id uuid NOT NULL REFERENCES workout
        ON DELETE cascade,
        progress INT NOT NULL,
        workout_date DATE NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    post_category (post_category_id INT PRIMARY key, name text NOT NULL);

CREATE TABLE
    post (
        post_id uuid PRIMARY key,
        post_category_id INT NOT NULL REFERENCES post_category,
        user_workout_id uuid NOT NULL REFERENCES user_workout
        ON DELETE cascade,
        title text NOT NULL,
        content text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    reply (
        reply_id uuid PRIMARY key,
        post_id uuid NOT NULL REFERENCES post
        ON DELETE cascade,
        user_account_id uuid NOT NULL REFERENCES user_account
        ON DELETE cascade,
        content text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    vote (
        post_id uuid REFERENCES post
        ON DELETE cascade,
        user_account_id uuid REFERENCES user_account
        ON DELETE cascade,
        PRIMARY key (user_account_id, post_id),
        is_upvote bool NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    notification_type (
        notification_type_id INT PRIMARY key,
        name text NOT NULL
    );

CREATE TABLE
    notification (
        notification_id uuid PRIMARY key,
        notification_type_id INT NOT NULL REFERENCES notification_type,
        user_account_id uuid NOT NULL REFERENCES user_account
        ON DELETE cascade,
        url text NULL,
        title text NOT NULL,
        message text NOT NULL,
        is_read bool NOT NULL DEFAULT FALSE,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
