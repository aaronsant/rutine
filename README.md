# Project Name

Rutine

## Description

Rutine is a productivity web application designed to help you manage and track your daily, weekly, and monthly habits. With a clean and uncluttered design, Rutine focuses on making it easy for users to stay organized and monitor their progress over time. Built using React, Node.js, Express, and PostgreSQL, Rutine offers a seamless experience across devices and provides powerful tools to keep you on track.

Access the prject at [www.myrutine.com](www.myrutine.com)

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Design and Architecture](#project-design-and-architecture)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- React.js
- Node.js
- Express.js
- PostgreSQL

## Project Design and Architecture

- **Frontend**: The frontend can be found in the client folder and was built using functional components in React.js. In the src folder you can find the index.js and App.jsx files along with folders for pages and components. The pages folder contains code to structure each of the main pages using the components from the components folder. Some libraries used in the frontend include React-router-dom, axios, Material UI, Date-fns, Recharts, and dnd kit.
- **Backend**: The backend can be found in the server folder and was build using Node.js and Express.js. The config folder contains configuration for PostgreSQL database and Passport for authentication. The routes and controllers folders contains the logic for the REST api including the CRUD operations for the PostgreSQL database. Finally the tasks folder contains logic for scheduled tasks such as automatically inserting habits for future days. Some libraries used in backend include Passport, Bcrypt, PG, PG-format, Node-cron, axios, CORS, and express-session   
- **Database**: The database used was a PostgreSQL database. The Schema for the project include 3 tables that individually handle users, general habit details, and habit progress. Each row in users contains information about a user, each habit row in the habit details table contains the general information on a habit and references a user from the users table, and each progress row in the progress table references a habit from the habit details table along with information on the progress for that habit for its appropriate time period (day, week, month).

## Running the Project

The project is up and running at www.myrutine.com.

## Contributing

If you find any areas for improvement or want to make contributions to the project please let me know! Contact me at aaron.sant22@gmail.com


