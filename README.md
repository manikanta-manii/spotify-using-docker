This is the new spotify project , which is configured using Docker with Rails 8.0.2 & MySql Database

Steps to Run this project

1.Clone the Repository
2.Install Docker
3.Set Up Environment Variables - Ensure that your .env file (if used) or database.yml configuration is correctly set up with the appropriate MySQL credentials.
4.Build and Start the Containers
   docker-compose build
   docker-compose up -d
5.Run Database Migrations
   docker-compose exec web rails db:create db:migrate
6. Start Development
   You should now be able to access the app at http://localhost:3000 and start coding! 🎉