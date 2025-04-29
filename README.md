# Spotify Project

This is the new Spotify project, which is configured using Docker with Rails 8.0.2 & MySQL Database.

## Steps to Run this Project

1. **Clone the Repository**
   ```bash
   git clone <repository-url>


2. **Install Docker**
   ```bash

   Ensure Docker is installed on your system. You can download it from [Docker's official website](https://www.docker.com/).

3. **Set Up Environment Variables**
   ```bash

   Ensure that your `.env` file (if used) or `database.yml` configuration is correctly set up with the appropriate MySQL credentials.

4. **Build and Start the Containers**
   ```bash
   docker-compose build
   docker-compose up -d

   
5. **Run Database Migrations**
   ```bash
   docker-compose exec web rails db:create db:migrate

6. **Start Development**
    ```bash
   You should now be able to access the app at [http://localhost:3000](http://localhost:3000) and start coding! 🎉

```markdown