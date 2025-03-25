# Task Assignment App - Full Stack Setup

This repository contains the full-stack Task Assignment application, including a **React frontend**, a **NestJS backend**, and **PostgreSQL & MongoDB databases**. Everything is containerized using **Docker Compose** for easy setup and deployment.

---

## Prerequisites
Before starting, ensure you have the following installed:
- **Docker** ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** ([Install Docker Compose](https://docs.docker.com/compose/install/))

---

## 1. Setting Up the Application
This guide will help you run the **backend, frontend, and databases** in Docker containers.

### **Step 1: Clone the Repository**
```sh
# Clone the project repository
git clone https://github.com/your-repo/task-assignment.git
cd task-assignment
```

### **Step 2: Navigate to the Backend Folder**
```sh
cd nest-app
```

### **Step 3: Start the Application with Docker Compose**
```sh
docker-compose up --build
```
This will:
- Build and start the **frontend** (React + Nginx)
- Build and start the **backend** (NestJS + PostgreSQL + MongoDB)
- Serve everything in **Docker containers**

---

## 🛠 2. Installing Backend (NestJS)
If you want to run the backend **without Docker**, follow these steps:

### **Step 1: Install Dependencies**
```sh
cd nest-app
npm install
```

### **Step 2: Configure Environment Variables**
Create a `.env` file in the `nest-app` folder and add:
```
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydb
MONGO_URL=mongodb://localhost:27017/mydb
JWT_SECRET=mysecretkey
```

### **Step 3: Run the Backend**
```sh
npm run start:dev
```
Your backend will be running on: **http://localhost:3000**

---

## 3. Installing Frontend (React)
If you want to run the frontend **without Docker**, follow these steps:

### **Step 1: Install Dependencies**
```sh
cd tasks-assignment-app
npm install
```

### **Step 2: Run the Frontend**
```sh
npm start
```
Your frontend will be running on: **http://localhost:3000** (default React port)

---

## 4. Accessing the Application

### **Frontend (React)**
- URL: [http://localhost](http://localhost) (when using Docker)
- URL: [http://localhost:3000](http://localhost:3000) (when using `npm start`)

### **Backend (NestJS API)**
- URL: [http://localhost:3000](http://localhost:3000)
- Example API Endpoint: [http://localhost:3000/api](http://localhost:3000/api)

---

## 5. Accessing Databases

### **PostgreSQL**
- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `myuser`
- **Password**: `mypassword`
- **Database**: `mydb`
- **Connect using PGAdmin or any PostgreSQL client**:
  ```sh
  psql -h localhost -U myuser -d mydb
  ```

### **MongoDB**
- **Host**: `localhost`
- **Port**: `27017`
- **Database**: `mydb`
- **Connect using MongoDB Compass or Mongo Shell**:
  ```sh
  mongo mongodb://localhost:27017/mydb
  ```

---

## 6. Running Backend Test Cases
To run test cases for the backend, follow these steps:

### **Step 1: Navigate to the Backend Folder**
```sh
cd nest-app
```

### **Step 2: Run Unit Tests**
```sh
npm run test
```

### **Step 3: Run End-to-End (E2E) Tests**
```sh
npm run test:e2e
```

### **Step 4: Run Tests with Coverage Report**
```sh
npm run test:cov
```
This will generate a coverage report showing which parts of your code are covered by tests.

---

## Stopping the Application
To stop the application and remove all running containers, use:
```sh
docker-compose down
```

---

## Notes
- If you face any port conflicts, make sure **ports 3000, 80, 5432, and 27017** are available.
- Modify `.env` file to update environment variables.
- For production, use `npm run build` for backend and frontend.

