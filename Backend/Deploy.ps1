# If not logged in already.
# heroku container:login

heroku container:push -a befit-backend web
heroku container:release -a befit-backend web
