
## Next.js Project: Lead Management System

This project is built using Next.js for both frontend and backend development. It provides functionalities to manage lead data and demonstrates API usage, including a dummy API for testing purposes.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

Node.js (v14 or later)

npm (Node Package Manager)

## Installation

Clone the repository to your local machine.

```git clone https://github.com/iharsh220/Gynoveda_LMS.git```

Navigate to the project directory.

```cd Gynoveda_LMS```

Install the required packages with the following command (use --force if necessary):

```npm install --force```

## Running the Project

Start the development server with:

```npm run dev```

The project will run at `http://localhost:3000` by default.

## API Endpoints

## Leads Management

Get all leads

```GET /api/leads```

Retrieves all lead data.

Store lead data

```POST /api/leads```

Stores new lead data.

Fetch lead by ID

```GET /api/leads/:id```

Retrieves lead data by ID.

Update lead by ID

```PUT /api/leads/:id```

Updates lead data by ID.

## Dummy API for Testing

Trigger random outcome

```POST /api/call```

This API triggers a random true or false response. It is used to set up a cron job in Vercel and update user data status from "Pending" to "Appointment Booked."

## Environment Variables

Ensure the following environment variables are set in a .env file at the root of the project:

```DB_NAME=<your_database_name>
DB_USER=<your_database_username>
DB_PASSWORD=<your_database_password>
DB_HOST=<your_database_hosturl>
HOST_URL=http://localhost:3000```

## Live Testing URL

Test the project live at:
[Next.js deployment documentation](https://gynoveda-lms-hnmj-pf9ixyqlq-hgohil220-gmailcoms-projects.vercel.app)

## Notes

Ensure the required environment variables (if any) are correctly set up before running the project.

For production deployment, additional configurations may be required.

