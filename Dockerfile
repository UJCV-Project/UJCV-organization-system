FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate

# Stage 2: Dev container
FROM node:18

WORKDIR /app

# Copy source code into container
COPY . .

# Install dependencies (inside the running container)
RUN npm install

# Set environment variables
ENV NODE_ENV=development
EXPOSE 3000

# Start in dev mode (hot reload)
CMD ["npm", "run", "start:dev"]