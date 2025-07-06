# 🌦 Weather API

A secure, scalable, and role-based backend API built with **Node.js** and **TypeScript**, integrated with the **OpenWeather API** for weather data. The project includes JWT-based authentication, Redis caching, CI/CD setup, and Swagger documentation.

> Developed by **Hamza Uraş** as part of a AppNation Software Engineer Case Study.

---

## 🧩 Project Overview

This backend service allows users to fetch current weather information for a specific city using the OpenWeather API. Access is **role-controlled**:  
- `ADMIN` roles can **create new users** and **view all weather queries**.  
- `USER` roles can only **view their own weather queries**.

---

## ⚙️ Tech Stack

| Area             | Tech                                    |
|------------------|-----------------------------------------|
| Language         | TypeScript                              |
| Runtime          | Node.js                                 |
| Framework        | Express.js                              |
| ORM              | Prisma                                  |
| Database         | PostgreSQL                              |
| Cache            | Redis                                   |
| Auth             | JWT-based authentication + Role control |
| External API     | OpenWeather API                         |
| Testing          | Jest, Supertest                         |
| CI/CD            | GitHub Actions                          |
| Documentation    | Swagger (OpenAPI 3.0)                   |
| Logging          | Winston + Daily Rotate File             |

---

## 🚀 Setup Instructions

# Environment Setup Instructions

This guide covers detailed installation steps for **Node.js**, **PostgreSQL**, and **Redis** on Windows, tailored for running the Weather API backend project.

---

## Node.js Installation

1. **Download Node.js:**
   - Visit [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
   - Download the **LTS (Long Term Support)** version for Windows.
   - Look below the web page, you can see Windows Installer (.msi)

2. **Install Node.js:**
   - Run the downloaded installer.
   - Use the default options.
   - Make sure to **check the option to add Node.js to your PATH** environment variable.
   - Complete the installation.

3. **Verify Installation:**
   - Open **Command Prompt** or **PowerShell**.
   - Run:
     ```bash
     node -v
     npm -v
     ```
   - You should see the installed versions of Node.js and npm.

---

## PostgreSQL Installation & Configuration (Windows)

This project requires a **PostgreSQL** server running locally on port `5432`.  
We recommend using **pgAdmin** for GUI-based database management.

### 1. Download PostgreSQL

- Official site: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Download the latest version for Windows (64-bit)

> 📌 **Important Locale Note:**  
> During setup, you will be asked for a **Locale**.  
> ❌ Do NOT choose the default `Locale`.  
> ✅ Instead, select `English, United States` to avoid encoding issues or installer bugs.

### 2. Installation Settings

- Set a password for the default `postgres` user — **remember this password**
- Setting password: `postgres` (highly recomended)
- Install **pgAdmin** along with PostgreSQL (enabled by default)
- By default, PostgreSQL will run on `localhost:5432`

### 3. Start PostgreSQL Service

After installation:

- Open **pgAdmin** or use **Windows Services** panel (`services.msc`)
- Make sure the service **"postgresql-x64-[version]"** is **Running**

## Redis Installation

1. **Download Redis for Windows:**
   - Official Redis does not support Windows natively.
   - Use [Memurai](https://www.memurai.com/get-memurai) (a native Redis-compatible Windows port)
   - Download Memurai for Redis Developer Edition

2. ****Install Memurai (WARNING!):****
   - **You need to follow these steps and run .msi file on cmd as administrator:**
  
### How to Run Memurai `.msi` Installer as Administrator from CMD

To install Memurai on Windows with administrator privileges via the command line:

1. **Open Command Prompt as Administrator:**
   - Press `Win` key.
   - Type `cmd`.
   - Right-click **Command Prompt** and select **Run as administrator**.

2. **Navigate to the folder where the `.msi` installer is located:**
   ```cmd
   cd C:\Users\hamza\Desktop\AppNation
   msiexec /i Memurai-for-Redis-v4.2.0.msi
   ```
   This will launch the Memurai installer with administrative rights, allowing proper installation.
   - Install Memurai for Windows.
   - Don't change default settings, esspecially port number:6379.

3. **Verify Redis is Running:**
   - Open **Command Prompt** or **PowerShell**.
   - Run:
     ```bash
     redis-cli ping
     ```
   - It should respond with:
     ```
     PONG
     ```
##  Setup Application

1. **You can either clone the repository using Git or download it as a zip file and extract its contents.**  
   ```bash
   git clone https://github.com/hamzauras/weather-api.git
   cd weather-api
   ```

2. **Install Dependencies (Make sure you are under the correct directory -> weather.api)**  
   ```bash
   npm install
   ```

3. **Environment Variables**  
   The .env and .env.test files are available within the project. You can use them as they are or modify their contents according to your development environment. For example, if you have your own API key, you can replace it, or if the ports are not suitable, you can try using different ones. The project was developed on a Windows 10 operating system using Visual Studio Code.

   ```.env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/weather_db?schema=public"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="secretpassword123"
   HOST="http://localhost:"
   PORT=3000
   OPENWEATHER_API_KEY="89b98e64272b863efef8635c917b19a5"
   BASE_URL="http://api.openweathermap.org/data/2.5/weather"
   LOG_LEVEL=debug
   ```

   ```.env.test
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/weather_db_test?schema=public"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="secretpassword123TEST"
   HOST="http://localhost:"
   PORT=3001
   OPENWEATHER_API_KEY="89b98e64272b863efef8635c917b19a5"
   BASE_URL="http://api.openweathermap.org/data/2.5/weather"
   LOG_LEVEL=debug
   ```

4. **Setup Database**  
   ```bash
   npm run init:dbs
   ```

5. **Run the Application**  
   ```bash
   npm run seed 
   npm run dev
   ```
   The npm run seed command is used to create the initial admin user.
   - e-mail: admin@example.com
   - password: 123456
   Access the API at: `http://localhost:3000/api`

---

## 🔐 Authentication & Roles

- **JWT Authentication**:  
  Users receive a JWT on login. Include it in `Authorization: Bearer <token>` header.
  **If this step is skipped, none of the APIs (except login) will work. Therefore, after logging in and copying your token, you must click the "Authorize" button in the top right to authenticate.**
- **Role-based Control**:  
  - **Admin**: Create users, view all weather queries.  
  - **User**: View only their own weather queries.

---

## 📂 API Endpoints

Explore full API docs at: [Swagger UI](http://localhost:3000/api/docs)

| Method | Endpoint               | Access   | Description                     |
|--------|------------------------|----------|---------------------------------|
| POST   | `/auth/register`       | Admin    | Register a new user             |
| POST   | `/auth/login`          | Public   | Login and receive JWT           |
| GET    | `/users/`              | Admin    | Get all users info              |
| PUT    | `/users/:id`           | Admin    | Update a user's role            |
| DELETE | `/users/:id`           | Admin    | Delete a user                   |
| GET    | `/weather/:city`       | User     | Get current weather (cached)    |
| GET    | `/weather/my`          | User     | Get own query history           |
| GET    | `/weather/all`         | Admin    | View all queries                |

---

## 🧠 Explanation of Chosen Approaches

1. **Monolithic Architecture**  
   The decision to use a monolithic structure was driven by the project's scope and time constraints (3 days). A single application codebase ensures easier local development, simpler deployment, and unified logging. Given the anticipated load (weather queries up to hundreds of requests per minute), a well-structured monolith can scale vertically and, if needed, be extracted into microservices later.

2. **Express.js Framework**  
   Express.js was chosen for its minimalistic and unopinionated design. It offers a clear middleware model, rich ecosystem (e.g., `express.json`, `cors`), and excellent TypeScript support, enabling rapid development of RESTful APIs.

3. **TypeScript for Type Safety**  
   Using TypeScript provides compile-time checks via types and interfaces, reducing runtime errors. It enforces consistent data contracts for request/response payloads and database models (Prisma generates types).

4. **Prisma ORM**  
   Prisma's intuitive query builder and strong TypeScript integration simplify database operations. It generates type-safe client code based on the schema, supports migrations, and enables optimized SQL under the hood.

5. **PostgreSQL Database**  
   PostgreSQL offers robust relational features (ACID compliance, indexing, complex queries). The schema is normalized with proper indexing on frequently queried fields (e.g., userId, city).

6. **Redis Caching**  
   To reduce external API calls and improve response times, Redis caches weather data per city for 10 minutes (configurable). This drastically lowers latency and API usage costs.

7. **JWT-based Authentication**  
   JSON Web Tokens allow stateless, scalable authentication. Tokens carry userId and role, enabling role-based access without server-side session storage. Secret keys are stored securely in environment variables.

8. **Swagger (OpenAPI 3.0)**  
   Swagger provides interactive API documentation directly in the browser, facilitating quick exploration by frontend developers or QA. Annotations in route files generate a comprehensive spec.

9. **Winston Logging with Daily Rotation**  
   Winston, combined with `winston-daily-rotate-file`, produces structured logs with timestamps and severity levels. Daily rotation prevents log files from growing indefinitely and aids in historical analysis.

10. **Jest & Supertest for Testing**  
    Jest's rich feature set (mocks, snapshots, coverage) and Supertest's HTTP utilities ensure thorough unit and integration testing of endpoints. Setup/teardown scripts isolate test data.

11. **GitHub Actions CI/CD**  
    Automated workflows run on each push/PR to `main`, executing linting, tests with coverage, and TypeScript compilation. This ensures code quality, prevents regressions, and readies builds for deployment.

12. **Development Environment: VS Code**  
    Visual Studio Code was the editor of choice due to its strong TypeScript support, integrated terminal, debugging tools, and extensions like ESLint, Prettier, and Prisma.

---

## 🧪 Testing

```bash
npm run test
```
- **Coverage Reports** generated in `coverage/`.
- **Global Setup/Teardown** flushes test database and Redis.

---

## 🤖 CI/CD (GitHub Actions)

See `.github/workflows/ci-pipeline.yml` for pipeline details:
- Node.js setup, dependencies cache
- Unit + integration testing 
- Code coverage reports
- TypeScript build
- Error tracking and monitoring
Tests run on each push to main.
---

## 📌 Future Improvements

- Rate limiting per IP
- Containerize with Docker Compose
- Email/password reset support
- API versioning
- Permanent data backup

---

## 👤 Author

**Hamza Uraş**  
[LinkedIn](https://www.linkedin.com/in/hamza-uras)

---

## 📄 License

MIT – feel free to use, improve, and share.
