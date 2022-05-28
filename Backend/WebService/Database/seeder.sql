-- Enums
INSERT INTO notification_type
VALUES (1, 'Workout'), (2, 'Drink'), (3, 'Comment');

INSERT INTO post_category
VALUES (1, 'Workout Sharing'), (2, 'Workout Question');

INSERT INTO progress_category
VALUES (1, 'Drink'), (2, 'Weight'), (3, 'Height'), (4, 'Muscle Mass'), (5, 'Fat Percentage');

-- Data
INSERT INTO user_account
VALUES (
        '31b94abe-d985-49bf-a9c1-1a8a7e5a8610',
        'Admin',
        'admin@email.com',
        '$2a$12$m7tjfK1STawHH36cEkZf9.q/UFP78fW8Sq7.S4eGFauZ.dkh5EZv.',
        NULL,
        0,
        230,
        TRUE
    ), (
        '23933b08-ea00-4bfd-992a-ab0985635606',
        'Chaerul Rizky',
        'riz.chaerul@gmail.com',
        '$2a$12$m7tjfK1STawHH36cEkZf9.q/UFP78fW8Sq7.S4eGFauZ.dkh5EZv.',
        NULL,
        8,
        230,
        FALSE
    ), (
        '88fb9f9c-667b-41c3-bb39-91b329e8c270',
        'Ronan',
        'ronan@email.com',
        '$2a$12$m7tjfK1STawHH36cEkZf9.q/UFP78fW8Sq7.S4eGFauZ.dkh5EZv.',
        NULL,
        8,
        230,
        FALSE
    ), (
        'ecb3fd9b-5f81-463a-9817-9eb29c70afe2',
        'Adrian',
        'adrian@email.com',
        '$2a$12$m7tjfK1STawHH36cEkZf9.q/UFP78fW8Sq7.S4eGFauZ.dkh5EZv.',
        NULL,
        8,
        230,
        FALSE
    ), (
        'b69fea64-fd8b-4018-b3be-65cf7a505e0b',
        'User',
        'user@email.com',
        '$2a$12$m7tjfK1STawHH36cEkZf9.q/UFP78fW8Sq7.S4eGFauZ.dkh5EZv.',
        NULL,
        8,
        230,
        FALSE
    );

INSERT INTO workout_category
VALUES (
        'ae594e70-8162-415f-a4e1-ba3f9b92e69c',
        'Custom',
        TRUE
    ), (
        '4ff96f84-6c39-4c0e-81f2-4700cc476245',
        'Endurance',
        FALSE
    ), (
        'be71706b-d3c4-466a-9950-b270d2c4dbc9',
        'Strength',
        FALSE
    ), (
        'e4558a9a-d581-4d47-898d-86afc6242ae7',
        'Burn Fat',
        FALSE
    ), (
        'd077631b-7f87-4153-a41b-cc62be789b92',
        'Cardio',
        FALSE
    );

INSERT INTO workout
VALUES (
        '325c5c8c-0ece-4a18-b24a-2b7d31272f40',
        '4ff96f84-6c39-4c0e-81f2-4700cc476245',
        'Jumping Jacks',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFZSURBVDiNjdO/S5ZhFMbxz5EHTELREEEIM0uoKQjcDBraihwibXSwUREi/BOcor/ApsAfKBIENje/S1NjYI5CgUgqwml4H18eHt7nxQP3dp3rur/nvk9kpnpFxAAe4wKt7CYqq69L81O08AbPcBARU00GMrNzcBu7uIkxvMQM1qu66ikqyYGPWM3M04hYwC0s49d1EJaxl5lHETGJTfzGCfZ7IuABNiooLWzhC141XT8zOwafMFIx2O8q5jU+YxsbuFdERIH+zPzTgHY1oyVM4G1m/ouIUawXeILvNf1lRMxjtmwawnFmzlfQjyNisMALfKgZPCyRVsr0aTxvmuNmjXMN73oNrqLdKlD/pt8y80dTWr36MBYRjyps126GwDje47728+xm5nnPpohBLGIkrhat3MAFzGlj/dX+woe4oT3YiTL0BF8zc6dj0CVlGHdxB2f4icP6av8HYPnavmvxkPkAAAAASUVORK5CYII=',
        FALSE,
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '<div>Never gonna</div><div>Give you up</div>'
    ), (
        'fcd6136e-26a9-4979-aae5-7dc87b164d13',
        '4ff96f84-6c39-4c0e-81f2-4700cc476245',
        'Push Up',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFZSURBVDiNjdO/S5ZhFMbxz5EHTELREEEIM0uoKQjcDBraihwibXSwUREi/BOcor/ApsAfKBIENje/S1NjYI5CgUgqwml4H18eHt7nxQP3dp3rur/nvk9kpnpFxAAe4wKt7CYqq69L81O08AbPcBARU00GMrNzcBu7uIkxvMQM1qu66ikqyYGPWM3M04hYwC0s49d1EJaxl5lHETGJTfzGCfZ7IuABNiooLWzhC141XT8zOwafMFIx2O8q5jU+YxsbuFdERIH+zPzTgHY1oyVM4G1m/ouIUawXeILvNf1lRMxjtmwawnFmzlfQjyNisMALfKgZPCyRVsr0aTxvmuNmjXMN73oNrqLdKlD/pt8y80dTWr36MBYRjyps126GwDje47728+xm5nnPpohBLGIkrhat3MAFzGlj/dX+woe4oT3YiTL0BF8zc6dj0CVlGHdxB2f4icP6av8HYPnavmvxkPkAAAAASUVORK5CYII=',
        FALSE,
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '<div>Never gonna</div><div>Give you up</div>'
    ), (
        '29dc17e6-650e-499b-9eac-8e9425bec010',
        '4ff96f84-6c39-4c0e-81f2-4700cc476245',
        'Pull up',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFZSURBVDiNjdO/S5ZhFMbxz5EHTELREEEIM0uoKQjcDBraihwibXSwUREi/BOcor/ApsAfKBIENje/S1NjYI5CgUgqwml4H18eHt7nxQP3dp3rur/nvk9kpnpFxAAe4wKt7CYqq69L81O08AbPcBARU00GMrNzcBu7uIkxvMQM1qu66ikqyYGPWM3M04hYwC0s49d1EJaxl5lHETGJTfzGCfZ7IuABNiooLWzhC141XT8zOwafMFIx2O8q5jU+YxsbuFdERIH+zPzTgHY1oyVM4G1m/ouIUawXeILvNf1lRMxjtmwawnFmzlfQjyNisMALfKgZPCyRVsr0aTxvmuNmjXMN73oNrqLdKlD/pt8y80dTWr36MBYRjyps126GwDje47728+xm5nnPpohBLGIkrhat3MAFzGlj/dX+woe4oT3YiTL0BF8zc6dj0CVlGHdxB2f4icP6av8HYPnavmvxkPkAAAAASUVORK5CYII=',
        FALSE,
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '<div>Never gonna</div><div>Give you up</div>'
    );

INSERT INTO notification
VALUES (
        '30a7d2df-4662-4ade-8ed0-a4e3e02d3c67',
        1,
        '23933b08-ea00-4bfd-992a-ab0985635606',
        NULL,
        'Unfinished Workout!',
        'You have not finished your workout!'
    ), (
        'aec10509-9307-4428-81dc-05e112f997d7',
        2,
        '23933b08-ea00-4bfd-992a-ab0985635606',
        NULL,
        'Not enough drink!',
        'Drink water for your health!'
    );

INSERT INTO user_workout
VALUES (
        '940fd01d-e824-46b4-8573-2dbe2a976ab6',
        '23933b08-ea00-4bfd-992a-ab0985635606',
        TRUE,
        ARRAY [1]
    ), (
        '45d1b1cb-e1de-481e-928f-6d206a074823',
        '23933b08-ea00-4bfd-992a-ab0985635606',
        FALSE,
        ARRAY [1]
    ), (
        '744b8057-e50a-4aa3-8b4f-de43cbb0e337',
        'b69fea64-fd8b-4018-b3be-65cf7a505e0b',
        TRUE,
        ARRAY [1]
    ), (
        '33a0485e-01bc-4562-bdda-51551aa60b0e',
        '88fb9f9c-667b-41c3-bb39-91b329e8c270',
        TRUE,
        ARRAY [1]
    ), (
        'e4baf37c-52f4-472e-9db4-e2ead14131ec',
        'ecb3fd9b-5f81-463a-9817-9eb29c70afe2',
        TRUE,
        ARRAY [1]
    );

INSERT INTO user_workout_detail
VALUES (
        '0f8a748b-f91d-434c-a974-f2e6c8f58f82',
        '45d1b1cb-e1de-481e-928f-6d206a074823',
        '325c5c8c-0ece-4a18-b24a-2b7d31272f40',
        10
    ), (
        'b51e81c5-2b45-4c3c-b0a2-3e6accf354a9',
        '45d1b1cb-e1de-481e-928f-6d206a074823',
        'fcd6136e-26a9-4979-aae5-7dc87b164d13',
        10
    ), (
        'fc36eec6-c990-48a2-83b0-bb1bdb1f063f',
        '45d1b1cb-e1de-481e-928f-6d206a074823',
        '29dc17e6-650e-499b-9eac-8e9425bec010',
        10
    );

INSERT INTO post
VALUES (
        'c04f78b6-7b78-4a18-9601-a4f75faf40f8',
        2,
        '45d1b1cb-e1de-481e-928f-6d206a074823',
        'Is this good?',
        'My workout plan is this'
    ), (
        '1aec56e8-a5c3-459b-ba91-1f01090f742b',
        1,
        '45d1b1cb-e1de-481e-928f-6d206a074823',
        'Good workout!',
        'My workout plan is this'
    );

INSERT INTO reply
VALUES (
        '28954311-e5c0-44a5-98ee-2461deb6e062',
        'c04f78b6-7b78-4a18-9601-a4f75faf40f8',
        '88fb9f9c-667b-41c3-bb39-91b329e8c270',
        'Good enough.',
        CURRENT_TIMESTAMP
    ), (
        '083f4bef-ce74-4e4c-9b10-c06624ee8bee',
        'c04f78b6-7b78-4a18-9601-a4f75faf40f8',
        'ecb3fd9b-5f81-463a-9817-9eb29c70afe2',
        'Very good.',
        CURRENT_TIMESTAMP
    );

INSERT INTO workout_progress
VALUES (
        'e36cabfa-9dce-4c8a-8a32-587e9ea2b30a',
        '23933b08-ea00-4bfd-992a-ab0985635606',
        '29dc17e6-650e-499b-9eac-8e9425bec010',
        5,
        CURRENT_DATE
    );
