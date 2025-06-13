# Developer Portfolio Management

A full-stack web application for developers to create and manage their professional portfolios.

## Features

- User authentication (login, register, password reset)
- Profile management
- Project management
- Public portfolio page
- Contact form

## Tech Stack

### Frontend
- React
- React Router
- Zustand (state management)
- Axios (API client)
- CSS

### Backend
- Flask (Python web framework)
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (authentication)
- MySQL (database)
- Flask-Mail (email service)

### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy)

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Python (for local development)

### Running with Docker

1. Clone the repository
2. Create a `.env` file in the root directory using the template from `env.example`:
   ```
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   JWT_SECRET_KEY=your-secure-jwt-key
   SECRET_KEY=your-secure-secret-key
   MYSQL_ROOT_PASSWORD=secure-root-password
   MYSQL_USER=portfolio_user
   MYSQL_PASSWORD=secure-user-password
   ```
3. Run the application:
   ```
   docker-compose up -d
   ```
4. Access the application:
   - Frontend: http://localhost (port 80)
   - Direct frontend access (if needed): http://localhost:9745
   - Direct backend API (if needed): http://localhost:7331

### Development Setup

#### Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the Flask app:
   ```
   python app.py
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the React app:
   ```
   npm start
   ```

## Deployment to Production

For production deployment, follow these steps:

1. Update your `.env` file with production values
2. Ensure all secrets are securely stored and not committed to version control
3. Deploy using Docker Compose:
   ```
   docker-compose up -d
   ```
4. For a production environment, consider:
   - Setting up HTTPS with Let's Encrypt
   - Implementing a CI/CD pipeline
   - Adding monitoring and logging solutions
   - Using a container orchestration platform like Kubernetes for larger deployments

## API Endpoints

- `POST /api/user/signup`: Create a new user account
- `POST /api/user/login`: Log in with email and password
- `POST /api/user/forgot-password`: Send a magic link to reset password
- `POST /api/user/reset-password`: Reset password using magic link
- `GET /api/user/profile`: Get user profile
- `PUT /api/user/profile`: Update user profile
- `GET /api/user/projects`: Get user projects
- `POST /api/user/projects`: Add a new project
- `PUT /api/user/projects/:id`: Update a project
- `DELETE /api/user/projects/:id`: Delete a project
- `GET /api/portfolio/:id`: Get public portfolio
- `POST /api/contact`: Send contact message

## License

This project is licensed under the MIT License. 