
# Ionic Angular Project Setup Guide

This repository contains an Ionic application built using the Angular Framework. The setup includes steps to configure both Ionic and Angular CLI tools for seamless development. Dockerized setup instructions are also included.

---
<!-- TOC -->
* [Ionic Angular Project Setup Guide](#ionic-angular-project-setup-guide)
  * [Prerequisites](#prerequisites)
  * [Project Setup](#project-setup)
    * [1. Clone the Repository](#1-clone-the-repository)
    * [2. Install Dependencies](#2-install-dependencies)
  * [Running the Application](#running-the-application)
    * [Using Ionic CLI](#using-ionic-cli)
    * [Using Angular CLI](#using-angular-cli)
  * [Docker Setup](#docker-setup)
    * [Dockerfile](#dockerfile)
    * [Build and Run the Docker Container](#build-and-run-the-docker-container)
  * [Additional Commands](#additional-commands)
    * [Angular CLI Commands](#angular-cli-commands)
  * [Troubleshooting](#troubleshooting)
<!-- TOC -->

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v20.x or later recommended)
2. **npm** (v10.x or later)
3. **Ionic CLI** (v8.x or later)
   ```bash
   npm install -g @ionic/cli
   ```
4. **Angular CLI** (v18.x or later)
   ```bash
   npm install -g @angular/cli
   ```
5. **Docker** (v20.x or later)

---

## Project Setup

### 1. Clone the Repository

### 2. Install Dependencies
Run the following command to install the necessary dependencies:
```bash
npm install
```

---

## Running the Application

### Using Ionic CLI
To start the development server using the Ionic CLI:
```bash
ionic serve
```

The application will run on `http://localhost:8100` by default.

### Using Angular CLI
To start the development server using the Angular CLI:
```bash
ng serve
```

The application will run on `http://localhost:4200` by default.

---

## Docker Setup

### Dockerfile
Here’s the Dockerfile to containerize the Ionic and Angular application:

```dockerfile
# Use the Node.js LTS image
FROM node:16-alpine

# Install Ionic and Angular CLI globally
RUN npm install -g @ionic/cli @angular/cli

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Expose the default Ionic and Angular development server ports
EXPOSE 8100 4200

# Start the Ionic application
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100", "--disableHostCheck"]
```

### Build and Run the Docker Container

1. **Build the Docker image**:
   ```bash
   docker build -t ionic-angular-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8100:8100 -p 4200:4200 -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --rm ionic-angular-app
   ```

- To access the application using Ionic CLI, open `http://localhost:8100`.
- To access the application using Angular CLI, open `http://localhost:4200`.

---

## Additional Commands

### Angular CLI Commands
1. **Generate a Component, Service, or Module**:
   ```bash
   ng generate component <component-name>
   ng generate service <service-name>
   ng generate module <module-name>
   ```

2. **Run Unit Tests**:
   ```bash
   ng test
   ```

3. **Run End-to-End (E2E) Tests**:
   ```bash
   ng e2e
   ```

4. **Build the Application**:
   ```bash
   ng build --prod
   ```

---

## Troubleshooting

- **Missing CLI Tools**:
  - Ensure both Ionic and Angular CLI are globally installed using:
    ```bash
    npm install -g @ionic/cli @angular/cli
    ```

- **Port Conflicts**:
  - Ionic defaults to `http://localhost:8100`, and Angular defaults to `http://localhost:4200`. Modify the port in the respective CLI commands or Docker configuration if conflicts occur.

- **Docker Permission Issues**:
  - Ensure your Docker installation and user group permissions are properly configured.

---

Happy coding! 🎉

---
