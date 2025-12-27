# ibraheem-ci-cd

This project is a simple CI/CD application built for course requirements.

The project is a restaurants web application using Node.js and Express.
EJS is used for the frontend and SQLite is used as the database.

The purpose of this project is to practice Git, Docker, and Jenkins CI/CD.

## Project Structure
- src: application source code
- tests: test files
- Dockerfile
- docker-compose.yml
- Jenkinsfile
- data.db

## Run locally
npm install
npm start

Open:
http://localhost:3000/restaurants

Admin login:
username: admin
password: admin123

## Run with Docker
docker-compose up -d --build

## Jenkins CI/CD
The Jenkins pipeline pulls the code from GitHub, runs tests, and deploys the application automatically.

## Author
Ibraheem
