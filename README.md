# Frontend4 Project

## Overview

This project consists of a client-side and an admin-side application built using Node.js and Express. The client-side allows users to view products and chat with support, while the admin-side provides tools for managing products and communicating with customers.

## Project Structure

```
Frontend4
├── AdminSide
│   ├── index.js
│   ├── package.json
│   ├── websocket.js
│   ├── graphql
│   │   └── schema.js
│   └── public
│       └── admin.html
├── ClientSide
│   ├── index.js
│   ├── package.json
│   ├── products.json
│   └── public
│       └── index.html
├── Server
│   └── products.json
├── docker-compose.yml
├── Dockerfile.admin
├── Dockerfile.client
└── README.md
```

## Setup Instructions

### Prerequisites

- Docker
- Docker Compose

### Docker and Docker Compose Setup

1. **Dockerfile.admin**: 
   - Uses an official Node.js image.
   - Sets the working directory.
   - Copies the `AdminSide` directory into the container.
   - Installs dependencies using `npm install`.
   - Exposes the port used by the admin server.
   - Command to start the server.

2. **Dockerfile.client**: 
   - Uses an official Node.js image.
   - Sets the working directory.
   - Copies the `ClientSide` directory into the container.
   - Installs dependencies using `npm install`.
   - Exposes the port used by the client server.
   - Command to start the server.

3. **docker-compose.yml**: 
   - Defines services for the admin and client sides.
   - Specifies build context and Dockerfile for each service.
   - Maps container ports to the host.

### Example Dockerfile.admin

```
FROM node:14
WORKDIR /usr/src/app
COPY AdminSide/package.json ./
RUN npm install
COPY AdminSide ./
EXPOSE 8080
CMD ["node", "index.js"]
```

### Example Dockerfile.client

```
FROM node:14
WORKDIR /usr/src/app
COPY ClientSide/package.json ./
RUN npm install
COPY ClientSide ./
EXPOSE 3000
CMD ["node", "index.js"]
```

### Example docker-compose.yml

```
version: '3'
services:
  admin:
    build:
      context: .
      dockerfile: Dockerfile.admin
    ports:
      - "8080:8080"
  
  client:
    build:
      context: .
      dockerfile: Dockerfile.client
    ports:
      - "3000:3000"
```

### Running the Application

To start the application, navigate to the project root directory and run:

```
docker-compose up --build
```

This command will build the images and start the containers for both the admin and client sides of the application.